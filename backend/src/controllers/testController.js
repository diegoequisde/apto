const asyncHandler = require('../middlewares/asyncHandler');
const pool = require('../config/db');
const xerarDistribucionExame = require('../utils/generadorExamenOficial');
const { crearExameOficial } = require('../services/examenOficialService');
const { obterConfiguracionExame } = require('../config/examenesOficiais');

const {
    findAllTests,
    findTestsByUsuario,
    findResultadoTest,
    findTestById,
    insertTest,
    updateTestById,
    deleteTestById
} = require('../services/testService');


const {
    findPreguntasAleatorias
} = require('../services/preguntaService');


const {
    insertPreguntaToTest,
    findRevisionByTest,
    calcularResultadoTest
} = require('../services/preguntaTestService');

const {
    obtenerEstadisticas
} = require('../services/estadisticasService');

const getTests = asyncHandler(async (req, res) => {

        const tests = await findAllTests();

        res.json(tests);

});

const getResultadoTest = asyncHandler(async(req,res)=>{

    const {id} =
    req.params;

    const resultado =
    await findResultadoTest(
        id,
        req.usuario.id
    );

    res.json(resultado);

});

const getEstadisticas = asyncHandler(async(req,res)=>{

const periodo =
    req.query.periodo || 'total';

const datos =
    await obtenerEstadisticas(
        req.usuario.id,
        periodo
    );


res.json(datos);

});

const getHistorial = asyncHandler(async(req,res)=>{

  const tests =
    await findTestsByUsuario(
        req.usuario.id
    );

    res.json(tests);

});


const getTestById = asyncHandler(async (req, res) => {

        const { id } = req.params;

        const test = await findTestById(
            id,
            req.usuario.id
        );

        if (!test) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Test non encontrado'
            });

        }

        res.json(test);

});

const createTest = asyncHandler(async (req, res) => {

    const {
        temas,
        duracion
    } = req.body;

    
    // Los usuarios FREE solo pueden utilizar sus propios temas
    if (req.usuario.tipo === 'free') {

        for (const tema of temas) {

            const [rows] = await pool.query(`
                SELECT id_tema
                FROM tema
                WHERE id_tema = ?
                AND id_usuario = ?
                AND estado_tema = 'activo'
            `, [
                tema.id_tema,
                req.usuario.id
            ]);

            if (rows.length === 0) {

                return res.status(403).json({
                    ok: false,
                    mensaje: 'Tu cuenta gratuíta sólo puede generar tests con tus temas personalizados.'
                });

            }

        }

    }

    const id_test =
        await insertTest(
            req.usuario.id,
            duracion
        );

   let preguntas = [];

    for (const tema of temas) {

        const preguntasTema =
            await findPreguntasAleatorias(
                tema.id_tema,
                tema.cantidad
            );

        // Comprobación
        if (preguntasTema.length < tema.cantidad) {

            return res.status(400).json({
                ok:false,
                mensaje: `El tema ${tema.nome} sólo dispone de ${preguntasTema.length} preguntas disponibles.`
            });

        }

        preguntas.push(
            ...preguntasTema
        );

    }

    // Mezclar todas las preguntas
    preguntas.sort(
        () => Math.random() - 0.5
    );

    for (let i = 0; i < preguntas.length; i++) {

        await insertPreguntaToTest(
            id_test,
            preguntas[i].id_pregunta,
            i + 1
        );

    }

    res.status(201).json({
        ok: true,
        mensaje: 'Test creado correctamente',
        id_test
    });

});

const createTestOficial = asyncHandler(async (req, res) => {

    try {

        const {
            id_oposicion
        } = req.body;

        const configuracion =
            obterConfiguracionExame(id_oposicion);

        const id_test =
            await insertTest(
                req.usuario.id,
                configuracion.duracion
            );

        const preguntas =
            await crearExameOficial(
                id_oposicion
            );
 
        for (let i = 0; i < preguntas.length; i++) {

            await insertPreguntaToTest(
                id_test,
                preguntas[i].id_pregunta,
                i + 1
            );

        }

        res.status(201).json({
            ok: true,
            mensaje: 'Exame oficial creado correctamente',
            id_test,
            duracion: configuracion.duracion
        });

    } catch (error) {

        console.error(error);

        throw error;

    }

});

const updateTest = asyncHandler(async (req, res) => {

    const { id } =
    req.params;
    
    let {
        duracion,
        resultado,
        finalizado
    } = req.body;

    if (finalizado == 1) {

    const test = await findTestById(
        id,
        req.usuario.id
    );

    if (!test) {
        return res.status(404).json({
            ok: false,
            mensaje: 'Test no encontrado'
        });
    }

    const inicio =
        new Date(test.data_realizacion);

    duracion =
        Math.floor(
            (Date.now() - inicio.getTime()) / 1000
        );
}

    let resultadoFinal =
    resultado;

    if(finalizado == 1){


        resultadoFinal =
        await calcularResultadoTest(
            id
        );
    }

    const result =
    await updateTestById(
        id,
        req.usuario.id,
        duracion,
        resultadoFinal,
        finalizado
    );



    if(result.affectedRows === 0){

        return res.status(404).json({
            ok:false,
            mensaje: 'Test non encontrado'

        });

    }


    res.json({
        ok:true,
        mensaje: 'Test actualizado correctamente',
        resultado:
        resultadoFinal
    });
});

const deleteTest = asyncHandler(async (req, res) => {

    
        const { id } = req.params;

        const result = await deleteTestById(id, req.usuario.id);

        if (result.affectedRows === 0) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Test non encontrado'
            });

        }

        res.json({
            ok: true,
            mensaje: 'Test eliminado correctamente'
        });

});

const getRevisionTest = asyncHandler(async (req,res)=>{

    const { id } =
    req.params;

    const revision =
    await findRevisionByTest(id, req.usuario.id);

    res.json(revision);

});

module.exports = {
    getTests,
    getResultadoTest,
    getEstadisticas,
    getHistorial,
    getTestById,
    createTest,
    createTestOficial,
    updateTest,
    deleteTest,
    getRevisionTest
};
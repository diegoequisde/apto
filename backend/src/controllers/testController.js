const asyncHandler = require('../middlewares/asyncHandler');

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
    await findResultadoTest(id);

    res.json(resultado);

});

const getEstadisticas = asyncHandler(async(req,res)=>{

const id_usuario = 1;

const periodo =
req.query.periodo || 'total';

const datos =
await obtenerEstadisticas(
id_usuario,
periodo
);


res.json(datos);

});

const getHistorial = asyncHandler(async(req,res)=>{

    const id_usuario = 1;

    const tests =
    await findTestsByUsuario(
        id_usuario
    );

    res.json(tests);

});


const getTestById = asyncHandler(async (req, res) => {

        const { id } = req.params;

        const test = await findTestById(id);

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
        id_usuario,
        id_tema,
        cantidad
    } = req.body;


    const id_test =
    await insertTest(
        id_usuario,
        null
    );


    const preguntas =
    await findPreguntasAleatorias(
        id_tema,
        cantidad
    );


    for(
        let i = 0;
        i < preguntas.length;
        i++
    ){

        await insertPreguntaToTest(
            id_test,
            preguntas[i].id_pregunta,
            i + 1
        );
    }

    res.status(201).json({

        ok:true,

        mensaje:
        'Test creado correctamente',

        id_test
        
    });

});

const updateTest = asyncHandler(async (req, res) => {

    const { id } =
    req.params;

    const {
        duracion,
        resultado,
        finalizado
    } = req.body;


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

        const result = await deleteTestById(id);

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
    await findRevisionByTest(id);


    res.json(revision);


});

module.exports = {
    getTests,
    getResultadoTest,
    getEstadisticas,
    getHistorial,
    getTestById,
    createTest,
    updateTest,
    deleteTest,
    getRevisionTest
};
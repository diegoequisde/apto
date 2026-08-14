const asyncHandler = require('../middlewares/asyncHandler');

const {
    findAllPreguntas,
    findPreguntaById,
    crearPreguntaCompleta,
    updatePreguntaById,
    deletePreguntaById,
    contarPreguntasUsuario
} = require('../services/preguntaService');

const getPreguntas = asyncHandler(async (req, res) => {
    const page =
        Number(req.query.page) || 1;

    const limit =
        Number(req.query.limit) || 20;

    const idTema =
        req.query.idTema || null;

    const preguntas =
        await findAllPreguntas(
            page,
            limit,
            idTema,
            req.usuario.id
        );

    res.json(preguntas);

});

const getPreguntaById = asyncHandler(async (req, res) => {

        const { id } = req.params;

        const pregunta = 
        await findPreguntaById(
            id,
            req.usuario.id
        );

        if (!pregunta) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Pregunta no encontrada'
            });

        }

        res.json(pregunta);

});

const createPregunta = asyncHandler(async (req, res) => {

    const {
        enunciado,
        id_tema,
        opciones
    } = req.body;

    const id_usuario =
        req.usuario.id;

    if (req.usuario.tipo === 'free') {

        const total =
            await contarPreguntasUsuario(
                id_usuario
            );

        if (total >= 40) {

           const error = new Error( 'La cuenta gratuita permite crear un máximo de 40 preguntas. Actualiza a Premium para eliminar este límite.' );
           error.status = 403;
           throw error;

        }

    }

    const id_pregunta = 
        await crearPreguntaCompleta( 
            enunciado, 
            id_tema, 
            id_usuario, 
            opciones 
        );
        
    res.status(201).json({ 
        ok: true, 
        mensaje: 'Pregunta creada correctamente', 
        id_pregunta 
    });
});

const updatePregunta = asyncHandler(async (req, res) => {
const { id } = req.params;

    const {
        enunciado,
        id_tema
    } = req.body;

    const result =
        await updatePreguntaById(
            id,
            enunciado,
            id_tema,
            req.usuario.id
        );

    if (result.affectedRows === 0) {

        return res.status(404).json({
            ok: false,
            mensaje: 'Pregunta no encontrada'
        });

    }

    res.json({
        ok: true,
        mensaje: 'Pregunta actualizada correctamente'
    });

});

const deletePregunta = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const result =
        await deletePreguntaById(
            id,
            req.usuario.id
        );

    if (result.affectedRows === 0) {

        return res.status(404).json({
            ok: false,
            mensaje: 'Pregunta no encontrada'
        });

    }

    res.json({
        ok: true,
        mensaje: 'Pregunta eliminada correctamente'
    });

});

module.exports = {
    getPreguntas,
    getPreguntaById,
    createPregunta,
    updatePregunta,
    deletePregunta

};
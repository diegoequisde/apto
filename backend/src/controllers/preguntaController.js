const asyncHandler = require('../middlewares/asyncHandler');

const {
    findAllPreguntas,
    findPreguntaById,
    insertPregunta,
    updatePreguntaById,
    deletePreguntaById
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
            idTema
        );

    res.json(preguntas);

});

const getPreguntaById = asyncHandler(async (req, res) => {

        const { id } = req.params;

        const pregunta = await findPreguntaById(id);

        if (!pregunta) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Pregunta non encontrada'
            });

        }

        res.json(pregunta);

});

const createPregunta = asyncHandler (async (req, res) => {

    const {
        enunciado,
        id_tema,
        id_usuario
    } = req.body;

    if(req.usuario.tipo === 'free'){

    const total = await preguntaService.contarPreguntasUsuario(req.usuario.id);

        if(total >= 40){

            return res.status(403).json({
                mensaje: 'La cuenta gratuíta permite crear un máximo de 40 preguntas. Actualiza a Premium para eliminar este límite.'
            });

        }

    }
    const id_pregunta = await insertPregunta(
        enunciado,
        id_tema,
        id_usuario
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

    const result = await updatePreguntaById(
        id,
        enunciado,
        id_tema
    );

    if (result.affectedRows === 0) {

        return res.status(404).json({
            ok: false,
            mensaje: 'Pregunta non encontrada'
        });

    }

    res.json({
        ok: true,
        mensaje: 'Pregunta actualizada correctamente'
    });

});

const deletePregunta = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const result = await deletePreguntaById(id);

    if (result.affectedRows === 0) {

        return res.status(404).json({
            ok: false,
            mensaje: 'Pregunta non encontrada'
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
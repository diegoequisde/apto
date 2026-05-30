const asyncHandler = require('../middlewares/asyncHandler');

const {
    findAllPreguntas,
    findPreguntaById,
    insertPregunta,
    updatePreguntaById,
    deletePreguntaById
} = require('../services/preguntaService');

const getPreguntas = asyncHandler(async (req, res) => {

        const preguntas = await findAllPreguntas();

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
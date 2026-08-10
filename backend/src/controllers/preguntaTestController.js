const asyncHandler = require('../middlewares/asyncHandler');

const {
    findPreguntasByTest,
    insertPreguntaToTest,
    answerPregunta,
    deletePreguntaTest
} = require('../services/preguntaTestService');

const getPreguntasByTest = asyncHandler (async (req, res) => {

        const { id } = req.params;

        const preguntas = await findPreguntasByTest(id);

        res.json(preguntas);

});

const addPreguntaToTest = asyncHandler(async (req, res) => {

        const { id } = req.params;

        const {
            id_pregunta,
            orde
        } = req.body;

        await insertPreguntaToTest(
            id,
            id_pregunta,
            orde
        );

        res.status(201).json({
            ok: true,
            mensaje: 'Pregunta añadida al test'
        });

});

const answerPreguntaTest = asyncHandler (async (req, res) => {

        const { id, idPregunta } = req.params;

        const { resposta_usuario } = req.body;

        const result = await answerPregunta(
            id,
            idPregunta,
            resposta_usuario
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Pregunta del test no encontrada'
            });

        }

        res.json({
            ok: true,
            mensaje: 'Respuesta guardada correctamente'
        });

});

const deletePreguntaFromTest = asyncHandler(async (req, res) => {

        const { id, idPregunta } = req.params;

        const result = await deletePreguntaTest(
            id,
            idPregunta
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Pregunta del test no encontrada'
            });

        }

        res.json({
            ok: true,
            mensaje: 'Pregunta eliminada del test'
        });

});

module.exports = {
    getPreguntasByTest,
    addPreguntaToTest,
    answerPreguntaTest,
    deletePreguntaFromTest
};
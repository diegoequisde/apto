const {
    findPreguntasByTest,
    insertPreguntaToTest,
    answerPregunta,
    deletePreguntaTest
} = require('../services/preguntaTestService');

const getPreguntasByTest = async (req, res, next) => {

    try {

        const { id } = req.params;

        const preguntas = await findPreguntasByTest(id);

        res.json(preguntas);

    } catch (error) {

        next(error);

    }

};

const addPreguntaToTest = async (req, res, next) => {

    try {

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
            mensaje: 'Pregunta añadida ao test'
        });

    } catch (error) {

        next(error);

    }

};

const answerPreguntaTest = async (req, res, next) => {

    try {

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
                mensaje: 'Pregunta do test non encontrada'
            });

        }

        res.json({
            ok: true,
            mensaje: 'Resposta gardada correctamente'
        });

    } catch (error) {

        next(error);

    }

};

const deletePreguntaFromTest = async (req, res, next) => {

    try {

        const { id, idPregunta } = req.params;

        const result = await deletePreguntaTest(
            id,
            idPregunta
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Pregunta do test non encontrada'
            });

        }

        res.json({
            ok: true,
            mensaje: 'Pregunta eliminada do test'
        });

    } catch (error) {

        next(error);

    }

};

module.exports = {
    getPreguntasByTest,
    addPreguntaToTest,
    answerPreguntaTest,
    deletePreguntaFromTest
};
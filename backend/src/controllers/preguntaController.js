const {
    findAllPreguntas,
    findPreguntaById,
    insertPregunta,
    updatePreguntaById,
    deletePreguntaById
} = require('../services/preguntaService');

const getPreguntas = async (req, res, next) => {

    try {

        const preguntas = await findAllPreguntas();

        res.json(preguntas);
 

    } catch (error) {

    next(error);

}

};

const getPreguntaById = async (req, res, next) => {

    try {

        const { id } = req.params;

        const pregunta = await findPreguntaById(id);

        if (!pregunta) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Pregunta non encontrada'
            });

        }

        res.json(pregunta);

    } catch (error) {

    next(error);

}

};

const createPregunta = async (req, res, next) => {

    try {

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

    } catch (error) {

    next(error);

}

};

const updatePregunta = async (req, res, next) => {

    try {

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

    } catch (error) {

    next(error);

}

};

const deletePregunta = async (req, res, next) => {

    try {

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

    } catch (error) {

    next(error);

}

};

module.exports = {
    getPreguntas,
    getPreguntaById,
    createPregunta,
    updatePregunta,
    deletePregunta

};
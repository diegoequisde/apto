const {
    findOpcionesByPregunta,
    insertOpcion,
    updateOpcionById,
    deleteOpcionById
} = require('../services/opcionService');

const getOpcionesByPregunta = async (req, res, next) => {

    try {

        const { id } = req.params;

        const opciones = await findOpcionesByPregunta(id);

        res.json(opciones);

    } catch (error) {

        next(error);

    }

};

const createOpcion = async (req, res, next) => {

    try {

        const { id } = req.params;

        const {
            letra_opcion,
            texto,
            e_correcta
        } = req.body;

        await insertOpcion(
            id,
            letra_opcion,
            texto,
            e_correcta
        );

        res.status(201).json({
            ok: true,
            mensaje: 'Opción creada correctamente'
        });

    } catch (error) {

        next(error);

    }

};

const updateOpcion = async (req, res, next) => {

    try {

        const { id, letra } = req.params;

        const {
            texto,
            e_correcta
        } = req.body;

        const result = await updateOpcionById(
            id,
            letra,
            texto,
            e_correcta
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Opción non encontrada'
            });

        }

        res.json({
            ok: true,
            mensaje: 'Opción actualizada correctamente'
        });

    } catch (error) {

        next(error);

    }

};

const deleteOpcion = async (req, res, next) => {

    try {

        const { id, letra } = req.params;

        const result = await deleteOpcionById(
            id,
            letra
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Opción non encontrada'
            });

        }

        res.json({
            ok: true,
            mensaje: 'Opción eliminada correctamente'
        });

    } catch (error) {

        next(error);

    }

};

module.exports = {
    getOpcionesByPregunta,
    createOpcion,
    updateOpcion,
    deleteOpcion
};
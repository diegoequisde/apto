const asyncHandler = require('../middlewares/asyncHandler');

const {
    findOpcionesByPregunta,
    insertOpcion,
    updateOpcionById,
    deleteOpcionById
} = require('../services/opcionService');

const getOpcionesByPregunta = asyncHandler(async (req, res) => {

        const { id } = req.params;

        const opciones = await findOpcionesByPregunta(id, req.usuario);

        res.json(opciones);

});

const createOpcion = asyncHandler(async (req, res) => {

    
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
            e_correcta,
            req.usuario
        );

        res.status(201).json({
            ok: true,
            mensaje: 'Opción creada correctamente'
        });

});

const updateOpcion = asyncHandler(async (req, res) => {

        const { id, letra } = req.params;

        const {
            texto,
            e_correcta
        } = req.body;

        const result = await updateOpcionById(
            id,
            letra,
            texto,
            e_correcta,
            req.usuario
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

});

const deleteOpcion = asyncHandler(async (req, res) => {

        const { id, letra } = req.params;

        const result = await deleteOpcionById(
            id,
            letra,
            req.usuario
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

});

module.exports = {
    getOpcionesByPregunta,
    createOpcion,
    updateOpcion,
    deleteOpcion
};
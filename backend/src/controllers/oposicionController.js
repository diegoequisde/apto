    const asyncHandler = require('../middlewares/asyncHandler');
    
    const {
    findAllOposiciones,
    findOposicionById,
    insertOposicion,
    updateOposicionById,
    deleteOposicionById
} = require('../services/oposicionService');

const getOposiciones = asyncHandler(async (req, res) => {

        const oposiciones = await findAllOposiciones();

        res.json(oposiciones);

});

const getOposicionById = asyncHandler(async (req, res) => {

        const { id } = req.params;

        const oposicion = await findOposicionById(id);

        if (!oposicion) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Oposición non encontrada'
            });

        }

        res.json(oposicion);

});

const createOposicion = asyncHandler(async (req, res) => {

        const {
            nome_oposicion,
            descripcion_oposicion
        } = req.body;

        const id_oposicion = await insertOposicion(
            nome_oposicion,
            descripcion_oposicion
        );

        res.status(201).json({
            ok: true,
            mensaje: 'Oposición creada correctamente',
            id_oposicion
        });

});

const updateOposicion = asyncHandler(async (req, res) => {

        const { id } = req.params;

        const {
            nome_oposicion,
            descripcion_oposicion
        } = req.body;

        const result = await updateOposicionById(
            id,
            nome_oposicion,
            descripcion_oposicion
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Oposición non encontrada'
            });

        }

        res.json({
            ok: true,
            mensaje: 'Oposición actualizada correctamente'
        });

});

const deleteOposicion = asyncHandler(async (req, res) => {

        const { id } = req.params;

        const result = await deleteOposicionById(id);

        if (result.affectedRows === 0) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Oposición non encontrada'
            });

        }

        res.json({
            ok: true,
            mensaje: 'Oposición eliminada correctamente'
        });

});

module.exports = {
    getOposiciones,
    getOposicionById,
    createOposicion,
    updateOposicion,
    deleteOposicion
};
const asyncHandler = require('../middlewares/asyncHandler');

const {
    findTemasByOposicion,
    insertTemaToOposicion,
    deleteTemaFromOposicionById
} = require('../services/oposicionTemaService');

const getTemasByOposicion = asyncHandler (async (req, res) => {

        const { id } = req.params;

        const temas = await findTemasByOposicion(id);

        res.json(temas);

});

const addTemaToOposicion = asyncHandler (async (req, res) => {

        const { id } = req.params;

        const { id_tema } = req.body;

        await insertTemaToOposicion(
            id,
            id_tema
        );

        res.status(201).json({
            ok: true,
            mensaje: 'Tema añadido a la oposición'
        });

});

const deleteTemaFromOposicion = asyncHandler (async (req, res) => {

        const { id, id_tema } = req.params;

        const result = await deleteTemaFromOposicionById(
            id,
            id_tema
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Relación no encontrada'
            });

        }

        res.json({
            ok: true,
            mensaje: 'Tema eliminado de la oposición'
        });

});

module.exports = {
    getTemasByOposicion,
    addTemaToOposicion,
    deleteTemaFromOposicion
};
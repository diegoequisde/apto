    const {
    findAllOposiciones,
    findOposicionById,
    insertOposicion,
    updateOposicionById,
    deleteOposicionById
} = require('../services/oposicionService');

const getOposiciones = async (req, res, next) => {

    try {

        const oposiciones = await findAllOposiciones();

        res.json(oposiciones);

    } catch (error) {

        next(error);

    }

};

const getOposicionById = async (req, res, next) => {

    try {

        const { id } = req.params;

        const oposicion = await findOposicionById(id);

        if (!oposicion) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Oposición non encontrada'
            });

        }

        res.json(oposicion);

    } catch (error) {

        next(error);

    }

};

const createOposicion = async (req, res, next) => {

    try {

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

    } catch (error) {

        next(error);

    }

};

const updateOposicion = async (req, res, next) => {

    try {

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

    } catch (error) {

        next(error);

    }

};

const deleteOposicion = async (req, res, next) => {

    try {

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

    } catch (error) {

        next(error);

    }

};

module.exports = {
    getOposiciones,
    getOposicionById,
    createOposicion,
    updateOposicion,
    deleteOposicion
};
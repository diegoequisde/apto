const {
    findOposicionesByUsuario,
    insertOposicionToUsuario,
    deleteOposicionFromUsuarioById
} = require('../services/usuarioOposicionService');

const getOposicionesByUsuario = async (req, res, next) => {

    try {

        const { id } = req.params;

        const oposiciones = await findOposicionesByUsuario(id);

        res.json(oposiciones);

    } catch (error) {

        next(error);

    }

};

const addOposicionToUsuario = async (req, res, next) => {

    try {

        const { id } = req.params;

        const { id_oposicion } = req.body;

        await insertOposicionToUsuario(
            id,
            id_oposicion
        );

        res.status(201).json({
            ok: true,
            mensaje: 'Oposición añadida ao usuario'
        });

    } catch (error) {

        next(error);

    }

};

const deleteOposicionFromUsuario = async (req, res, next) => {

    try {

        const { id, idOposicion } = req.params;

        const result = await deleteOposicionFromUsuarioById(
            id,
            idOposicion
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Relación non encontrada'
            });

        }

        res.json({
            ok: true,
            mensaje: 'Oposición eliminada do usuario'
        });

    } catch (error) {

        next(error);

    }

};

module.exports = {
    getOposicionesByUsuario,
    addOposicionToUsuario,
    deleteOposicionFromUsuario
};
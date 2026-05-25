const {
    findTemasByOposicion,
    insertTemaToOposicion,
    deleteTemaFromOposicionById
} = require('../services/oposicionTemaService');

const getTemasByOposicion = async (req, res, next) => {

    try {

        const { id } = req.params;

        const temas = await findTemasByOposicion(id);

        res.json(temas);

    } catch (error) {

        next(error);

    }

};

const addTemaToOposicion = async (req, res, next) => {

    try {

        const { id } = req.params;

        const { id_tema } = req.body;

        await insertTemaToOposicion(
            id,
            id_tema
        );

        res.status(201).json({
            ok: true,
            mensaje: 'Tema añadido á oposición'
        });

    } catch (error) {

        next(error);

    }

};

const deleteTemaFromOposicion = async (req, res, next) => {

    try {

        const { id, idTema } = req.params;

        const result = await deleteTemaFromOposicionById(
            id,
            idTema
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Relación non encontrada'
            });

        }

        res.json({
            ok: true,
            mensaje: 'Tema eliminado da oposición'
        });

    } catch (error) {

        next(error);

    }

};

module.exports = {
    getTemasByOposicion,
    addTemaToOposicion,
    deleteTemaFromOposicion
};
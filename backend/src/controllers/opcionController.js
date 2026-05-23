const pool = require('../config/db');

const getOpcionesByPregunta = async (req, res, next) => {

    try {

        const { id } = req.params;

        const [rows] = await pool.query(`
            SELECT
                letra_opcion,
                texto,
                e_correcta
            FROM opcion
            WHERE id_pregunta = ?
        `, [id]);

        res.json(rows);

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

        await pool.query(`
            INSERT INTO opcion (
                id_pregunta,
                letra_opcion,
                texto,
                e_correcta
            )
            VALUES (?, ?, ?, ?)
        `, [
            id,
            letra_opcion,
            texto,
            e_correcta
        ]);

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

        const [result] = await pool.query(`
            UPDATE opcion
            SET
                texto = ?,
                e_correcta = ?
            WHERE id_pregunta = ?
            AND letra_opcion = ?
        `, [
            texto,
            e_correcta,
            id,
            letra
        ]);

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

        const [result] = await pool.query(`
            DELETE FROM opcion
            WHERE id_pregunta = ?
            AND letra_opcion = ?
        `, [
            id,
            letra
        ]);

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
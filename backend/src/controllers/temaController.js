const pool = require('../config/db');

const getTemas = async (req, res) => {

    try {

        const [rows] = await pool.query(`
            SELECT 
                id_tema,
                nome_tema,
                descripcion_tema,
                estado_tema
            FROM tema
            WHERE estado_tema = 'activo'
        `);

        res.json(rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            ok: false,
            mensaje: 'Erro ao obter temas'
        });

    }

};

const getTemaById = async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await pool.query(`
            SELECT
                id_tema,
                nome_tema,
                descripcion_tema,
                estado_tema
            FROM tema
            WHERE id_tema = ?
            AND estado_tema = 'activo'
        `, [id]);

        if (rows.length === 0) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Tema non encontrado'
            });

        }

        res.json(rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            ok: false,
            mensaje: 'Erro ao obter o tema'
        });

    }

};

const createTema = async (req, res) => {

    try {

        const {
            nome_tema,
            descripcion_tema
        } = req.body;

        const [result] = await pool.query(`
            INSERT INTO tema (
                nome_tema,
                descripcion_tema
            )
            VALUES (?, ?)
        `, [
            nome_tema,
            descripcion_tema
        ]);

        res.status(201).json({
            ok: true,
            mensaje: 'Tema creado correctamente',
            id_tema: result.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            ok: false,
            mensaje: 'Erro ao crear o tema'
        });

    }

};

const updateTema = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            nome_tema,
            descripcion_tema
        } = req.body;

        const [result] = await pool.query(`
            UPDATE tema
            SET
                nome_tema = ?,
                descripcion_tema = ?
            WHERE id_tema = ?
            AND estado_tema = 'activo'
        `, [
            nome_tema,
            descripcion_tema,
            id
        ]);

        if (result.affectedRows === 0) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Tema non encontrado'
            });

        }

        res.json({
            ok: true,
            mensaje: 'Tema actualizado correctamente'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            ok: false,
            mensaje: 'Erro ao actualizar o tema'
        });

    }

};

const deleteTema = async (req, res) => {

    try {

        const { id } = req.params;

        const [result] = await pool.query(`
            UPDATE tema
            SET estado_tema = 'inactivo'
            WHERE id_tema = ?
            AND estado_tema = 'activo'
        `, [id]);

        if (result.affectedRows === 0) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Tema non encontrado'
            });

        }

        res.json({
            ok: true,
            mensaje: 'Tema eliminado correctamente'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            ok: false,
            mensaje: 'Erro ao eliminar o tema'
        });

    }

};

module.exports = {
    getTemas,
    getTemaById,
    createTema,
    updateTema,
    deleteTema
};
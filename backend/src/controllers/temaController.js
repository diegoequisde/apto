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
module.exports = {
    getTemas,
    getTemaById
};
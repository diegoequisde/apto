const pool = require('../config/db');

const getPreguntas = async (req, res) => {

    try {

        const [rows] = await pool.query(`
            SELECT
                p.id_pregunta,
                p.enunciado,
                p.estado_pregunta,
                t.nome_tema,
                u.nome AS autor
            FROM pregunta p
            INNER JOIN tema t
                ON p.id_tema = t.id_tema
            LEFT JOIN usuario u
                ON p.id_usuario = u.id_usuario
            WHERE p.estado_pregunta = 'activa'
        `);
/*INNER JOIN tema Para obtener: nome_tema
LEFT JOIN usuario Porque: una pregunta oficial puede no tener usuario
o ser creada por admin y LEFT JOIN da más flexibilidad */

        res.json(rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            ok: false,
            mensaje: 'Erro ao obter preguntas'
        });

    }

};

const getPreguntaById = async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await pool.query(`
            SELECT
                p.id_pregunta,
                p.enunciado,
                p.estado_pregunta,
                p.id_tema,
                t.nome_tema,
                p.id_usuario,
                u.nome AS autor
            FROM pregunta p
            INNER JOIN tema t
                ON p.id_tema = t.id_tema
            LEFT JOIN usuario u
                ON p.id_usuario = u.id_usuario
            WHERE p.id_pregunta = ?
            AND p.estado_pregunta = 'activa'
        `, [id]);

        if (rows.length === 0) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Pregunta non encontrada'
            });

        }

        res.json(rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            ok: false,
            mensaje: 'Erro ao obter a pregunta'
        });

    }

};

const createPregunta = async (req, res) => {

    try {

        const {
            enunciado,
            id_tema,
            id_usuario
        } = req.body;

        const [result] = await pool.query(`
            INSERT INTO pregunta (
                enunciado,
                id_tema,
                id_usuario
            )
            VALUES (?, ?, ?)
        `, [
            enunciado,
            id_tema,
            id_usuario
        ]);

        res.status(201).json({
            ok: true,
            mensaje: 'Pregunta creada correctamente',
            id_pregunta: result.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            ok: false,
            mensaje: 'Erro ao crear a pregunta'
        });

    }

};

const updatePregunta = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            enunciado,
            id_tema
        } = req.body;

        const [result] = await pool.query(`
            UPDATE pregunta
            SET
                enunciado = ?,
                id_tema = ?
            WHERE id_pregunta = ?
            AND estado_pregunta = 'activa'
        `, [
            enunciado,
            id_tema,
            id
        ]);

        if (result.affectedRows === 0) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Pregunta non encontrada'
            });

        }

        res.json({
            ok: true,
            mensaje: 'Pregunta actualizada correctamente'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            ok: false,
            mensaje: 'Erro ao actualizar a pregunta'
        });

    }

};

const deletePregunta = async (req, res) => {

    try {

        const { id } = req.params;

        const [result] = await pool.query(`
            UPDATE pregunta
            SET estado_pregunta = 'eliminada'
            WHERE id_pregunta = ?
            AND estado_pregunta = 'activa'
        `, [id]);

        if (result.affectedRows === 0) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Pregunta non encontrada'
            });

        }

        res.json({
            ok: true,
            mensaje: 'Pregunta eliminada correctamente'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            ok: false,
            mensaje: 'Erro ao eliminar a pregunta'
        });

    }

};

module.exports = {
    getPreguntas,
    getPreguntaById,
    createPregunta,
    updatePregunta,
    deletePregunta

};
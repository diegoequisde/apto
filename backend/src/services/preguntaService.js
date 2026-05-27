const pool = require('../config/db');

const findAllPreguntas = async () => {

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

return rows;

};

const findPreguntaById = async (id) => {
    /*INNER JOIN tema Para obtener: nome_tema
    LEFT JOIN usuario Porque: una pregunta oficial puede no tener usuario
    o ser creada por admin y LEFT JOIN da más flexibilidad */
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

    return rows[0];

};

const insertPregunta = async (
    enunciado,
    id_tema,
    id_usuario
) => {

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

    return result.insertId;

};

const updatePreguntaById = async (
    id,
    enunciado,
    id_tema
) => {

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

    return result;

};

const deletePreguntaById = async (id) => {

    const [result] = await pool.query(`
        UPDATE pregunta
        SET estado_pregunta = 'eliminada'
        WHERE id_pregunta = ?
        AND estado_pregunta = 'activa'
    `, [id]);

    return result;

};

module.exports = {
    findAllPreguntas,
    findPreguntaById,
    insertPregunta,
    updatePreguntaById,
    deletePreguntaById
};
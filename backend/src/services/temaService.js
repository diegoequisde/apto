const pool = require('../config/db');

const findAllTemas = async () => {

    const [rows] = await pool.query(`
        SELECT 
            id_tema,
            nome_tema,
            descripcion_tema,
            estado_tema
        FROM tema
        WHERE estado_tema = 'activo'
    `);

    return rows;

};

const findTemaById = async (id) => {

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

    return rows[0];

};

const insertTema = async (
    nome_tema,
    descripcion_tema
) => {

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

    return result.insertId;

};

const updateTemaById = async (
    id,
    nome_tema,
    descripcion_tema
) => {

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

    return result;

};

const deleteTemaById = async (id) => {

    const [result] = await pool.query(`
        UPDATE tema
        SET estado_tema = 'eliminado'
        WHERE id_tema = ?
        AND estado_tema = 'activo'
    `, [id]);

    return result;

};

module.exports = {
    findAllTemas,
    findTemaById,
    insertTema,
    updateTemaById,
    deleteTemaById
};
    const pool = require('../config/db');

const findAllOposiciones = async () => {

    const [rows] = await pool.query(`
        SELECT
            id_oposicion,
            nome_oposicion,
            descripcion_oposicion
        FROM oposicion
        ORDER BY nome_oposicion
    `);

    return rows;

};

const findOposicionById = async (id) => {

    const [rows] = await pool.query(`
        SELECT
            id_oposicion,
            nome_oposicion,
            descripcion_oposicion
        FROM oposicion
        WHERE id_oposicion = ?
    `, [id]);

    return rows[0] || null;

};

const insertOposicion = async (
    nome_oposicion,
    descripcion_oposicion
) => {

    const [result] = await pool.query(`
        INSERT INTO oposicion (
            nome_oposicion,
            descripcion_oposicion
        )
        VALUES (?, ?)
    `, [
        nome_oposicion,
        descripcion_oposicion
    ]);

    return result.insertId;

};

const updateOposicionById = async (
    id,
    nome_oposicion,
    descripcion_oposicion
) => {

    const [result] = await pool.query(`
        UPDATE oposicion
        SET
            nome_oposicion = ?,
            descripcion_oposicion = ?
        WHERE id_oposicion = ?
    `, [
        nome_oposicion,
        descripcion_oposicion,
        id
    ]);

    return result;

};

const deleteOposicionById = async (id) => {

    const [result] = await pool.query(`
        DELETE FROM oposicion
        WHERE id_oposicion = ?
    `, [id]);

    return result;

};

module.exports = {
    findAllOposiciones,
    findOposicionById,
    insertOposicion,
    updateOposicionById,
    deleteOposicionById
};
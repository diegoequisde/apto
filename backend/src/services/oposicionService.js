    const pool = require('../config/db');

const findAllOposiciones = async (busqueda = '') => {

    const [rows] = await pool.query(`
        SELECT
            id_oposicion,
            nome_oposicion,
            descripcion_oposicion
        FROM oposicion
        WHERE nome_oposicion LIKE ?
        ORDER BY nome_oposicion
        LIMIT 10
    `, [`%${busqueda}%`]);

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

    try {

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

    } catch (error) {

        if (error.code === 'ER_DUP_ENTRY') {

            const err = new Error(
                'Ya existe una oposición con ese nombre.'
            );

            err.status = 409;

            throw err;

        }

        throw error;

    }

};

const updateOposicionById = async (
    id,
    nome_oposicion,
    descripcion_oposicion
) => {

    try {

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

    } catch (error) {

        if (error.code === 'ER_DUP_ENTRY') {

            const err = new Error(
                'Ya existe otra oposición con ese nombre.'
            );

            err.status = 409;

            throw err;

        }

        throw error;

    }

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
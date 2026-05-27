const pool = require('../config/db');

const findOpcionesByPregunta = async (id) => {

    const [rows] = await pool.query(`
        SELECT
            letra_opcion,
            texto,
            e_correcta
        FROM opcion
        WHERE id_pregunta = ?
    `, [id]);

    return rows;

};

const insertOpcion = async (
    id,
    letra_opcion,
    texto,
    e_correcta
) => {

    const [result] = await pool.query(`
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

    return result;

};

const updateOpcionById = async (
    id,
    letra,
    texto,
    e_correcta
) => {

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

    return result;

};

const deleteOpcionById = async (
    id,
    letra
) => {

    const [result] = await pool.query(`
        DELETE FROM opcion
        WHERE id_pregunta = ?
        AND letra_opcion = ?
    `, [
        id,
        letra
    ]);

    return result;

};

module.exports = {
    findOpcionesByPregunta,
    insertOpcion,
    updateOpcionById,
    deleteOpcionById
};
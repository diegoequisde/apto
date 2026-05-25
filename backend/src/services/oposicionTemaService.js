    const pool = require('../config/db');

const findTemasByOposicion = async (id_oposicion) => {

    const [rows] = await pool.query(`
        SELECT
            t.id_tema,
            t.nome_tema,
            t.descripcion_tema
        FROM oposicion_tema ot
        INNER JOIN tema t
            ON ot.id_tema = t.id_tema
        WHERE ot.id_oposicion = ?
        ORDER BY t.nome_tema
    `, [id_oposicion]);

    return rows;

};

const insertTemaToOposicion = async (
    id_oposicion,
    id_tema
) => {

    const [result] = await pool.query(`
        INSERT INTO oposicion_tema (
            id_oposicion,
            id_tema
        )
        VALUES (?, ?)
    `, [
        id_oposicion,
        id_tema
    ]);

    return result;

};

const deleteTemaFromOposicionById = async (
    id_oposicion,
    id_tema
) => {

    const [result] = await pool.query(`
        DELETE FROM oposicion_tema
        WHERE id_oposicion = ?
        AND id_tema = ?
    `, [
        id_oposicion,
        id_tema
    ]);

    return result;

};

module.exports = {
    findTemasByOposicion,
    insertTemaToOposicion,
    deleteTemaFromOposicionById
};
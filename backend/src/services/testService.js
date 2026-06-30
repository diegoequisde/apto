const pool = require('../config/db');

const findAllTests = async () => {

    const [rows] = await pool.query(`
        SELECT
            id_test,
            id_usuario,
            data_realizacion,
            duracion,
            resultado,
            finalizado
        FROM test
    `);

    return rows;

};


// historial de tests del usuario
const findTestsByUsuario = async (
    id_usuario
) => {

    const [rows] = await pool.query(`
        SELECT
            id_test,
            data_realizacion,
            duracion,
            resultado,
            finalizado
        FROM test
        WHERE id_usuario = ?
        AND finalizado = 1
        ORDER BY data_realizacion DESC

    `,[id_usuario]);


    return rows;

};

const findTestById = async (id) => {

    const [rows] = await pool.query(`
        SELECT
            id_test,
            id_usuario,
            data_realizacion,
            duracion,
            resultado,
            finalizado
        FROM test
        WHERE id_test = ?
    `, [id]);

    return rows[0] || null;

};


const insertTest = async (
    id_usuario,
    duracion
) => {

    const [result] = await pool.query(`
        INSERT INTO test (
            id_usuario,
            duracion
        )
        VALUES (?, ?)
    `, [
        id_usuario,
        duracion
    ]);

    return result.insertId;

};

const updateTestById = async (
    id,
    duracion,
    resultado,
    finalizado
) => {

    const [result] = await pool.query(`
        UPDATE test
        SET
            duracion = ?,
            resultado = ?,
            finalizado = ?
        WHERE id_test = ?
    `, [
        duracion,
        resultado,
        finalizado,
        id
    ]);

    return result;

};

const deleteTestById = async (id) => {

    const [result] = await pool.query(`
        DELETE FROM test
        WHERE id_test = ?
    `, [id]);

    return result;

};

module.exports = {
    findAllTests,
    findTestsByUsuario,
    findTestById,
    insertTest,
    updateTestById,
    deleteTestById
};
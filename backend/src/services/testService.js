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

const findResultadoTest = async (
    id_test, id_usuario
) => {

   const [rows] = await pool.query(`
        SELECT
            COUNT(*) AS total,
            SUM(pt.e_correcta) AS aciertos,
            t.duracion
        FROM pregunta_test pt
        JOIN test t
            ON pt.id_test = t.id_test
        WHERE pt.id_test = ?
        AND t.id_usuario = ?
    `, [id_test, id_usuario]);

    const total = rows[0].total;
    const aciertos = rows[0].aciertos || 0;
    const duracion = rows[0].duracion || 0;

    return {
        total,
        aciertos,
        errores: total - aciertos,
        nota: Math.round((aciertos / total) * 100),
        duracion
    };

};


const findTestById = async (
    id,
    id_usuario
) => {

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
        AND id_usuario = ?
    `, [
        id,
        id_usuario
    ]);

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
    id_usuario,
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
        AND id_usuario = ?
    `, [
        duracion,
        resultado,
        finalizado,
        id,
        id_usuario
    ]);

    if (result.affectedRows === 0) {

        const error = new Error(
            'Test no encontrado.'
        );

        error.status = 404;

        throw error;

    }

    return result;

};

const deleteTestById = async (
    id,
    id_usuario
) => {

    const [result] = await pool.query(`
        DELETE FROM test
        WHERE id_test = ?
        AND id_usuario = ?
    `, [
        id,
        id_usuario
    ]);

    if (result.affectedRows === 0) {

        const error = new Error(
            'Test no encontrado.'
        );

        error.status = 404;

        throw error;

    }

    return result;

};

module.exports = {
    findAllTests,
    findTestsByUsuario,
    findResultadoTest,
    findTestById,
    insertTest,
    updateTestById,
    deleteTestById
};
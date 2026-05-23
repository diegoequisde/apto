const pool = require('../config/db');

const findPreguntasByTest = async (id_test) => {

    const [rows] = await pool.query(`
        SELECT
            pt.id_test,
            pt.id_pregunta,
            pt.orde,
            pt.resposta_usuario,
            pt.e_correcta,
            p.enunciado
        FROM pregunta_test pt
        INNER JOIN pregunta p
            ON pt.id_pregunta = p.id_pregunta
        WHERE pt.id_test = ?
        ORDER BY pt.orde
    `, [id_test]);

    return rows;

};

const insertPreguntaToTest = async (
    id_test,
    id_pregunta,
    orde
) => {

    const [result] = await pool.query(`
        INSERT INTO pregunta_test (
            id_test,
            id_pregunta,
            orde
        )
        VALUES (?, ?, ?)
    `, [
        id_test,
        id_pregunta,
        orde
    ]);

    return result;

};

const answerPregunta = async (
    id_test,
    id_pregunta,
    resposta_usuario
) => {

    // Buscar respuesta correcta
    const [correcta] = await pool.query(`
        SELECT
            e_correcta
        FROM opcion
        WHERE id_pregunta = ?
        AND letra_opcion = ?
    `, [
        id_pregunta,
        resposta_usuario
    ]);

    const e_correcta =
        correcta.length > 0
            ? correcta[0].e_correcta
            : false;

    const [result] = await pool.query(`
        UPDATE pregunta_test
        SET
            resposta_usuario = ?,
            e_correcta = ?
        WHERE id_test = ?
        AND id_pregunta = ?
    `, [
        resposta_usuario,
        e_correcta,
        id_test,
        id_pregunta
    ]);

    return result;

};

const deletePreguntaTest = async (
    id_test,
    id_pregunta
) => {

    const [result] = await pool.query(`
        DELETE FROM pregunta_test
        WHERE id_test = ?
        AND id_pregunta = ?
    `, [
        id_test,
        id_pregunta
    ]);

    return result;

};

module.exports = {
    findPreguntasByTest,
    insertPreguntaToTest,
    answerPregunta,
    deletePreguntaTest
};
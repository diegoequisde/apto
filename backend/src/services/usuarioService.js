const pool = require('../config/db');

const findAllUsuarios = async () => {

    const [rows] = await pool.query(`
        SELECT
            id_usuario,
            nome,
            email,
            tipo,
            estado_usuario
        FROM usuario
        WHERE estado_usuario = 'activo'
    `);

    return rows;

};

const findUsuarioById = async (id) => {

    const [rows] = await pool.query(`
        SELECT
            id_usuario,
            nome,
            email,
            tipo,
            estado_usuario
        FROM usuario
        WHERE id_usuario = ?
        AND estado_usuario = 'activo'
    `, [id]);

    return rows[0] || null;

};

const insertUsuario = async (
    nome,
    email,
    contrasinal_hash
) => {

    const [result] = await pool.query(`
        INSERT INTO usuario (
            nome,
            email,
            contrasinal_hash,
            tipo
        )
        VALUES (?, ?, ?, 'free')
    `, [
        nome,
        email,
        contrasinal_hash
    ]);

    return result.insertId;

};

const updateUsuarioById = async (
    id,
    nome,
    email
) => {

    const [result] = await pool.query(`
        UPDATE usuario
        SET
            nome = ?,
            email = ?
        WHERE id_usuario = ?
        AND estado_usuario = 'activo'
    `, [
        nome,
        email,
        id
    ]);

    return result;

};

const deleteUsuarioById = async (id) => {

    const [result] = await pool.query(`
        UPDATE usuario
        SET estado_usuario = 'inactivo'
        WHERE id_usuario = ?
    `, [id]);

    return result;

};

module.exports = {
    findAllUsuarios,
    findUsuarioById,
    insertUsuario,
    updateUsuarioById,
    deleteUsuarioById
};
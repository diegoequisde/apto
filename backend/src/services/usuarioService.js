const pool = require("../config/db");
const bcrypt = require("bcryptjs");

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
  const [rows] = await pool.query(
    `
        SELECT
            id_usuario,
            nome,
            email,
            tipo,
            estado_usuario
        FROM usuario
        WHERE id_usuario = ?
        AND estado_usuario = 'activo'
    `,
    [id],
  );

  return rows[0] || null;
};

const findUsuarioByEmail = async (email) => {
  const [rows] = await pool.query(
    `
        SELECT
            id_usuario,
            nome,
            email,
            contrasinal_hash,
            tipo,
            estado_usuario
        FROM usuario
        WHERE email = ?
    `,
    [email],
  );

  return rows[0] || null;
};

const loginUsuario = async (email, password) => {
  const [rows] = await pool.query(
    `
        SELECT
            id_usuario,
            nome,
            email,
            contrasinal_hash,
            tipo,
            estado_usuario
        FROM usuario
        WHERE email = ?
    `,
    [email],
  );

  if (rows.length === 0) {
    return null;
  }

  const usuario = rows[0];

  const passwordCorrecta = await bcrypt.compare(
    password,
    usuario.contrasinal_hash,
  );

  if (!passwordCorrecta) {
    return false;
  }

  delete usuario.contrasinal_hash;

  return usuario;
};

const insertUsuario = async (nome, email, password) => {
  try {
    const [result] = await pool.query(
      `
            INSERT INTO usuario (
                nome,
                email,
                contrasinal_hash,
                tipo,
                estado_usuario
            )
            VALUES (?, ?, ?, 'free', 'activo')
        `,
      [nome, email, password],
    );

    return result.insertId;
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      const err = new Error(
        "Ya existe un usuario registrado con ese correo electrónico.",
      );

      err.status = 409;

      throw err;
    }

    throw error;
  }
};

const updateUsuarioById = async (id, nome, email, tipo) => {
  try {
    const [result] = await pool.query(
      `
            UPDATE usuario
            SET
                nome = ?,
                email = ?,
                tipo = ?
            WHERE id_usuario = ?
            AND estado_usuario = 'activo'
        `,
      [nome, email, tipo, id],
    );

    return result;
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      const err = new Error(
        "Ya existe otro usuario registrado con ese correo electrónico.",
      );

      err.status = 409;

      throw err;
    }

    throw error;
  }
};

const deleteUsuarioById = async (id) => {
  const [result] = await pool.query(
    `
        UPDATE usuario
        SET estado_usuario = 'eliminado'
        WHERE id_usuario = ?
    `,
    [id],
  );

  return result;
};

module.exports = {
  findAllUsuarios,
  findUsuarioById,
  findUsuarioByEmail,
  loginUsuario,
  insertUsuario,
  updateUsuarioById,
  deleteUsuarioById,
};

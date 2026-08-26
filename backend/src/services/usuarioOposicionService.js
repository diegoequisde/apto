const pool = require("../config/db");

const findOposicionesByUsuario = async (id_usuario) => {
  const [rows] = await pool.query(
    `
    SELECT
        o.id_oposicion,
        o.nome_oposicion,
        o.descripcion_oposicion
    FROM usuario_oposicion uo
    INNER JOIN oposicion o
        ON uo.id_oposicion = o.id_oposicion
    WHERE uo.id_usuario = ?
    ORDER BY o.nome_oposicion
    `,
    [id_usuario],
  );

  return rows;
};

const insertOposicionToUsuario = async (id_usuario, id_oposicion) => {
  try {
    const [result] = await pool.query(
      `
        INSERT INTO usuario_oposicion (
            id_usuario,
            id_oposicion
        )
        VALUES (?, ?)
        `,
      [id_usuario, id_oposicion],
    );

    return result;
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      const err = new Error("La oposición ya está guardada en tus favoritos.");

      err.status = 409;
      throw err;
    }
    throw error;
  }
};

const deleteOposicionFromUsuarioById = async (id_usuario, id_oposicion) => {
  const [result] = await pool.query(
    `
    DELETE FROM usuario_oposicion
    WHERE id_usuario = ?
    AND id_oposicion = ?
    `,
    [id_usuario, id_oposicion],
  );

  return result;
};

module.exports = {
  findOposicionesByUsuario,
  insertOposicionToUsuario,
  deleteOposicionFromUsuarioById,
};

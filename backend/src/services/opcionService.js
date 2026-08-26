const pool = require("../config/db");

const findOpcionesByPregunta = async (id, usuario) => {
  const [rows] = await pool.query(
    `
    SELECT
        o.letra_opcion,
        o.texto,
        o.e_correcta
    FROM opcion o
    INNER JOIN pregunta p
        ON o.id_pregunta = p.id_pregunta
    WHERE
        o.id_pregunta = ?
    AND p.id_usuario = ?
    `,
    [id, usuario.id],
  );

  return rows;
};

const updateOpcionById = async (id, letra, texto, e_correcta, usuario) => {
  const [result] = await pool.query(
    `
    UPDATE opcion o
    INNER JOIN pregunta p
        ON o.id_pregunta = p.id_pregunta
    SET
        o.texto = ?,
        o.e_correcta = ?
    WHERE
        o.id_pregunta = ?
    AND o.letra_opcion = ?
    AND p.id_usuario = ?
    `,
    [texto, e_correcta, id, letra, usuario.id],
  );

  return result;
};

const deleteOpcionById = async (id, letra, usuario) => {
  const [result] = await pool.query(
    `
    DELETE o
    FROM opcion o
    INNER JOIN pregunta p
    ON o.id_pregunta = p.id_pregunta
    WHERE
        o.id_pregunta = ?
    AND o.letra_opcion = ?
    AND p.id_usuario = ?
    `,
    [id, letra, usuario.id],
  );

  return result;
};

module.exports = {
  findOpcionesByPregunta,
  updateOpcionById,
  deleteOpcionById,
};

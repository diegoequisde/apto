const pool = require("../config/db");

const findTemasByOposicion = async (id_oposicion) => {
  const [rows] = await pool.query(
    `
    SELECT
        t.id_tema,
        t.nome_tema,
        t.descripcion_tema
    FROM oposicion_tema ot
    INNER JOIN tema t
        ON ot.id_tema = t.id_tema
    WHERE ot.id_oposicion = ?
    AND t.estado_tema = 'activo'
    ORDER BY t.nome_tema
    `,
    [id_oposicion],
  );

  return rows;
};

const insertTemaToOposicion = async (id_oposicion, id_tema) => {
  try {
    const [result] = await pool.query(
      `
      INSERT INTO oposicion_tema (
          id_oposicion,
          id_tema
      )
      VALUES (?, ?)
        `,
      [id_oposicion, id_tema],
    );

    return result;
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      const err = new Error("El tema ya está asociado a esta oposición.");

      err.status = 409;

      throw err;
    }

    throw error;
  }
};

const deleteTemaFromOposicionById = async (id_oposicion, id_tema) => {
  const [result] = await pool.query(
    `
    DELETE FROM oposicion_tema
    WHERE id_oposicion = ?
    AND id_tema = ?
    `,
    [id_oposicion, id_tema],
  );

  return result;
};

module.exports = {
  findTemasByOposicion,
  insertTemaToOposicion,
  deleteTemaFromOposicionById,
};

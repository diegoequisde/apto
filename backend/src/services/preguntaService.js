const pool = require("../config/db");

const findAllPreguntas = async (
  page = 1,
  limit = 20,
  idTema = null,
  idUsuario = null,
) => {
  const offset = (page - 1) * limit;

  let where = `WHERE p.estado_pregunta = 'activa'`;

  const params = [];

  if (idUsuario) {
    where += `
            AND p.id_usuario = ?
        `;

    params.push(idUsuario);
  }

  if (idTema) {
    where += `
            AND p.id_tema = ?
        `;

    params.push(idTema);
  }

  const [[{ total }]] = await pool.query(
    `
            SELECT
                COUNT(*) AS total
            FROM pregunta p
            ${where}
            `,
    params,
  );

  const [items] = await pool.query(
    `
            SELECT
                p.id_pregunta,
                p.enunciado,
                p.estado_pregunta,
                t.id_tema,
                t.nome_tema,
                u.nome AS autor
            FROM pregunta p
            INNER JOIN tema t
                ON p.id_tema = t.id_tema
            LEFT JOIN usuario u
                ON p.id_usuario = u.id_usuario
            ${where}
            LIMIT ?
            OFFSET ?
            `,
    [...params, Number(limit), offset],
  );

  return {
    items,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit),
  };
};

const findPreguntaById = async (id, idUsuario = null) => {
  const [rows] = await pool.query(
    `
    SELECT
        p.id_pregunta,
        p.enunciado,
        p.estado_pregunta,
        p.id_tema,
        t.nome_tema,
        p.id_usuario,
        u.nome AS autor
    FROM pregunta p
    INNER JOIN tema t
        ON p.id_tema = t.id_tema
    LEFT JOIN usuario u
        ON p.id_usuario = u.id_usuario
    WHERE p.id_pregunta = ?
    AND p.estado_pregunta = 'activa'
    `,
    [id],
  );

  // La pregunta no existe
  if (rows.length === 0) {
    return null;
  }

  const pregunta = rows[0];

  // La pregunta existe, pero pertenece a otro usuario
  if (idUsuario && pregunta.id_usuario !== idUsuario) {
    const error = new Error("No tienes permiso para acceder a esta pregunta.");

    error.status = 403;

    throw error;
  }

  return pregunta;
};

// el testController mezcla las preguntas. Es redundante?
const findPreguntasAleatorias = async (idTema, cantidad, soloAdmin = false) => {
  let sql = `
            SELECT p.id_pregunta
            FROM pregunta p
              INNER JOIN usuario u
              ON p.id_usuario = u.id_usuario
            WHERE p.estado_pregunta = 'activa'
              AND p.id_tema = ?
          `;

  if (soloAdmin) {
    sql += `
            AND u.tipo = 'admin'
        `;
  }

  sql += `
        ORDER BY RAND()
        LIMIT ?
        `;

  const [rows] = await pool.query(sql, [idTema, Number(cantidad)]);

  return rows;
};

const updatePreguntaById = async (id, enunciado, id_tema, idUsuario = null) => {
  let sql = `
            UPDATE pregunta
            SET
                enunciado=?,
                id_tema=?
            WHERE
                id_pregunta=?
            AND estado_pregunta='activa'
            `;

  const params = [enunciado, id_tema, id];

  if (idUsuario) {
    sql += `
                AND id_usuario=?
            `;

    params.push(idUsuario);
  }

  const [result] = await pool.query(sql, params);

  return result;
};

const crearPreguntaCompleta = async (
  enunciado,
  id_tema,
  id_usuario,
  opciones,
) => {
  if (!Array.isArray(opciones) || opciones.length < 2) {
    const error = new Error("La pregunta debe tener al menos dos opciones.");
    error.status = 400;
    throw error;
  }

  const correctas = opciones.filter((opcion) => opcion.e_correcta);

  if (correctas.length !== 1) {
    const error = new Error("Debe existir una única respuesta correcta.");
    error.status = 400;
    throw error;
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [pregunta] = await connection.query(
          `
          INSERT INTO pregunta(
              enunciado,
              id_tema,
              id_usuario
          )
          VALUES(?,?,?)
        `,
      [enunciado, id_tema, id_usuario],
    );

    const id_pregunta = pregunta.insertId;

    for (const opcion of opciones) {
      if (!opcion.texto?.trim()) {
        const error = new Error("Todas las opciones deben tener texto.");
        error.status = 400;
        throw error;
      }

      await connection.query(
        `
        INSERT INTO opcion(
            id_pregunta,
            letra_opcion,
            texto,
            e_correcta
        )
        VALUES(?,?,?,?)
        `,
        [id_pregunta, opcion.letra_opcion, opcion.texto, opcion.e_correcta],
      );
    }

    await connection.commit();

    return id_pregunta;
  } catch (error) {
    await connection.rollback();

    throw error;
  } finally {
    connection.release();
  }
};

const deletePreguntaById = async (id, idUsuario = null) => {
  let sql = `
        UPDATE pregunta
        SET estado_pregunta = 'eliminada'
        WHERE id_pregunta = ?
        AND estado_pregunta = 'activa'
        `;

  const params = [id];

  if (idUsuario) {
    sql += `
            AND id_usuario = ?
        `;

    params.push(idUsuario);
  }

  const [result] = await pool.query(sql, params);

  return result;
};

const contarPreguntasUsuario = async (id_usuario) => {
  const [[result]] = await pool.query(
    `
    SELECT COUNT(*) AS total
    FROM pregunta
    WHERE id_usuario = ?
    AND estado_pregunta = 'activa'
    `,
    [id_usuario],
  );

  return result.total;
};

module.exports = {
  findAllPreguntas,
  findPreguntaById,
  findPreguntasAleatorias,
  crearPreguntaCompleta,
  updatePreguntaById,
  deletePreguntaById,
  contarPreguntasUsuario,
};

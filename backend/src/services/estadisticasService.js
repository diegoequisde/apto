const pool = require("../config/db");

const obtenerEstadisticas = async (id_usuario, periodo = "total") => {
  let filtroFecha = "";

  if (periodo === "1") {
    filtroFecha = "AND DATE(t.data_realizacion) = CURDATE()";
  }

  if (periodo === "7") {
    filtroFecha =
      "AND t.data_realizacion >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)";
  }

  if (periodo === "30") {
    filtroFecha =
      "AND t.data_realizacion >= DATE_SUB(CURDATE(), INTERVAL 29 DAY)";
  }

  const [[resumen]] = await pool.query(
    `
    SELECT COUNT(*) AS tests,
    SUM(
      (SELECT COUNT(*)
      FROM pregunta_test pt
      WHERE pt.id_test = t.id_test)
    ) AS preguntas,

    AVG(resultado) AS acierto,
    SUM(t.duracion) AS tiempo
    FROM test t

    WHERE t.id_usuario = ? 
    AND t.finalizado = 1
    ${filtroFecha} 
    `,
    [id_usuario],
  );

  const [evolucion] = await pool.query(
    `
    SELECT
    DATE(data_realizacion) AS dia,
    COUNT(pt.id_pregunta) AS preguntas,
    AVG(t.resultado) AS acierto
    FROM test t
    INNER JOIN pregunta_test pt
    ON t.id_test = pt.id_test
    WHERE t.id_usuario = ? 
    AND t.finalizado = 1
    ${filtroFecha} 
    GROUP BY DATE(data_realizacion)
    ORDER BY dia


`,
    [id_usuario],
  );

  const [temas] = await pool.query(
    `SELECT te.nome_tema,
        COUNT(pt.id_pregunta) AS preguntas,
        AVG(pt.e_correcta * 100) AS acierto
    FROM pregunta_test pt
        INNER JOIN pregunta p
        ON pt.id_pregunta = p.id_pregunta
        INNER JOIN tema te
        ON p.id_tema = te.id_tema
        INNER JOIN test t
        ON pt.id_test = t.id_test
    WHERE t.id_usuario = ? 
    AND t.finalizado = 1
    ${filtroFecha}
    GROUP BY te.id_tema
    `,
    [id_usuario],
  );

  const [diasEstudio] = await pool.query(
    `
    SELECT DISTINCT DATE(data_realizacion) AS dia
    FROM test
    WHERE id_usuario = ?
    AND finalizado = 1
    ORDER BY dia DESC
    `,
    [id_usuario],
  );

  function calcularRacha(dias) {
    if (dias.length === 0) {
      return 0;
    }

    let racha = 1;

    for (let i = 0; i < dias.length - 1; i++) {
      const actual = new Date(dias[i].dia);

      const anterior = new Date(dias[i + 1].dia);

      const diferencia = (actual - anterior) / (1000 * 60 * 60 * 24);

      if (diferencia === 1) {
        racha++;
      } else {
        break;
      }
    }

    return racha;
  }

  const racha = calcularRacha(diasEstudio);

  return {
    resumen: {
      tests: resumen.tests,
      preguntas: resumen.preguntas,
      acierto: resumen.acierto,
      tiempo: resumen.tiempo ?? 0,
      racha,
    },
    evolucion,
    temas,
  };
};

module.exports = {
  obtenerEstadisticas,
};

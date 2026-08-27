const asyncHandler = require("../middlewares/asyncHandler");
const pool = require("../config/db");
const { crearExameOficial } = require("../services/examenOficialService");
const { obterConfiguracionExame } = require("../config/examenesOficiais");

const {
  findAllTests,
  findTestsByUsuario,
  findResultadoTest,
  findTestById,
  findTestOwner,
  insertTest,
  updateTestById,
  deleteTestById,
} = require("../services/testService");

const { findPreguntasAleatorias } = require("../services/preguntaService");

const {
  insertPreguntaToTest,
  findRevisionByTest,
  calcularResultadoTest,
} = require("../services/preguntaTestService");

const { obtenerEstadisticas } = require("../services/estadisticasService");

const getTests = asyncHandler(async (req, res) => {
  const tests = await findAllTests();

  res.json(tests);
});

const getResultadoTest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const resultado = await findResultadoTest(id, req.usuario.id);

  res.json(resultado);
});

const getEstadisticas = asyncHandler(async (req, res) => {
  const periodo = req.query.periodo || "total";

  const datos = await obtenerEstadisticas(req.usuario.id, periodo);

  res.json(datos);
});

const getHistorial = asyncHandler(async (req, res) => {
  const tests = await findTestsByUsuario(req.usuario.id);

  res.json(tests);
});

const getTestById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const propietario = await findTestOwner(id);

  if (!propietario) {
    return res.status(404).json({
      ok: false,
      mensaje: "Test no encontrado",
    });
  }

  if (propietario.id_usuario !== req.usuario.id) {
    return res.status(403).json({
      ok: false,
      mensaje: "No tienes permiso para acceder a este test",
    });
  }

  const test = await findTestById(id, req.usuario.id);

  res.json(test);
});

const createTest = asyncHandler(async (req, res) => {
  // Obtén os temas e a duración seleccionados polo usuario
  const { temas, duracion: duracionLimite } = req.body;

  // Comproba as restricións dos usuarios FREE
  if (req.usuario.tipo === "free") {
    for (const tema of temas) {
      const [rows] = await pool.query(
        `
          SELECT id_tema
          FROM tema
          WHERE id_tema = ?
          AND id_usuario = ?
          AND estado_tema = 'activo'
        `,
        [tema.id_tema, req.usuario.id],
      );

      // Se o tema non pertence ao usuario, denégase a operación
      if (rows.length === 0) {
        return res.status(403).json({
          ok: false,
          mensaje:
            "Tu cuenta gratuíta sólo puede generar tests con tus temas personalizados.",
        });
      }
    }
  }

  // Crea o test e asígnalle o usuario actual
  const id_test = await insertTest(req.usuario.id, duracionLimite || null);

  // Obtén as preguntas aleatorias de cada tema
  let preguntas = [];

  for (const tema of temas) {
    const preguntasTema = await findPreguntasAleatorias(
      tema.id_tema,
      tema.cantidad,
    );

    // Comproba que hai preguntas suficientes para a selección
    if (preguntasTema.length < tema.cantidad) {
      return res.status(400).json({
        ok: false,
        mensaje: `O tema ${tema.nome} só dispón de ${preguntasTema.length} preguntas dispoñibles.`,
      });
    }

    // Engade as preguntas seleccionadas ao test
    preguntas.push(...preguntasTema);
  }

  // Mestura as preguntas para crear unha orde aleatoria
  preguntas.sort(() => Math.random() - 0.5);

  // Asocia cada pregunta ao test mantendo a súa posición
  for (let i = 0; i < preguntas.length; i++) {
    await insertPreguntaToTest(id_test, preguntas[i].id_pregunta, i + 1);
  }

  // Informa ao frontend
  res.status(201).json({
    ok: true,
    mensaje: "Test creado correctamente",
    id_test,
  });
});

const createTestOficial = asyncHandler(async (req, res) => {
  // Obtén a oposición seleccionada polo usuario
  const { id_oposicion } = req.body;

  // Obtén a configuración do exame oficial en definida en config/
  const configuracion = obterConfiguracionExame(id_oposicion);

  // Crea o test e asóciao ao usuario coa duración definida na configuración
  const id_test = await insertTest(req.usuario.id, configuracion.duracion);

  // Xera as preguntas do exame segundo a configuración
  const preguntas = await crearExameOficial(id_oposicion);

  // Asocia cada pregunta ao test mantendo a súa orde
  for (let i = 0; i < preguntas.length; i++) {
    await insertPreguntaToTest(id_test, preguntas[i].id_pregunta, i + 1);
  }

  // Devolve ao frontend o resultado da creación do exame
  res.status(201).json({
    ok: true,
    mensaje: "Examen oficial creado correctamente",
    id_test,
    duracion: configuracion.duracion,
  });
});

const updateTest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let { duracion, resultado, finalizado } = req.body;

  if (finalizado == 1) {
    const test = await findTestById(id, req.usuario.id);

    if (!test) {
      return res.status(404).json({
        ok: false,
        mensaje: "Test no encontrado",
      });
    }

    const inicio = new Date(test.data_realizacion);

    duracion = Math.floor((Date.now() - inicio.getTime()) / 1000);

    if (test.duracion_limite && duracion > test.duracion_limite) {
      duracion = test.duracion_limite;
    }
  }

  let resultadoFinal = resultado;

  if (finalizado == 1) {
    resultadoFinal = await calcularResultadoTest(id);
  }

  const result = await updateTestById(
    id,
    req.usuario.id,
    duracion,
    resultadoFinal,
    finalizado,
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({
      ok: false,
      mensaje: "Test no encontrado",
    });
  }

  res.json({
    ok: true,
    mensaje: "Test actualizado correctamente",
    resultado: resultadoFinal,
  });
});

const deleteTest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await deleteTestById(id, req.usuario.id);

  if (result.affectedRows === 0) {
    return res.status(404).json({
      ok: false,
      mensaje: "Test no encontrado",
    });
  }

  res.json({
    ok: true,
    mensaje: "Test eliminado correctamente",
  });
});

const getRevisionTest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const propietario = await findTestOwner(id);

  if (!propietario) {
    return res.status(404).json({
      ok: false,
      mensaje: "Test no encontrado",
    });
  }

  if (propietario.id_usuario !== req.usuario.id) {
    return res.status(403).json({
      ok: false,
      mensaje: "No tienes permiso para revisar este test",
    });
  }

  const revision = await findRevisionByTest(id, req.usuario.id);

  res.json(revision);
});

module.exports = {
  getTests,
  getResultadoTest,
  getEstadisticas,
  getHistorial,
  getTestById,
  createTest,
  createTestOficial,
  updateTest,
  deleteTest,
  getRevisionTest,
};

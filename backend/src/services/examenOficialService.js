const { obterConfiguracionExame } = require("../config/examenesOficiais");

const { generarDistribucionExame } = require("../utils/generadorExamenOficial");

const { findPreguntasAleatorias } = require("./preguntaService");

async function crearExameOficial(idOposicion) {
  const configuracion = obterConfiguracionExame(idOposicion);

  if (!configuracion) {
    const error = new Error("No se ha encontrado la configuración del examen.");

    error.status = 404;

    throw error;
  }

  const distribucion = generarDistribucionExame(configuracion);

  let preguntas = [];

  for (const tema of distribucion) {
    const preguntasTema = await findPreguntasAleatorias(
      tema.id_tema,
      tema.cantidad,
      true,
    );

    if (preguntasTema.length < tema.cantidad) {
      const error = new Error(
        `El tema "${tema.nome}" solo tiene ${preguntasTema.length} preguntas disponibles y se necesitan ${tema.cantidad}.`,
      );

      error.status = 409;

      throw error;
    }

    preguntas.push(...preguntasTema);
  }

  return preguntas;
}

module.exports = {
  crearExameOficial,
};

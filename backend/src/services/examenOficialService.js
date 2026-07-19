const {
    obterConfiguracionExame
} = require('../config/examenesOficiais');

const {
    generarDistribucionExame
} = require('../utils/generadorExamenOficial');

const {
    findPreguntasAleatorias
} = require('./preguntaService');

async function crearExameOficial(idOposicion) {

    const configuracion =
        obterConfiguracionExame(idOposicion);

    if (!configuracion) {

        throw new Error(
            'Configuración de exame non encontrada'
        );

    }

    const distribucion =
        generarDistribucionExame(configuracion);

    let preguntas = [];

    for (const tema of distribucion) {

        const preguntasTema =
            await findPreguntasAleatorias(
                tema.id_tema,
                tema.cantidad,
                true
            );

        if (
            preguntasTema.length <
            tema.cantidad
        ) {

            throw new Error(
                `O tema "${tema.nome}" só dispón de ${preguntasTema.length} preguntas dispoñibles.`
            );

        }

        preguntas.push(...preguntasTema);

    }

    return preguntas;
}

module.exports = {
    crearExameOficial
};
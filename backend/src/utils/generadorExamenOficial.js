
// Comprobación de seguridad, porque si los máximos de todos los temas no alcanzan totalPreguntas, el while nunca terminaría.
function generarDistribucionExame(exame) {

    const minimoTotal =
        exame.temas.reduce(
            (total, tema) => total + tema.min, 0
        );

    const maximoTotal =
        exame.temas.reduce(
            (total, tema) => total + tema.max, 0
        );

    if (minimoTotal > exame.totalPreguntas) {
        throw new Error('A configuración do exame é incorrecta: a suma dos mínimos supera o número total de preguntas.');
    }

    if (maximoTotal < exame.totalPreguntas) {
        throw new Error('A configuración do exame é incorrecta: a suma dos máximos non permite completar o exame.');
    }

    const distribucion = exame.temas.map(tema => ({
        id_tema: tema.id_tema,
        nome: tema.nome,
        cantidad: tema.min
    }));

    let restantes = exame.totalPreguntas - minimoTotal;

    while (restantes > 0) {

        const indice = Math.floor(
                Math.random() * distribucion.length
            );

        const temaActual = distribucion[indice];

        const configuracion = exame.temas[indice];

        if (temaActual.cantidad < configuracion.max) {
            temaActual.cantidad++;
            restantes--;
        }
    }
    return distribucion;
}

module.exports = {
    generarDistribucionExame
};
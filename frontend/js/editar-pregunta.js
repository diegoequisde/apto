const API =
    'http://localhost:3000/api';

const params =
    new URLSearchParams(
        window.location.search
    );

const idPregunta =
    params.get('id');

let opcionesActuales = [];

async function cargarPregunta() {

    const preguntaResponse =
        await fetch(
            `${API}/preguntas/${idPregunta}`
        );

    const pregunta =
        await preguntaResponse.json();

    document
        .getElementById('enunciado')
        .value =
        pregunta.enunciado;

    document
        .getElementById('idTema')
        .value =
        pregunta.id_tema;

    const opcionesResponse =
        await fetch(
            `${API}/preguntas/${idPregunta}/opciones`
        );

    opcionesActuales =
        await opcionesResponse.json();

    pintarOpciones();

}

function pintarOpciones() {

    const container =
        document.getElementById(
            'opcionesContainer'
        );

    container.innerHTML = '';

    opcionesActuales.forEach(
        (opcion) => {

            container.innerHTML += `
                <div>

                    <h3>
                        ${opcion.letra_opcion}
                    </h3>

                    <input
                        type="text"
                        id="texto-${opcion.letra_opcion}"
                        value="${opcion.texto}"
                    >

                    <input
                        type="radio"
                        name="correcta"
                        value="${opcion.letra_opcion}"
                        ${
                            opcion.e_correcta
                                ? 'checked'
                                : ''
                        }
                    >

                    Correcta

                </div>

                <hr>
            `;

        }
    );

}

async function guardarCambios() {

    const enunciado =
        document.getElementById(
            'enunciado'
        ).value;

    const idTema =
        document.getElementById(
            'idTema'
        ).value;

            await fetch(
        `${API}/preguntas/${idPregunta}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type':
                    'application/json'
            },
            body: JSON.stringify({
                enunciado,
                id_tema: idTema
            })
        }
    );


const correctaSeleccionada =
document.querySelector(
    'input[name="correcta"]:checked'
).value;


    for (
const opcion
of opcionesActuales
    ) {

        const texto =
            document.getElementById(
                `texto-${opcion.letra_opcion}`
            ).value;

        await fetch(
            `${API}/preguntas/${idPregunta}/opciones/${opcion.letra_opcion}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type':
                        'application/json'
                },
                body: JSON.stringify({
                    texto,
                    e_correcta:
                        opcion.letra_opcion ===
                        correctaSeleccionada
                })
            }
        );

    }

        alert(
        'Pregunta actualizada'
    );

}

document
    .getElementById(
        'guardarBtn'
    )
    .addEventListener(
        'click',
        guardarCambios
    );

cargarPregunta();
const API =
    'http://localhost:3000/api';

const container =
    document.getElementById(
        'preguntasContainer'
    );

async function cargarPreguntas() {

    const response =
        await fetch(
            `${API}/preguntas`
        );

    const preguntas =
        await response.json();

    container.innerHTML = '';

    preguntas.forEach((pregunta) => {

        container.innerHTML += `
            <div>
                <p>
                    ${pregunta.enunciado}
                </p>

                <button
                    onclick="editarPregunta(
                        ${pregunta.id_pregunta}
                    )"
                >
                    Editar
                </button>
                
                <button
                    onclick="eliminarPregunta(
                        ${pregunta.id_pregunta}
                    )"
                >
                    Eliminar
                </button>

                <hr>
            </div>
        `;

    });

}

function irCrearPregunta() {

    window.location.href =
        './crear.html';

}

function editarPregunta(id) {

    window.location.href =
        `editar.html?id=${id}`;

}

async function eliminarPregunta(id) {

    await fetch(
        `${API}/preguntas/${id}`,
        {
            method: 'DELETE'
        }
    );

    cargarPreguntas();

}

cargarPreguntas();
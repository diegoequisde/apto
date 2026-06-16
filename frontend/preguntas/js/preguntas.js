const API =
    'http://localhost:3000/api';

const container =
    document.getElementById(
        'preguntasContainer'
    );

const params =
    new URLSearchParams(
        window.location.search
    );

const idTema =
    params.get('idTema');

let paginaActual = 1;

const limite = 20;

async function cargarTema() {

    if (!idTema) {
        return;
    }

    const response =
        await fetch(
            `${API}/temas/${idTema}`
        );

    const tema =
        await response.json();

    document.getElementById(
        'tituloTema'
    ).textContent =
        `Preguntas · ${tema.nome_tema}`;

}

async function cargarPreguntas() {

    const response =
        await fetch(`${API}/preguntas?idTema=${idTema}&page=${paginaActual}&limit=${limite}`
    );
        
    const data =
    await response.json();

    // botones de paginación:
    document
    .getElementById(
        'anteriorBtn'
    )
    .addEventListener(
        'click',
        () => {

            if (
                paginaActual > 1
            ) {

                paginaActual--;

                cargarPreguntas();

            }

        }
    );

document
    .getElementById(
        'siguienteBtn'
    )
    .addEventListener(
        'click',
        () => {

            paginaActual++;

            cargarPreguntas();

        }
    );

document
    .getElementById(
        'siguienteBtn'
    )
    .disabled =
        paginaActual >=
        data.totalPages;

document
    .getElementById(
        'anteriorBtn'
    )
    .disabled =
        paginaActual === 1;

    const preguntas =
        data.items;

    document.getElementById(
    'infoPaginacion'
    ).textContent =
        `
        ${data.total}
        preguntas encontradas
        · Página
        ${data.page}
        de
        ${data.totalPages}
        `;

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

    document.getElementById(
        'contadorPreguntas'
    )   .textContent =
        `${preguntas.length} preguntas`;
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

async function inicializar() {

    await cargarTema();

    await cargarPreguntas();

}

inicializar();
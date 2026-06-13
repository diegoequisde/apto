const API =
    'http://localhost:3000/api';

const params =
    new URLSearchParams(
        window.location.search
    );

const idPregunta =
    params.get('id');

let opcionesActuales = [];


async function inicializar() {

    await cargarTemas();

    const pregunta =
        await cargarPregunta();

    document.getElementById(
        'enunciado'
    ).value =
        pregunta.enunciado;

    document.getElementById(
        'idTema'
    ).value =
        pregunta.id_tema;

    await cargarOpciones();

}


async function cargarPregunta() {

    const response =
        await fetch(
            `${API}/preguntas/${idPregunta}`
        );

    return await response.json();

}

async function cargarTemas() {

    const response =
        await fetch(
            `${API}/temas`
        );

    const temas =
        await response.json();

    const select =
        document.getElementById(
            'idTema'
        );

    select.innerHTML = '';

/*
    // Si quisiera ordenar alfbéticamente

    temas.sort((a, b) =>
                a.nome_tema.localeCompare(
                b.nome_tema
            )
        );
*/
    
        temas.forEach((tema) => {

        

        select.innerHTML += `
            <option
                value="${tema.id_tema}"
            >
                ${tema.nome_tema}
            </option>
        `;

    });

}

async function cargarOpciones() {

    const response =
        await fetch(
            `${API}/preguntas/${idPregunta}/opciones`
        );

    opcionesActuales =
        await response.json();

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

    const correcta =
        document.querySelector(
            'input[name="correcta"]:checked'
        ).value;

    for (const opcion of opcionesActuales) {

    const letra =
        opcion.letra_opcion;

    const texto =
        document.getElementById(
            `texto-${letra}`
        ).value;


        await fetch(
            `${API}/preguntas/${idPregunta}/opciones/${letra}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type':
                        'application/json'
                },
                body: JSON.stringify({
                    texto,
                    e_correcta:
                        letra === correcta
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

inicializar();
requireLogin();

const API =
    'http://localhost:3000/api';

async function cargarTemas() {

    const response = await fetch(
        `${API}/temas`,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }
    );

    const temas =
        await response.json();

    const select =
        document.getElementById(
            'idTema'
        );

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

async function guardarPregunta() {

    const enunciado =
        document
            .getElementById('enunciado')
            .value
            .trim();

    const idTema =
        document
            .getElementById('idTema')
            .value;

    const correcta =
        document.querySelector(
            'input[name="correcta"]:checked'
        )?.value;

    if (!correcta) {

        alert(
            'Debes seleccionar unha resposta correcta.'
        );

        return;

    }

    const opciones = [];

    const letras =
        ['A','B','C','D'];

    for (const letra of letras) {

        const texto =
            document
                .getElementById(`texto-${letra}`)
                .value
                .trim();

        if (!texto) {
            continue;
        }

        opciones.push({

            letra_opcion:
                letra,

            texto,

            e_correcta:
                letra === correcta

        });

    }

    const opcionCorrecta =
        opciones.find(
            opcion => opcion.e_correcta
        );

    if (!opcionCorrecta) {

        alert(
            'A resposta correcta debe ter texto.'
        );

        return;

    }

    if (opciones.length < 2) {

        alert(
            'Debes introducir polo menos dúas opcións.'
        );

        return;

    }

    const response =
        await fetch(
            `${API}/preguntas`,
            {
                method: 'POST',
                headers: {
                    'Content-Type':
                        'application/json',
                    Authorization:
                        `Bearer ${getToken()}`
                },
                body: JSON.stringify({

                    enunciado,

                    id_tema:
                        idTema,

                    opciones

                })
            }
        );

    const data =
        await response.json();

    if (!response.ok) {

        alert(
            data.mensaje
        );

        return;

    }

    alert(
        'Pregunta creada correctamente'
    );

    window.location.href =
        `./index.html?idTema=${idTema}`;

}

document
    .getElementById(
        'guardarBtn'
    )
    .addEventListener(
        'click',
        guardarPregunta
    );

cargarTemas();
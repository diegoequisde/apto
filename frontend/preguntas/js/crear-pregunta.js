requireLogin();

const API = CONFIG.API;

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
        mostrarToast('Debes seleccionar una respuesta correcta.', 'warning');
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
        mostrarToast('La respuesta correcta debe tener texto.', 'warning');
        return;
    }

    if (opciones.length < 2) {
        mostrarToast('Debes introducir por lo menos dos opciones.', 'warning');
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
        mostrarToast(data.mensaje, 'error');
        return;
    }

    mostrarToast('Pregunta creada correctamente', 'success');

    setTimeout(() => {
        window.location.href = `./index.html?idTema=${idTema}`;
    }, 1500);

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
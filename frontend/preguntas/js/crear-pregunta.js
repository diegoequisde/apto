requireLogin();

const API =
    'http://localhost:3000/api';

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

async function crearOpciones(
    idPregunta
) {

    const correcta =
        document.querySelector(
            'input[name="correcta"]:checked'
        ).value;

    const letras =
        ['A', 'B', 'C', 'D'];

    for (const letra of letras) {

        const texto =
            document.getElementById(
                `texto-${letra}`
            ).value;

        await fetch(
            `${API}/preguntas/${idPregunta}/opciones`,
            {
                method: 'POST',
                headers: {
                    'Content-Type':
                        'application/json'
                },
                body: JSON.stringify({
                    letra_opcion: letra,
                    texto,
                    e_correcta:
                        letra === correcta
                })
            }
        );

    }

}

async function guardarPregunta() {

    const enunciado =
        document.getElementById(
            'enunciado'
        ).value;

    const idTema =
        document.getElementById(
            'idTema'
        ).value;

   const response =
        await fetch(
            `${API}/preguntas`,
            {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    enunciado,
                    id_tema:idTema
                })
            }
        );

        const pregunta =
        await response.json();

        if(!response.ok){

            alert(pregunta.mensaje);
            return;

        }

    const idPregunta =
        pregunta.id_pregunta;

    await crearOpciones(
    idPregunta
);

alert(
    'Pregunta creada correctamente'
);

window.location.href =
    './index.html';

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
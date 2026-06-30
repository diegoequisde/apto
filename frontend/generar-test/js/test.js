const API =
    'http://localhost:3000/api';

const params =
    new URLSearchParams(
        window.location.search
    );

const idTest =
    params.get('idTest');

let preguntas = [];
let preguntaActual = 0;

async function cargarTest() {

    const response =
        await fetch(
            `${API}/tests/${idTest}/preguntas`
        );

    preguntas =
        await response.json();
    mostrarPregunta();

}

function mostrarPregunta() {

    const pregunta =
        preguntas[preguntaActual];


    document
        .getElementById(
            'contadorPregunta'
        )
        .textContent =
        `
Pregunta
${preguntaActual + 1}
de
${preguntas.length}
`;


    document
        .getElementById(
            'question-container'
        )
        .innerHTML = `

<h2>${pregunta.enunciado}</h2>

${pregunta.opciones
    .map(opcion => `

<label>

<input
type="radio"
name="respuesta"
value="${opcion.letra_opcion}"
${pregunta.resposta_usuario === opcion.letra_opcion ? 'checked' : ''}
>

${opcion.texto}

</label>

`)
.join('')}

`;



document
.querySelectorAll(
    'input[name="respuesta"]'
)
.forEach(input=>{


    input.addEventListener(
    'change',
    ()=>{


        guardarRespuesta(
            pregunta.id_pregunta,
            input.value
        );

        pregunta.resposta_usuario =
        input.value;
    });

});


}


async function guardarRespuesta(
    idPregunta,
    respuesta
){

    const response =
    await fetch(
        `${API}/tests/${idTest}/preguntas/${idPregunta}/resposta`,
        {

        method:'PUT',

        headers:{
            'Content-Type':'application/json'
        },

        body:JSON.stringify({

            resposta_usuario:respuesta

        })

        }
    );

}


document
    .getElementById(
        'siguienteBtn'
    )
    .onclick = () => {


        if (preguntaActual < preguntas.length - 1) {
            preguntaActual++;
            mostrarPregunta();
        }
        else {
            finalizarTest();
        }

    };

document
    .getElementById(
        'anteriorBtn'
    )
    .onclick = () => {


        if (
            preguntaActual > 0
        ) {
            preguntaActual--;
            mostrarPregunta();
        }

    };

function finalizarTest() {

    alert(
        'Test finalizado'
    );

    window.location.href =
        `resultado.html?idTest=${idTest}`;

}


cargarTest();
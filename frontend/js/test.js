const API =
    'http://localhost:3000/api';

const container =
    document.getElementById(
        'question-container'
    );

/* ultimo cambio */
let preguntas = [];

let preguntaActual = 0;

async function cargarTest() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const idTema =
        params.get('tema');

    const cantidad =
        params.get('cantidad') || 10;

    const response =
        await fetch(
            `${API}/tests/generar?idTema=${idTema}&cantidad=${cantidad}`
        );
    preguntas =
        await response.json();
    mostrarPregunta();
}

function mostrarPregunta(){
    const pregunta =
        preguntas[preguntaActual];

    if(!pregunta){
        finalizarTest();
        return;
    }

    document.getElementById(
        'contadorPregunta'
    )
    .textContent =
    `
    Pregunta ${preguntaActual + 1}
    de ${preguntas.length}
    `;

    container.innerHTML = `
    <h2>
        ${pregunta.enunciado}
    </h2>
    ${
        pregunta.opciones
        .map(
            opcion => `
            <label>
            <input
                type="radio"
                name="respuesta"
                value="${opcion.id_opcion}"
            >
            ${opcion.texto}
            </label>
            `
        )
        .join('')
    }
    `;

}

document
.getElementById(
    'siguienteBtn'
)
.addEventListener(
    'click',
    () => {
        if(
            preguntaActual <
            preguntas.length -1
        ){
            preguntaActual++;
            mostrarPregunta();
        }
        else {
            finalizarTest();
        }
    }
);

document
.getElementById(
    'anteriorBtn'
)
.addEventListener(
    'click',
    () => {
        if(
            preguntaActual > 0
        ){
            preguntaActual--;
            mostrarPregunta();
        }
    }
);

function finalizarTest(){
    alert('Test finalizado');
    window.location.href ='/seguimiento/index.html';
}

cargarTest();

/* código anterior
async function cargarPreguntas() {

    const response =
        await fetch(
            `${API}/preguntas`
        );

    const preguntas =
        await response.json();

    container.innerHTML = '';

    preguntas
        .slice(0, 10)
        .forEach((pregunta) => {

            container.innerHTML += `
                <div>
                    <h3>
                        ${pregunta.enunciado}
                    </h3>
                </div>
            `;

        });

}

document
    .getElementById('cargarBtn')
    .addEventListener(
        'click',
        cargarPreguntas
    );*/
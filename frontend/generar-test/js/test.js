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
let inicioTest = null;
let intervaloTemporizador;

const inicio =
Number(
    localStorage.getItem(
        `inicio_${idTest}`
    )
);

const limite =
Number(
    localStorage.getItem(
        `limite_${idTest}`
    )
);


function mostrarNavegacion() {


    const nav =
        document.getElementById(
            'preguntas-nav'
        );


    nav.innerHTML = '';

    preguntas.forEach(
        (pregunta, index) => {

            let estado = 'sin-respuesta';

            if (pregunta.resposta_usuario) {
                estado = 'contestada';
            }

            if (index === preguntaActual) {
                estado = 'activa';
            }

            nav.innerHTML += `
            <button
                class="pregunta-numero ${estado}"
                data-pregunta="${index}">
                ${index + 1}
            </button>
            `;

        });


    document
        .querySelectorAll(
            '.pregunta-numero'
        )
        .forEach(button => {

            button.addEventListener(
                'click',
                () => {
                    preguntaActual = Number(button.dataset.pregunta);
                    mostrarNavegacion();
                    mostrarPregunta();
                });
        });
}
async function cargarTest() {

    const response =
        await fetch(`${API}/tests/${idTest}/preguntas`);

    preguntas = await response.json();

    mostrarNavegacion();
    mostrarPregunta();

}

function iniciarTemporizador(){

    if(
        !inicio ||
        !limite
    ){
        return;
    }

    intervaloTemporizador =
    setInterval(()=>{

        const transcurrido =
        Math.floor(
            (
                Date.now() - inicio
            ) / 1000
        );

        const restante =
        limite - transcurrido;

        if(restante <= 0){

            clearInterval(
                intervaloTemporizador
            );

            finalizarTest(true);

            return;

        }

        const horas = Math.floor(restante / 3600);
        const minutos = Math.floor((restante % 3600) / 60);
        const segundos = restante % 60;

        document
        .getElementById('temporizador')
        .textContent =
        `${String(horas).padStart(2,'0')}:${String(minutos).padStart(2,'0')}:${String(segundos).padStart(2,'0')}`;

    },1000);

}

function mostrarPregunta() {

    const pregunta =
        preguntas[preguntaActual];


    document
        .getElementById('contadorPregunta')
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
        .forEach(input => {


            input.addEventListener(
                'change',
                () => {

                    guardarRespuesta(
                        pregunta.id_pregunta,
                        input.value
                    );

                    pregunta.resposta_usuario = input.value;

                    mostrarNavegacion();
                });
        });
}

async function guardarRespuesta(
    idPregunta,
    respuesta
) {

    const response =
        await fetch(
            `${API}/tests/${idTest}/preguntas/${idPregunta}/resposta`,
            {

                method: 'PUT',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({

                    resposta_usuario: respuesta

                })

            }
        );

}


document
    .getElementById('siguienteBtn')
    .onclick = async () => {

        if (preguntaActual < preguntas.length - 1) {
            preguntaActual++;
            mostrarNavegacion();
            mostrarPregunta();

        } else {

            const confirmar = confirm('Has llegado a la última pregunta. ¿Deseas finalizar el test?');

            if (confirmar) {
                finalizarTest();
            }
        }
    };

document
    .getElementById(
        'anteriorBtn'
    )
    .onclick = () => {

        if (preguntaActual > 0) {
            preguntaActual--;
            mostrarNavegacion();
            mostrarPregunta();
        }
    };

document
    .getElementById(
        'finalizarBtn'
    )
    .onclick =
    finalizarTest;


function preguntasSinResponder() {

    return preguntas.filter(
        pregunta =>
            !pregunta.resposta_usuario
    ).length;

}

async function finalizarTest(automatico = false) {

    const pendientes =
        preguntasSinResponder();

    if(
    pendientes > 0 &&
    !automatico
){

    const confirmar =
    confirm(`Tienes ${pendientes} preguntas sin responder. ¿Quieres finalizar igualmente?`);

    if(!confirmar){
        return;
    }

}

if(automatico){
    alert('Tempo esgotado. O exame finalizouse automaticamente.');
}

    await actualizarTestFinalizado();

    localStorage.removeItem(`inicio_${idTest}`);
    localStorage.removeItem(`limite_${idTest}`);

    window.location.href = `resultado.html?idTest=${idTest}`;

}

async function actualizarTestFinalizado() {

    const duracion = Math.floor(
        (Date.now() - inicio) / 1000
    );

    const response =
        await fetch(
            `${API}/tests/${idTest}`,
            {

                method: 'PUT',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    duracion,
                    resultado: null,
                    finalizado: 1
                })

            }
        );

}

cargarTest();

iniciarTemporizador();
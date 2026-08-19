requireLogin();

const API = CONFIG.API;

const params =
    new URLSearchParams(
        window.location.search
    );

const idTest = params.get('idTest');
 
let preguntas = [];
let preguntaActual = 0;
let intervaloTemporizador;
let tiempoRestante = null;
let testFinalizado = false;
let abandonandoTest = false;


function mostrarNavegacion() {

    const nav =
        document.getElementById('preguntas-nav');


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
        .querySelectorAll('.pregunta-numero')
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

    const responseTest =
        await fetch(
            `${API}/tests/${idTest}`,
            {
                headers: {
                    Authorization:
                        `Bearer ${getToken()}`
                }
            }
        );

    if (!responseTest.ok) {

        alert('No se pudo cargar el test.');

        return;

    }

    const test =
        await responseTest.json();

    const responsePreguntas =
        await fetch(
            `${API}/tests/${idTest}/preguntas`,
            {
                headers: {
                    Authorization:
                        `Bearer ${getToken()}`
                }
            }
        );

    preguntas =
        await responsePreguntas.json();

    mostrarNavegacion();
    mostrarPregunta();
    iniciarTemporizador(test);
    configurarNavegacionInterna();
    configurarBotonAtras();
    configurarBeforeUnload();

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

        <h2 class="enunciado-pregunta">
            ${pregunta.enunciado}
        </h2>

        ${pregunta.opciones
            .map(opcion => `

                <label class = "opcion">
                <input type="radio" name="respuesta"
                value="${opcion.letra_opcion}"
                ${pregunta.resposta_usuario === opcion.letra_opcion ? 'checked' : ''}
                >
                ${opcion.texto}
                </label>
                `)
                .join('')}

        `;

    const radios =
    document.querySelectorAll(
        'input[name="respuesta"]'
    );

    let radioMarcado =
        document.querySelector(
            'input[name="respuesta"]:checked'
        );

    radios.forEach(input => {

        input.addEventListener('click', async () => {

            // Si vuelvo a pulsar el mismo radio button, se desmarca
            if (radioMarcado === input) {

                input.checked = false;
                radioMarcado = null;

                pregunta.resposta_usuario = null;

                await guardarRespuesta(
                    pregunta.id_pregunta,
                    null
                );

                mostrarNavegacion();

                return;
            }

            // Nueva selección
            radioMarcado = input;

            pregunta.resposta_usuario = input.value;

            await guardarRespuesta(
                pregunta.id_pregunta,
                input.value
            );

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
                    'Content-Type': 'application/json',
                    Authorization:`Bearer ${getToken()}`
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

            const confirmar =
                confirm(
                    'Has llegado a la última pregunta. ¿Deseas finalizar el test?'
                );

            if (confirmar) {
                await finalizarTest();
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
    () => finalizarTest();

function preguntasSinResponder() {

    return preguntas.filter(
        pregunta =>
            !pregunta.resposta_usuario
    ).length;

}

function iniciarTemporizador(test) {

    // Sin límite
    if (!test.duracion_limite) {

        document
            .getElementById('temporizador')
            .textContent =
            'Sin límite de tiempo';

        return;

    }

    const inicio =
        new Date(
            test.data_realizacion
        ).getTime();

    const limite =
        Number(
            test.duracion_limite
        ) * 1000;

    function actualizarTemporizador() {

        const transcurrido =
            Date.now() - inicio;

        tiempoRestante =
            Math.max(
                0,
                limite - transcurrido
            );

        const segundos =
            Math.ceil(
                tiempoRestante / 1000
            );

        const minutos =
            Math.floor(
                segundos / 60
            );

        const segundosRestantes =
            segundos % 60;

        document
            .getElementById('temporizador')
            .textContent =
            `Tiempo restante: ${
                minutos
            }:${
                String(
                    segundosRestantes
                ).padStart(2, '0')
            }`;

        if (tiempoRestante <= 0) {

            clearInterval(
                intervaloTemporizador
            );

            finalizarTest(true);

        }

    }

    actualizarTemporizador();

    intervaloTemporizador =
        setInterval(
            actualizarTemporizador,
            1000
        );

}

async function finalizarTest(automatico = false) {

    if (testFinalizado) {
        return;
    }

    // Si la finalización es automática, no pedir confirmación.
    if (automatico) {

        testFinalizado = true;

        if (intervaloTemporizador) {
            clearInterval(intervaloTemporizador);
        }

        alert('Tiempo agotado. El examen se finalizó automáticamente.');

        await actualizarTestFinalizado();

        window.location.href =
            `resultado.html?idTest=${idTest}`;

        return;
    }

    const pendientes =
        preguntasSinResponder();

    if (pendientes > 0) {

        const confirmar =
            confirm(
                `Tienes ${pendientes} preguntas sin responder. ¿Quieres finalizar igualmente?`
            );

        if (!confirmar) {
            return;
        }

    }

    testFinalizado = true;

    if (intervaloTemporizador) {
        clearInterval(intervaloTemporizador);
    }

    await actualizarTestFinalizado();

    window.location.href =
        `resultado.html?idTest=${idTest}`;

}

async function actualizarTestFinalizado() {

    const response =
        await fetch(
            `${API}/tests/${idTest}`,
            {
                method: 'PUT',

                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`
                },

                body: JSON.stringify({
                    finalizado: 1
                })
            }
        );

    if (!response.ok) {

        const data =
            await response.json();

        throw new Error(
            data.mensaje ||
            'No se pudo finalizar el test'
        );

    }

}

async function confirmarAbandono() {

    if (testFinalizado) {
        return true;
    }

    const confirmar =
        confirm('Si sales del test, el intento actual finalizará. ¿Estás seguro de que quieres salir?');

    if (!confirmar) {
        return false;
    }

    abandonandoTest = true;

    await finalizarTest(
        false,
        true
    );

    return true;
}

function configurarNavegacionInterna() {

    document
        .querySelectorAll('a[href]')
        .forEach(enlace => {

            enlace.addEventListener(
                'click',
                async event => {

                    // Ignorar enlaces que no abandonan realmente la página.
                    if (
                        enlace.target === '_blank' ||
                        enlace.hasAttribute('download') ||
                        enlace.getAttribute('href').startsWith('#')
                    ) {
                        return;
                    }

                    event.preventDefault();

                    const puedeSalir =
                        await confirmarAbandono();

                    if (puedeSalir) {

                        window.location.href =
                            enlace.href;
                    }

                }
            );

        });
}

function configurarBotonAtras() {

    history.pushState(
        {
            testEnCurso: true
        },
        '',
        window.location.href
    );

    window.addEventListener(
        'popstate',
        async () => {

            // Volvemos a colocar el estado para mantener al usuario en el test mientras mostramos la confirmación.
            history.pushState(
                {
                    testEnCurso: true
                },
                '',
                window.location.href
            );

            const puedeSalir =
                await confirmarAbandono();

            if (puedeSalir) {

                // El test ya está finalizado. Ahora sí permitimos salir.
                history.back();
            }

        }
    );
}

/*
    El navegador mostrará su propio mensaje de confirmación. No podemos controlar el texto exacto.
    Si el usuario confirma el cierre, no podemos garantizar que el test se marque como finalizado en la base de datos.
    Para los enlaces internos y el botón Atrás sí podemos hacerlo. 
*/
function configurarBeforeUnload() {

    window.addEventListener(
        'beforeunload',
        event => {

            if (testFinalizado) {
                return;
            }

            event.preventDefault();

            event.returnValue = '';
        }
    );
}

cargarTest();
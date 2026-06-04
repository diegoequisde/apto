const API =
    'http://localhost:3000/api';

const container =
    document.getElementById(
        'question-container'
    );

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
    );
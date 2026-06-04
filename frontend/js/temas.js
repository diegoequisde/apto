const API =
    'http://localhost:3000/api';

const temasList =
    document.getElementById('temasList');

async function cargarTemas() {

    const response =
        await fetch(`${API}/temas`);

    const temas =
        await response.json();

    temasList.innerHTML = '';

    temas.forEach((tema) => {

        temasList.innerHTML += `
            <li>
                ${tema.nome_tema}

                <button
                    onclick="eliminarTema(${tema.id_tema})"
                >
                    X
                </button>
            </li>
        `;

    });

}

async function crearTema() {

    const nombre =
        document.getElementById('nombreTema')
            .value;

    await fetch(
        `${API}/temas`,
        {
            method: 'POST',
            headers: {
                'Content-Type':
                    'application/json'
            },
            body: JSON.stringify({
                nome_tema: nombre
            })
        }
    );

    cargarTemas();

}

async function eliminarTema(id) {

    await fetch(
        `${API}/temas/${id}`,
        {
            method: 'DELETE'
        }
    );

    cargarTemas();

}

document
    .getElementById('crearTemaBtn')
    .addEventListener(
        'click',
        crearTema
    );

cargarTemas();
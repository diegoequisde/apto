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
            onclick="editarTema(
                ${tema.id_tema}
            )"
        >
            Editar
        </button>

        <button
            onclick="eliminarTema(
                ${tema.id_tema}
            )"
        >
            Eliminar
        </button>

        <button
            onclick="gestionarPreguntas(
                ${tema.id_tema}
            )"
        >
            Preguntas
        </button>

    </li>
    `;

    });

}

function gestionarPreguntas(idTema) {

    window.location.href =
        `/preguntas/index.html?idTema=${idTema}`;

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

function irCrearTema() {

    window.location.href =
        './crear.html';

}

cargarTemas();
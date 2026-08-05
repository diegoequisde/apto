requireLogin();

const API = CONFIG.API;

const temasList =
    document.getElementById('temasList');


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

    temasList.innerHTML = '';

    temas.forEach((tema) => {

        temasList.innerHTML += `
            <div>

                <p>
                    <strong>${tema.nome_tema}</strong>
                </p>

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

                <hr>

            </div>
        `;

    });

}

function gestionarPreguntas(idTema) {

    window.location.href =
        `/preguntas/index.html?idTema=${idTema}`;

}

function editarTema(idTema) {

    window.location.href =
        `./editar.html?id=${idTema}`;

}

async function eliminarTema(id) {

    if (
        !confirm(
            '¿Eliminar tema?'
        )
    ) {
        return;
    }

    const response =
        await fetch(
            `${API}/temas/${id}`,
            {
                method: 'DELETE'
            }
        );

    if (!response.ok) {

        alert('Non foi posible eliminar o tema.');
        return;

    }

    cargarTemas();

}

function irCrearTema() {

    if (!puede('usuario')) {
        return;
    }

    window.location.href = './crear.html';

}

cargarTemas();
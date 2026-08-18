const API = CONFIG.API;

const container =
    document.getElementById(
        'oposicionesContainer'
    );

async function cargarOposiciones() {

    const response =
        await fetch(
            `${API}/oposiciones`,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }
        );

    const oposiciones =
        await response.json();

    container.innerHTML = '';

    oposiciones.forEach(
        (oposicion) => {

            container.innerHTML += `
                <div class="oposicion-card">

                    <h3>
                        <a href="/oposiciones/detalle.html?id=${oposicion.id_oposicion}">
                        ${oposicion.nome_oposicion}
                        </a>
                    </h3>

                    <p>
                        ${oposicion.descripcion_oposicion  || ''}
                    </p>

                    <button class = "editar"
                        onclick="editarOposicion(
                            ${oposicion.id_oposicion}
                        )"
                    >
                        Editar
                    </button>

                    <button class = "eliminar"
                        onclick="eliminarOposicion(
                            ${oposicion.id_oposicion}
                        )"
                    >
                        Eliminar
                    </button>

                    <hr>

                </div>
            `;

        }
    );

}

function irCrearOposicion() {

    window.location.href =
        'crear.html';

}

function editarOposicion(id) {

    window.location.href =
        `editar.html?id=${id}`;

}

async function eliminarOposicion(id) {

    if (
        !confirm(
            '¿Eliminar oposición?'
        )
    ) {
        return;
    }

    await fetch(
        `${API}/oposiciones/${id}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }
    );

    cargarOposiciones();

}

cargarOposiciones();
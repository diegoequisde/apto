const API =
    'http://localhost:3000/api';

const container =
    document.getElementById(
        'oposicionesContainer'
    );

async function cargarOposiciones() {

    const response =
        await fetch(
            `${API}/oposiciones`
        );

    const oposiciones =
        await response.json();

    container.innerHTML = '';

    oposiciones.forEach(
        (oposicion) => {

            container.innerHTML += `
                <div>

                    <h3>
                        ${oposicion.nome_oposicion}
                    </h3>

                    <p>
                        ${oposicion.descripcion_oposicion  || ''}
                    </p>

                    <button
                        onclick="editarOposicion(
                            ${oposicion.id_oposicion}
                        )"
                    >
                        Editar
                    </button>

                    <button
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
            method: 'DELETE'
        }
    );

    cargarOposiciones();

}

cargarOposiciones();
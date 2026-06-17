const API =
    'http://localhost:3000/api';

const idUsuario = 1; // esto caundo hagamos la autenticación, lo sacaremos del token o de la sesión del usuario logeado

async function cargarUsuario() {

    const response =
        await fetch(
            `${API}/usuarios/${idUsuario}`
        );

    const usuario =
        await response.json();

    document.getElementById(
        'nombreUsuario'
    ).textContent =
        usuario.nome;

    document.getElementById(
        'emailUsuario'
    ).textContent =
        usuario.email;

    document.getElementById(
        'tipoUsuario'
    ).textContent =
        usuario.tipo;

}

async function cargarOposiciones() {

    const response =
        await fetch(
            `${API}/usuarios/${idUsuario}/oposiciones`
        );

    const oposiciones =
        await response.json();

    const container =
        document.getElementById(
            'oposicionesContainer'
        );

    container.innerHTML = '';

    oposiciones.forEach(
        (oposicion) => {

            container.innerHTML += `
                <div>

                    ${oposicion.nome_oposicion}

                    <button
                        onclick="
                            eliminarOposicion(
                                ${oposicion.id_oposicion}
                            )
                        "
                    >
                        Eliminar
                    </button>

                </div>

                <hr>
            `;

        }
    );

}

async function cargarOposicionesDisponibles() {

    const response =
        await fetch(
            `${API}/oposiciones`
        );

    const oposiciones =
        await response.json();

    const select =
        document.getElementById(
            'oposicionSelect'
        );

    select.innerHTML = '';

    oposiciones.forEach(
        (oposicion) => {

            select.innerHTML += `
                <option
                    value="${oposicion.id_oposicion}"
                >
                    ${oposicion.nome_oposicion}
                </option>
            `;

        }
    );

}

async function anadirOposicion() {

    const idOposicion =
        document.getElementById(
            'oposicionSelect'
        ).value;

    await fetch(
        `${API}/usuarios/${idUsuario}/oposiciones`,
        {
            method: 'POST',
            headers: {
                'Content-Type':
                    'application/json'
            },
            body: JSON.stringify({
                id_oposicion:
                    idOposicion
            })
        }
    );

    cargarOposiciones();

}

async function eliminarOposicion(
    idOposicion
) {

    await fetch(
        `${API}/usuarios/${idUsuario}/oposiciones/${idOposicion}`,
        {
            method: 'DELETE'
        }
    );

    cargarOposiciones();

}

document
    .getElementById(
        'anadirOposicionBtn'
    )
    .addEventListener(
        'click',
        anadirOposicion
    );

async function inicializar() {

    await cargarUsuario();

    await cargarOposiciones();

    await cargarOposicionesDisponibles();

}

inicializar();
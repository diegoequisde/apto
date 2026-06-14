const API =
    'http://localhost:3000/api';

const params =
    new URLSearchParams(
        window.location.search
    );

const idOposicion =
    params.get('id');

async function inicializar() {

    await cargarOposicion();

    await cargarTemas();

    await cargarTemasOposicion();

}

async function cargarOposicion() {

    const response =
        await fetch(
            `${API}/oposiciones/${idOposicion}`
        );

    const oposicion =
        await response.json();

    document.getElementById(
        'nombre'
    ).value =
        oposicion.nome_oposicion;

    document.getElementById(
        'descripcion'
    ).value =
        oposicion.descripcion_oposicion || '';

}

async function cargarTemas() {

    const response =
        await fetch(
            `${API}/temas`
        );

    const temas =
        await response.json();

    const select =
        document.getElementById(
            'temaSelect'
        );

    select.innerHTML = '';

    temas.forEach((tema) => {

        select.innerHTML += `
            <option
                value="${tema.id_tema}"
            >
                ${tema.nome_tema}
            </option>
        `;

    });

}

async function cargarTemasOposicion() {

    const response =
        await fetch(
            `${API}/oposiciones/${idOposicion}/temas`
        );

    const temas =
        await response.json();

    const container =
        document.getElementById(
            'temasOposicionContainer'
        );

    container.innerHTML = '';

    temas.forEach((tema) => {

        container.innerHTML += `
            <div>

                ${tema.nome_tema}

                <button
                    onclick="
                        eliminarTema(
                            ${tema.id_tema}
                        )
                    "
                >
                    Eliminar
                </button>

            </div>

            <hr>
        `;

    });

}

async function guardarCambios() {

    const nombre =
        document.getElementById(
            'nombre'
        ).value;

    const descripcion =
        document.getElementById(
            'descripcion'
        ).value;

    await fetch(
        `${API}/oposiciones/${idOposicion}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type':
                    'application/json'
            },
            body: JSON.stringify({
                nome_oposicion: nombre,
                descripcion_oposicion:
                    descripcion
            })
        }
    );

    alert(
        'Oposición actualizada'
    );

}

// Añadir y eliminar temas
async function anadirTema() {

    const idTema =
        document.getElementById(
            'temaSelect'
        ).value;

    await fetch(
        `${API}/oposiciones/${idOposicion}/temas`,
        {
            method: 'POST',
            headers: {
                'Content-Type':
                    'application/json'
            },
            body: JSON.stringify({
                id_tema: idTema
            })
        }
    );

    cargarTemasOposicion();

}

async function eliminarTema(idTema) {

    await fetch(
        `${API}/oposiciones/${idOposicion}/temas/${idTema}`,
        {
            method: 'DELETE'
        }
    );

    cargarTemasOposicion();

}

async function eliminarTema(idTema) {

    await fetch(
        `${API}/oposiciones/${idOposicion}/temas/${idTema}`,
        {
            method: 'DELETE'
        }
    );

    cargarTemasOposicion();

}

document
    .getElementById(
        'guardarBtn'
    )
    .addEventListener(
        'click',
        guardarCambios
    );

document
    .getElementById(
        'anadirTemaBtn'
    )
    .addEventListener(
        'click',
        anadirTema
    );

inicializar();
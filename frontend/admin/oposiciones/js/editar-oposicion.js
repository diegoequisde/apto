const API = CONFIG.API;

const params =
    new URLSearchParams(
        window.location.search
    );

const idOposicion =
    params.get('id');

async function inicializar() {

    await cargarOposicion();
    await cargarTemasOposicion();

}

async function cargarOposicion() {

    const response =
        await fetch(
            `${API}/oposiciones/${idOposicion}`,
            {
                headers:{
                    Authorization: `Bearer ${getToken()}`
                }
            }
        );

    const oposicion =
        await response.json();

    document.getElementById(
        'nombreOposicion'
    ).value =
        oposicion.nome_oposicion;

    document.getElementById(
        'descripcionOposicion'
    ).value =
        oposicion.descripcion_oposicion || '';

}

async function cargarTemas(temasAsignados = []) {

    const response =
        await fetch(
            `${API}/temas`,
            {
                headers:{
                    Authorization: `Bearer ${getToken()}`
                }
            }
        );

    const temas =
        await response.json();

    const select =
        document.getElementById('temaSelect');

    select.innerHTML = '';

    const idsAsignados =
        temasAsignados.map(
            tema => tema.id_tema
        );

    temas
        .filter(
            tema => !idsAsignados.includes(tema.id_tema)
        )
        .forEach(tema => {

            select.innerHTML += `
                <option value="${tema.id_tema}">
                    ${tema.nome_tema}
                </option>
            `;

        });

}

async function cargarTemasOposicion() {

    const response =
        await fetch(
            `${API}/oposiciones/${idOposicion}/temas`,
            {
                headers:{
                    Authorization: `Bearer ${getToken()}`
                }
            }
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

                <p>
                    <strong>${tema.nome_tema}</strong>
                </p>

                <button
                    onclick="
                        eliminarTema(
                            ${tema.id_tema}
                        )
                    "
                >
                    Eliminar
                </button>
            <hr>
            
            </div>
            
        `;

    });

    await cargarTemas(temas);

}

async function guardarCambios() {

    const nombre =
        document.getElementById(
            'nombreOposicion'
        ).value;

    const descripcion =
        document.getElementById(
            'descripcionOposicion'
        ).value;

    const response =
    await fetch(
        `${API}/oposiciones/${idOposicion}`,
        {
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                Authorization: `Bearer ${getToken()}`
            },
            body:JSON.stringify({
                nome_oposicion:nombre,
                descripcion_oposicion:descripcion
            })
        }
);

const data =
await response.json();

if(!response.ok){
    alert(data.mensaje);
    return;
}

window.location.href = '/admin/oposiciones/index.html';
}

// Añadir y eliminar temas
async function anadirTema() {

    const idTema =
        document.getElementById(
            'temaSelect'
        ).value;

    const response = await fetch(
        `${API}/oposiciones/${idOposicion}/temas`,
        {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                Authorization: `Bearer ${getToken()}`
            },
            body: JSON.stringify({
                id_tema: idTema
            })
        }
    );

    if (!response.ok) {
        const data = await response.json();
        alert(data.mensaje);
    return;
}

    cargarTemasOposicion();

}

async function eliminarTema(idTema) {

    const response = await fetch(
        `${API}/oposiciones/${idOposicion}/temas/${idTema}`,
        {
            method:'DELETE',
            headers:{
                Authorization: `Bearer ${getToken()}`
            }
        }
    );
    
    if (!response.ok) {
        const data = await response.json();
        alert(data.mensaje);
        return;
    }

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
requireLogin();

const API = 'http://localhost:3000/api';

const usuario = getUsuarioActual();
const idUsuario = usuario.id;
const buscador = document.getElementById('buscarOposicion');
const resultados = document.getElementById('resultadosBusqueda');

buscador.addEventListener(
    'input',
    buscarOposiciones
);

async function cargarUsuario() {

    const response =
        await fetch(
            `${API}/usuarios/${idUsuario}`,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            }
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
            `${API}/usuarios/${idUsuario}/oposiciones`,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            }
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
                        ">Eliminar</button>
                </div>
                <hr>
            `;

        }
    );

}

resultados.addEventListener(
    'click',
    async(e)=>{

        const tarjeta =
        e.target.closest('.resultadoBusqueda');

        if(!tarjeta)return;

        await anadirOposicion(
            tarjeta.dataset.id
        );

    }
);


function pintarResultados(oposiciones){

    resultados.innerHTML = '';

    oposiciones.forEach(oposicion=>{

        resultados.innerHTML += `
            <article
                class="resultadoBusqueda"
                data-id="${oposicion.id_oposicion}"
            >
                ${oposicion.nome_oposicion}
            </article>
        `;

    });

}

async function buscarOposiciones(){

    const texto = buscador.value.trim();

    if(texto.length < 2){
        resultados.innerHTML = '';
        return;
    }

    const response = await fetch(
        `${API}/oposiciones?search=${encodeURIComponent(texto)}`,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }
    );

    const oposiciones = await response.json();

    pintarResultados(oposiciones);
}

async function anadirOposicion(idOposicion){

    await fetch(
        `${API}/usuarios/${idUsuario}/oposiciones`,
        {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                Authorization: `Bearer ${getToken()}`
            },
            body:JSON.stringify({
                id_oposicion:idOposicion
            })
        }
    );

    buscador.value='';

    resultados.innerHTML='';

    cargarOposiciones();

}

async function eliminarOposicion(
    idOposicion
) {

   await fetch(
        `${API}/usuarios/${idUsuario}/oposiciones/${idOposicion}`,
        {
            method:'DELETE',
            headers:{
                Authorization: `Bearer ${getToken()}`
            }
        }
    );

    cargarOposiciones();

}

async function inicializar() {
    await cargarUsuario();
    await cargarOposiciones();
}

inicializar();
requireLogin();

const API = CONFIG.API;

const container =
    document.getElementById(
        'preguntasContainer'
    );

const params =
    new URLSearchParams(
        window.location.search
    );

const idTema =
    params.get('idTema');

let paginaActual = 1;

const limite = 20;

async function cargarTema() {

    if (!idTema) {
        return;
    }

    const response = await fetch(
        `${API}/temas/${idTema}`,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }
    );

    const tema =
        await response.json();

    document.getElementById(
        'tituloTema'
    ).textContent =
        `Preguntas · ${tema.nome_tema}`;

}
async function cargarPreguntas() {

    let url =
        `${API}/preguntas?page=${paginaActual}&limit=${limite}`;

    if (idTema) {

        url += `&idTema=${idTema}`;

    }

    const response = await fetch(
        url,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }
    );

    const data =
        await response.json(); 

document
    .getElementById(
        'siguienteBtn'
    )
    .disabled =
        paginaActual >=
        data.totalPages;

document
    .getElementById(
        'anteriorBtn'
    )
    .disabled =
        paginaActual === 1;

    const preguntas =
        data.items;

    document.getElementById(
    'infoPaginacion'
    ).textContent =
        `
        Página
        ${data.page}
        de
        ${data.totalPages}
        `;

    container.innerHTML = '';

    const inicio =
    (paginaActual - 1) * limite + 1;

    const fin =
        Math.min(
            paginaActual * limite,
            data.total
        );

    document.getElementById(
        'contadorPreguntas'
    ).textContent =
        `Mostrando ${inicio}-${fin} de ${data.total} preguntas`;
    
    preguntas.forEach((pregunta) => {

        container.innerHTML += `
            <div>
                <p>
                    ${pregunta.enunciado}
                </p>

                <button class= "editar" onclick="editarPregunta(
                        ${pregunta.id_pregunta}
                    )"
                >
                    Editar
                </button>
                
                <button class= "eliminar" onclick="eliminarPregunta(
                        ${pregunta.id_pregunta}
                    )"
                >
                    Eliminar
                </button>

                <hr>
            </div>
        `;
    });

    window.scrollTo({
    top: 0,
    behavior: 'smooth'
});

}

function irCrearPregunta(){

    if(!puede('usuario')){
        return;
    }

    window.location.href = './crear.html';

}

function editarPregunta(id) {

    window.location.href =
        `editar.html?id=${id}`;

}

async function eliminarPregunta(id) {

    if (
        !confirm(
            '¿Eliminar pregunta?'
        )
    ) {
        return;
    }
    
    const response = await fetch(
        `${API}/preguntas/${id}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }
    );

    if(!response.ok){

        alert('No fue posible eliminar la pregunta.');
        return;

    }

    cargarPreguntas();

}

// botones de paginación
document
.getElementById('anteriorBtn')
.addEventListener('click',()=>{

    if(paginaActual > 1){

        paginaActual--;

        cargarPreguntas();

    }

});

document
.getElementById('siguienteBtn')
.addEventListener('click',()=>{

    paginaActual++;

    cargarPreguntas();

});

async function inicializar() {

    await cargarTema();

    await cargarPreguntas();

}

inicializar();
const API = CONFIG.API;

const buscador = document.getElementById('buscarOposicion');

const resultados = document.getElementById('resultadosBusqueda');

buscador.addEventListener(
    'input',
    buscarOposiciones
);

const btnPremium = document.getElementById('btnPremium');

if (
    btnPremium &&
    estaLogueado() &&
    !esFree()
) {
    btnPremium.remove();
}

async function buscarOposiciones(){

    const texto =
    buscador.value.trim();

    if(texto.length < 2){

        resultados.innerHTML='';

        return;

    }

    const response =
    await fetch(
        `${API}/oposiciones?search=${encodeURIComponent(texto)}`
    );

    const oposiciones =
    await response.json();

    pintarResultados(oposiciones);

}

function pintarResultados(lista){

    resultados.innerHTML='';

    lista.forEach(oposicion=>{

        resultados.innerHTML += `
            <article
                class="resultado-oposicion"
                data-id="${oposicion.id_oposicion}"
            >
                ${oposicion.nome_oposicion}
            </article>
        `;

    });

}

document
.getElementById('resultadosBusqueda')
.addEventListener('click',e=>{

    const tarjeta =
    e.target.closest('.resultado-oposicion');

    if(!tarjeta)return;

    buscador.value = '';
    resultados.innerHTML = '';

    window.location.href =`/oposiciones/detalle.html?id=${tarjeta.dataset.id}`;
});
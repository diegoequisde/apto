requireLogin();

const API = CONFIG.API;

const oposicionSelect = document.getElementById('oposicion');
const temaSelect = document.getElementById('tema');
const bloqueTemas = document.getElementById('bloqueTemas');
const listaTemas = document.getElementById('listaTemas');
const usuarioActual = getUsuarioActual();
let temasSeleccionados = [];

// evitar que se escriba algo que no sean numeros
const cantidadTema = document.getElementById('cantidadTema');

cantidadTema.addEventListener('input', () => {

    cantidadTema.value =
        cantidadTema.value.replace(/\D/g, '');

});

//evitar que quede el campo vacío
cantidadTema.addEventListener('blur', () => {

    if (
        cantidadTema.value === '' ||
        Number(cantidadTema.value) < 1
    ) {
        cantidadTema.value = 1;
    }
});

async function cargarOposiciones(){

const response =
    await fetch(
        `${API}/oposiciones`,
        {
            headers:{
                Authorization:`Bearer ${getToken()}`
            }
        }
    );

const oposiciones =
await response.json();


oposicionSelect.innerHTML =
`<option value="">Selecciona oposición</option>`;

oposiciones.forEach(
oposicion=>{

oposicionSelect.innerHTML += `
<option value="${oposicion.id_oposicion}">${oposicion.nome_oposicion}
</option>
`;

});

}

async function cargarTemas(idOposicion){

    const response =
        await fetch(
            `${API}/oposiciones/${idOposicion}/temas`,
            {
                headers:{
                    Authorization:`Bearer ${getToken()}`
                }
            }
        );

    const temas =
    await response.json();

    temaSelect.innerHTML='';

    temas.forEach(tema=>{

        temaSelect.innerHTML += `
            <option value="${tema.id_tema}">
                ${tema.nome_tema}
            </option>
        `;

    });

}

function anadirTema(){

    const idTema =
    temaSelect.value;

    if(!idTema)return;

    const nombreTema =
    temaSelect.options[
        temaSelect.selectedIndex
    ].text;

    const cantidad =
    Number(
        document.getElementById(
            'cantidadTema'
        ).value
    );

    const existente =
    temasSeleccionados.find(
        tema=>tema.id_tema==idTema
    );

    if(existente){

        alert(
            'Ese tema xa foi engadido.'
        );

        return;

    }

    temasSeleccionados.push({
        id_tema:idTema,
        nome:nombreTema,
        cantidad
    });

    pintarListaTemas();

}

function pintarListaTemas() {

    if (temasSeleccionados.length === 0) {
        bloqueTemas.style.display = 'none';
        return;
    }

    bloqueTemas.style.display = '';

    document.getElementById('tituloTemas').textContent =
        `Temas seleccionados (${temasSeleccionados.length})`;

    const total =
        temasSeleccionados.reduce(
            (suma, tema) => suma + tema.cantidad,
            0
        );

    document.getElementById('totalPreguntas').textContent =
        `Total de preguntas: ${total}`;

    listaTemas.innerHTML = '';

    temasSeleccionados.forEach((tema, index) => {

        listaTemas.innerHTML += `
            <div class="tema-seleccionado">

                <span>
                    <strong>${tema.nome}</strong>
                    · ${tema.cantidad} preguntas
                </span>

                <button type="button" onclick="eliminarTema(${index})">
                    Eliminar
                </button>

            </div>
        `;

    });

}

window.eliminarTema = function(index){
    temasSeleccionados.splice(index,1);
    pintarListaTemas();
}

document
.getElementById('generarBtn')
.addEventListener(
    'click',
    () => {

        generarTest();

    }
);

async function generarTest(){ 
    let temas = [...temasSeleccionados];

    // Si el usuario no ha añadido ningún tema,
    // usar el que tiene seleccionado actualmente.
    if (temas.length === 0) {

        if (!temaSelect.value) {
            alert('Selecciona un tema.');
            return;
        }

        temas.push({
            id_tema: temaSelect.value,
            nome: temaSelect.options[temaSelect.selectedIndex].text,
            cantidad: Number(cantidadTema.value)
        });

    }

    const duracionSeleccionada =
    document.getElementById('duracion').value;

    const duracion =
        duracionSeleccionada === ''
            ? null
            : Number(duracionSeleccionada);

    const response = await fetch(`${API}/tests`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({
            temas,
            duracion: duracion === ''
                ? null
                : Number(duracion)
        })
    });

    const data =
    await response.json();

    if(!response.ok){
        alert(data.mensaje);
        return;

    }

    window.location.href =`/generar-test/test.html?idTest=${data.id_test}`;

}

document
.getElementById(
    'anadirTemaBtn'
)
.addEventListener(
    'click',
    anadirTema
);

oposicionSelect.addEventListener(
    'change',
    () => {

        cargarTemas(
            oposicionSelect.value
        );

    }
);

document
.querySelectorAll('.btnOficial')
.forEach(boton => {

    boton.addEventListener(
        'click',
        () => generarTestOficial(
            boton.dataset.oposicion
        )
    );

});

async function generarTestOficial(idOposicion){

    if (!puede('premium')) {

        alert(
            'Los simulacros oficiales están disponibles sólo para usuarios Premium.'
        );

        window.location.href =
            '/suscripcion/planes.html';

        return;

    }

    const response =
    await fetch(
        `${API}/tests/oficial`,
        {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                Authorization:`Bearer ${getToken()}`
            },
            body:JSON.stringify({
                id_oposicion:idOposicion
            })
        }
    );

    const data =
    await response.json();

    if(!response.ok){
        alert(data.mensaje);
        return;

    }

    window.location.href =`/generar-test/test.html?idTest=${data.id_test}`;

}

async function inicializar(){

    if (usuarioActual.tipo === 'free') {

        await cargarTemaPersonalizado();

    } else {

        await cargarOposiciones();

    }

}

async function cargarTemaPersonalizado() {

    const response =
        await fetch(
            `${API}/temas`,
            {
                headers: {
                    Authorization:
                        `Bearer ${getToken()}`
                }
            }
        );

    const temas =
        await response.json();

    if (!response.ok || temas.length === 0) {

        alert(
            'No tienes ningún tema personalizado disponible.'
        );

        return;

    }

    const tema = temas[0];

    temaSelect.innerHTML = `
        <option value="${tema.id_tema}">
            ${tema.nome_tema}
        </option>
    `;

    // No necesitamos seleccionar oposición ni permitir añadir varios temas.
    oposicionSelect.parentElement.style.display = 'none';
    document
        .getElementById('anadirTemaBtn')
        .style.display = 'none';

}

inicializar();
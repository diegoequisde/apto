const API =
'http://localhost:3000/api';

const oposicionSelect =
document.getElementById('oposicion');

const temaSelect =
document.getElementById('tema');

const listaTemas =
document.getElementById('listaTemas');

let temasSeleccionados = [];

// evitar que se escriba algo que no sean numeros
const cantidadTema =
    document.getElementById('cantidadTema');

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
    `${API}/oposiciones`
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

    console.log(idOposicion);

    const response =
    await fetch(
        `${API}/oposiciones/${idOposicion}/temas`
    );

    console.log(response.status);

    const temas =
    await response.json();

    console.log(temas);

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

function pintarListaTemas(){

    listaTemas.innerHTML='';

    temasSeleccionados.forEach((tema,index)=>{

        listaTemas.innerHTML += `

        <article>
            <strong>${tema.nome}</strong> -
            ${tema.cantidad} preguntas

            <button type="button"
                onclick="eliminarTema(${index})">
                Eliminar
            </button>
        </article>
        `;
    });
}

window.eliminarTema = function(index){
    temasSeleccionados.splice(index,1);
    pintarListaTemas();
}

async function generarTest(){

    if(temasSeleccionados.length===0){

        alert('Engade polo menos un tema.');

        return;

    }

    const response =
    await fetch(
        `${API}/tests`,
        {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                id_usuario:1,
                temas:temasSeleccionados
            })
        }
    );

    const data =
    await response.json();

    if(!response.ok){

        alert(data.mensaje);

        return;

    }

    window.location.href =
    `/generar-test/test.html?idTest=${data.id_test}`;

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
.getElementById('generarBtn')
.addEventListener(
    'click',
    generarTest
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

    const response =
    await fetch(
        `${API}/tests/oficial`,
        {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                id_usuario:1,
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

    window.location.href =
    `/generar-test/test.html?idTest=${data.id_test}`;

}

async function inicializar(){

    await cargarOposiciones();

}

inicializar();
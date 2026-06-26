const API =
'http://localhost:3000/api';


const oposicionSelect =
document.getElementById(
    'oposicion'
);


const temaSelect =
document.getElementById(
    'tema'
);



async function cargarOposiciones(){


const response =
await fetch(
    `${API}/oposiciones`
);


const oposiciones =
await response.json();


oposicionSelect.innerHTML =
`<option value="">
Selecciona oposición
</option>`;


oposiciones.forEach(
oposicion=>{


oposicionSelect.innerHTML += `

<option value="${oposicion.id_oposicion}">
${oposicion.nome_oposicion}
</option>

`;

});


}



async function cargarTemas(idOposicion){


const response =
await fetch(
`${API}/temas?idOposicion=${idOposicion}`
);


const temas =
await response.json();


temaSelect.innerHTML = `

<option value="">
Todos los temas
</option>

`;



temas.forEach(
tema=>{


temaSelect.innerHTML += `

<option value="${tema.id_tema}">
${tema.nome_tema}
</option>

`;

});


}





oposicionSelect
.addEventListener(
'change',
()=>{


cargarTemas(
    oposicionSelect.value
);


});





document
.getElementById(
'generarBtn'
)
.addEventListener(
'click',
generarTest
);




async function generarTest(){


const idTema =
temaSelect.value;


const cantidad =
Number(
document.getElementById(
    'cantidad'
).value
);



const response =
await fetch(

`${API}/tests`,

{

method:'POST',

headers:{

'Content-Type':
'application/json'

},


body:JSON.stringify({

id_usuario:1,

id_tema:
idTema || null,

cantidad

})


}

);



const data =
await response.json();



window.location.href =
`/generar-test/test.html?idTest=${data.id_test}`;


}





cargarOposiciones();
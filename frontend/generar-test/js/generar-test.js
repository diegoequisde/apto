const API =
'http://localhost:3000/api';

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
document
.getElementById('tema')
.value;

const cantidad =
document
.getElementById('cantidad')
.value;

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
id_usuario:1, /* Cuando haya autentificación cambiar por algo parecido a esto: usuarioActual.id_usuario */
id_tema:idTema,
cantidad:Number(cantidad)
})
}
);


const data =
await response.json();

window.location.href =
`/generar-test/test.html?idTest=${data.id_test}`;

}
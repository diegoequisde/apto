const API =
'http://localhost:3000/api';

const params =
new URLSearchParams(
window.location.search
);

const idTest =
params.get('idTest');


async function cargarResultado(){

const response =
await fetch(
`${API}/tests/${idTest}/resultado`
);

const resultado =
await response.json();

document
.getElementById(
'aciertos'
)
.textContent =
resultado.aciertos;

document
.getElementById(
'errores'
)
.textContent =
resultado.errores;


document
.getElementById(
'nota'
)
.textContent =
`${resultado.nota}%`;



document
.getElementById(
'totalPreguntas'
)
.textContent =
resultado.total;

document
.getElementById(
'tiempo'
)
.textContent =
resultado.duracion ?? 'Pendiente';
}

document
.getElementById(
'revisionBtn'
)
.href =`revision.html?idTest=${idTest}`;

cargarResultado();
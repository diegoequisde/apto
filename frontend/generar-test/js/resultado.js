requireLogin();

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
    `${API}/tests/${idTest}/resultado`,
    {
        headers:{
            Authorization:`Bearer ${getToken()}`
        }
    }
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
.getElementById('tiempo')
.textContent =
formatearTiempo(resultado.duracion);
}

document
.getElementById(
'revisionBtn'
)
.href =`revision.html?idTest=${idTest}`;


function formatearTiempo(segundos){

    if(!segundos){
        return '0 min';
    }

    const horas =
    Math.floor(segundos / 3600);

    const minutos =
    Math.floor((segundos % 3600) / 60);

    const segundosRestantes =
    segundos % 60;

    if(horas > 0){

        return `${horas} h ${minutos} min ${segundosRestantes} s`;

    }

    return `${minutos} min ${segundosRestantes} s`;

}


cargarResultado();
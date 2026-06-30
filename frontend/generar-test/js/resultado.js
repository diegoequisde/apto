const resultado = {
    total:20,
    aciertos:16,
    errores:4,
    tiempo:'12 minutos'
};
/* al conectar con BD se cambia a: 
fetch(`/api/tests/${idTest}/resultado`)
*/

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
`${

Math.round(
(resultado.aciertos /
resultado.total) * 100
)

}%`;


document
.getElementById(
'totalPreguntas'
)
.textContent =resultado.total;


document
.getElementById(
'tiempo'
)
.textContent =
resultado.tiempo;

const params =
new URLSearchParams(
window.location.search
);


const idTest =
params.get('idTest');



document
.getElementById(
'revisionBtn'
)
.href =
`revision.html?idTest=${idTest}`;
document
.getElementById('generarBtn')
.addEventListener(
    'click',
    generarTest
);

function generarTest(){

const tema =
document.getElementById(
'tema'
).value;


const cantidad =
document.getElementById(
'cantidad'
).value;

window.location.href =
`
test.html?
tema=${tema}
&cantidad=${cantidad}
`;

}
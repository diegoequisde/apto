requireLogin();

const API = CONFIG.API;

const params =
new URLSearchParams(
    window.location.search
);


const idTest =
params.get('idTest');


let preguntas = [];


async function cargarRevision(){


    const response =
        await fetch(
            `${API}/tests/${idTest}/revision`,
            {
                headers:{
                    Authorization:`Bearer ${getToken()}`
                }
            }
        );


    preguntas =
    await response.json();


    mostrarNavegacion();

    mostrarPregunta(0);


}



function mostrarNavegacion(){


const nav =
document.getElementById(
    'preguntas-nav'
);


nav.innerHTML = '';



preguntas.forEach(
(pregunta,index)=>{


let estado =
'sin-respuesta';



if(
pregunta.resposta_usuario
){

    if(
    pregunta.e_correcta
    ){

        estado =
        'correcta';

    }
    else{

        estado =
        'fallada';

    }

}



nav.innerHTML += `

<button
class="pregunta-numero ${estado}"
data-pregunta="${index}">

${index + 1}

</button>

`;

});



document
.querySelectorAll(
    '.pregunta-numero'
)
.forEach(button=>{


button.addEventListener(
'click',
()=>{


mostrarPregunta(
Number(
button.dataset.pregunta
)
);


});


});


}




function mostrarPregunta(numero){


    const pregunta =
    preguntas[numero];



    document
    .querySelectorAll(
        '.pregunta-numero'
    )
    .forEach(
    button=>{

        button.classList.remove(
            'activa'
        );

    });



    document
    .querySelector(
        `[data-pregunta="${numero}"]`
    )
    .classList.add(
        'activa'
    );



    document
    .getElementById(
        'revision-container'
    )
    .innerHTML = `


<h2>
Pregunta ${numero + 1}
</h2>


<p>
${pregunta.enunciado}
</p>



${pregunta.opciones
.map(opcion=>{


let clase = '';



if(opcion.e_correcta){

    clase =
    'correcta';

}



if(
opcion.letra_opcion ===
pregunta.resposta_usuario
&&
!opcion.e_correcta
){

    clase =
    'fallada';

}



return `

<p class="opcion ${clase}">

<strong>
${opcion.letra_opcion}
</strong>

${opcion.texto}

</p>


`;


})
.join('')}


`;



}



cargarRevision();
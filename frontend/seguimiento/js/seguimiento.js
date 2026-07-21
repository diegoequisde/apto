const API =
'http://localhost:3000/api';


let datosEstadisticas;
let evolucionChart;
let temasDistribucionChart;
let temasAciertoChart;

async function cargarEstadisticas(
    periodo='total'
){

    const response =
    await fetch(
        `${API}/tests/estadisticas?periodo=${periodo}`
    );

    datosEstadisticas =
        await response.json();

    cargarResumen();
    crearGraficos();
}

function crearGraficos(){
    crearGraficoEvolucion();
    crearGraficoDistribucion();
    crearGraficoAcierto();
}

function cargarResumen(){

const resumen =
datosEstadisticas.resumen;

document
.getElementById('tiempo')
.textContent = formatearTiempo(resumen.tiempo);

document
.getElementById('racha')
.textContent = `${resumen.racha} días`;

document
.getElementById('tests')
.textContent = resumen.tests;

document
.getElementById('preguntas')
.textContent = resumen.preguntas;

document
.getElementById('acierto')
.textContent = `${Math.round(resumen.acierto)}%`;

}

function crearGraficoEvolucion(){

    if(evolucionChart){
        evolucionChart.destroy();
    }

    evolucionChart =
    new Chart(
        document.getElementById(
            'evolucionChart'
        ),
        {

        type:'line',

        data:{

            labels:
            datosEstadisticas.evolucion.map(
                dato=>dato.dia
            ),


            datasets:[

                {
                label:'Preguntas realizadas',

                data:
                datosEstadisticas.evolucion.map(
                    dato=>dato.preguntas
                )

                },

                {
                label:'Acierto %',

                data:
                datosEstadisticas.evolucion.map(
                    dato=>dato.acierto
                )
                }
            ]
        },

        options:{
            responsive:true
        }
        }
    );
}

function crearGraficoDistribucion(){

    if(temasDistribucionChart){
        temasDistribucionChart.destroy();
    }

    temasDistribucionChart =
    new Chart(
        document.getElementById(
            'temasDistribucionChart'
        ),
        {

        type:'doughnut',

        data:{

            labels:
            datosEstadisticas.temas.map(
                tema=>tema.nome_tema
            ),

            datasets:[
                {
                data:
                datosEstadisticas.temas.map(
                    tema=>tema.preguntas
                )
                }
            ]
        },

        options:{
            responsive:true
        }
        }
    );
}

function crearGraficoAcierto(){

    if(temasAciertoChart){
        temasAciertoChart.destroy();
    }

    temasAciertoChart =
    new Chart(
        document.getElementById('temasAciertoChart'),
        {

        type:'polarArea',

        data:{

            labels:
            datosEstadisticas.temas.map(
                tema=>tema.nome_tema
            ),

            datasets:[

                {

                label:'Acierto %',

                data:
                datosEstadisticas.temas.map(
                    tema=>tema.acierto
                )
                }
            ]
        },

        options:{
            responsive:true
        }
        }
    );
}

function formatearTiempo(segundos){

    if(!segundos){
        return '0 min';
    }

    const horas =
    Math.floor(segundos / 3600);

    const minutos =
    Math.floor((segundos % 3600) / 60);

    if(horas === 0){
        return `${minutos} min`;
    }

    return `${horas} h ${minutos} min`;

}

let periodoActual = 'total';

function gestionarFiltros(){

    document
    .querySelectorAll('.filters button')
    .forEach(
    button=>{

        button.addEventListener(
        'click',
        ()=>{

        periodoActual =
        button.dataset.periodo;

        cargarEstadisticas(
            periodoActual
        );
        });
    });
}

cargarEstadisticas();
gestionarFiltros();
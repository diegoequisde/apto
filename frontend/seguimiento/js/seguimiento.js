requireLogin();

const API = CONFIG.API;

let datosEstadisticas;
let evolucionChart;
let temasDistribucionChart;
let temasAciertoChart;
let periodoActual = 'total';

async function cargarEstadisticas(periodo){

    const response =
    await fetch(
        `${API}/tests/estadisticas?periodo=${periodo}`,
        {
            headers:{
                Authorization: `Bearer ${getToken()}`
            }
        }
    );

    if (!response.ok) {
        alert('No fue posible cargar las estadísticas.');
        return;
    }
    
    datosEstadisticas =
        await response.json();

    cargarResumen();
    crearGraficos();
}

function crearGraficos(){

    console.log('RESUMEN:', datosEstadisticas.resumen);
    console.log('EVOLUCION:', datosEstadisticas.evolucion);
    console.log('TEMAS:', datosEstadisticas.temas);

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
        document.getElementById('evolucionChart'),
        {

        type:'line',

        data:{

           labels:
            datosEstadisticas.evolucion.map(dato => {

                return new Date(dato.dia)
                    .toLocaleDateString(
                        'es-ES',
                        {
                            day: '2-digit',
                            month: 'short'
                        }
                    );

            }),


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
        document.getElementById('temasDistribucionChart'),
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

        options: {
            responsive: true
        }
        }
    );
}

function crearGraficoAcierto(){

    if(temasAciertoChart){
        temasAciertoChart.destroy();
    }

    const temasConDatos =
        datosEstadisticas.temas.filter(
            tema => tema.acierto !== null
        );

    temasAciertoChart =
    new Chart(
        document.getElementById('temasAciertoChart'),
        {

        type:'polarArea',

        data:{

            labels:
            temasConDatos.map(
                tema => tema.nome_tema
            ),


            datasets:[

                {

                label:'Acierto %',

                data:
                temasConDatos.map(
                        tema => Number(tema.acierto)
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

function gestionarFiltros(){

    const botones =
        document.querySelectorAll('.filters button');

    function actualizarBotonActivo() {

        botones.forEach(
            boton => {

                boton.classList.toggle(
                    'activo',
                    boton.dataset.periodo === periodoActual
                );

            }
        );

    }

    botones.forEach(
        button => {

            button.addEventListener(
                'click',
                () => {

                    periodoActual =
                        button.dataset.periodo;

                    actualizarBotonActivo();

                    cargarEstadisticas(
                        periodoActual
                    );

                }
            );

        }
    );

    actualizarBotonActivo();
}

cargarEstadisticas(periodoActual);

gestionarFiltros();
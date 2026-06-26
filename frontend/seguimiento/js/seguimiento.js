const datosEstadisticas = {

    evolucion: {

        dias:[
            'L',
            'M',
            'X',
            'J',
            'V',
            'S',
            'D'
        ],

        preguntas:[
            20,
            35,
            15,
            50,
            40,
            30,
            60
        ],

        acierto:[
            70,
            75,
            72,
            80,
            78,
            82,
            85
        ]

    },


    temas:{

        nombres:[
            'Constitución',
            'Administrativo',
            'Procedimiento'
        ],

        preguntas:[
            120,
            90,
            60
        ],

        acierto:[
            82,
            65,
            90
        ]

    }

};




function crearGraficoEvolucion(){


    new Chart(

        document.getElementById(
            'evolucionChart'
        ),

        {

        type:'line',

        data:{

            labels:
            datosEstadisticas.evolucion.dias,


            datasets:[

                {
                    label:'Preguntas realizadas',

                    data:
                    datosEstadisticas.evolucion.preguntas
                },


                {
                    label:'Acierto %',

                    data:
                    datosEstadisticas.evolucion.acierto
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


    new Chart(

        document.getElementById(
            'temasDistribucionChart'
        ),

        {

        type:'doughnut',


        data:{

            labels:
            datosEstadisticas.temas.nombres,


            datasets:[

                {

                data:
                datosEstadisticas.temas.preguntas

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


    new Chart(

        document.getElementById(
            'temasAciertoChart'
        ),

        {

        type:'polarArea',


        data:{

            labels:
            datosEstadisticas.temas.nombres,


            datasets:[

                {

                label:'Acierto %',

                data:
                datosEstadisticas.temas.acierto

                }

            ]

        },


        options:{

            responsive:true

        }

        }

    );


}






let periodoActual = '7';



function gestionarFiltros(){


    document
    .querySelectorAll(
        '.filters button'
    )
    .forEach(
    button => {


        button.addEventListener(
            'click',
            () => {


                periodoActual =
                button.dataset.periodo;


                cargarPeriodo(
                    periodoActual
                );


            }

        );


    });


}





function cargarPeriodo(periodo){


    console.log(
        'Periodo seleccionado:',
        periodo
    );


    /*
    Futuro:

    fetch(
        `/api/estadisticas?periodo=${periodo}`
    )

    */


}






crearGraficoEvolucion();

crearGraficoDistribucion();

crearGraficoAcierto();

gestionarFiltros();
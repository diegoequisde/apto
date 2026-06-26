const ctx =
document
.getElementById(
'evolucionChart'
);

new Chart(
ctx,
{

type:'line',
data:{
labels:[
'Lunes',
'Martes',
'Miércoles',
'Jueves',
'Viernes'
],

datasets:[
{
label:
'Preguntas contestadas',
data:[
20,
35,
25,
50,
40
]
}
]
},
options:{
responsive:true
}
}
);

const temas =
document.getElementById(
    'temasChart'
);


new Chart(
    temas,
    {
    type:'doughnut',

    data:{

        labels:[

        'Constitución',
        'Administrativo',
        'Procedimiento'

        ],

        datasets:[
        {
        data:[
        80,
        65,
        90
        ]
        }
        ]
    },

    options:{
        responsive:true
    }
});
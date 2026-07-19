const API =
    'http://localhost:3000/api';

async function cargarHistorial() {

    const response =
        await fetch(
            `${API}/tests/historial`
        );

    const tests =
        await response.json();


    const tabla =
        document.getElementById(
            'historial'
        );


    tests.forEach(test => {


        tabla.innerHTML += `
            <tr>
                <td>${new Date(test.data_realizacion).toLocaleDateString()}</td>
                <td>${test.resultado ?? '-'}</td>
                <td>${formatearTiempo(test.duracion)}</td>
                <td>
                    <a href="/generar-test/revision.html?idTest=${test.id_test}" role="button">Revisar</a>
                </td>
            </tr>
        `;

    });

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

cargarHistorial();
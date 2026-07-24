requireLogin();

const API =
    'http://localhost:3000/api';

const params =
    new URLSearchParams(
        window.location.search
    );

const idOposicion =
    params.get('id');

/*const idUsuario = 1;  
después de la autenticación se cambiará esto
En lugar de redirigir directamente al perfil, mostraría una confirmación breve:
✓ Oposición engadida correctamente. [ Ir ao perfil ]
*/

const usuario = getUsuarioActual();

const idUsuario = usuario.id;

document
    .getElementById('anadirOposicionBtn')
    .addEventListener(
        'click',
        anadirOposicion
    );

async function cargarOposicion(){

    const response =
        await fetch(
            `${API}/oposiciones/${idOposicion}`
        );

    const oposicion =
        await response.json();

    document.getElementById(
        'nombreOposicion'
    ).textContent =
        oposicion.nome_oposicion;

    document.getElementById(
        'descripcionOposicion'
    ).textContent =
        oposicion.descripcion_oposicion ||
        'Esta oposición todavía no dispone de descripción.';

}

async function anadirOposicion(){

    const response =
        await fetch(
            `${API}/usuarios/${idUsuario}/oposiciones`,
            {
                method: 'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    id_oposicion:idOposicion
                })
            }
        );

    if(response.ok){

        window.location.href =
            '/perfil/index.html';

        return;

    }

    const error =
        await response.json();

    alert(
        error.mensaje ||
        'Non foi posible engadir a oposición (duplicada)'
    );

}

cargarOposicion();

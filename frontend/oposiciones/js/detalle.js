const API = CONFIG.API;

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

const idUsuario = usuario?.id;

const btn = document.getElementById('anadirOposicionBtn');

if(!estaLogueado()){
    btn.textContent = 'Inicia sesión para guardar esta oposición';
}

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

    if(!estaLogueado()){
        window.location.href = '/auth/login.html';
        return;
    }

    const response =
        await fetch(
            `${API}/usuarios/${idUsuario}/oposiciones`,
            {
                method: 'POST',
                headers:{
                    'Content-Type':'application/json',
                    Authorization:`Bearer ${getToken()}`
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

    alert(error.mensaje || 'No fue posible añadir la oposición (duplicada)');

}

cargarOposicion();

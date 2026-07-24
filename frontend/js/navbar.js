async function cargarNavbar() {

    const response = await fetch('/componentes/navbar.html');
    const html = await response.text();

    document.getElementById('navbar').innerHTML = html;

    aplicarPermisosNavbar();

}

function aplicarPermisosNavbar(){

    const navPerfil = document.getElementById('navPerfil');
    const navGenerarTest = document.getElementById('navGenerarTest');
    const navTemas = document.getElementById('navTemas');
    const navSeguimiento = document.getElementById('navSeguimiento');
    const navAdmin = document.getElementById('navAdmin');
    const navPremium = document.getElementById('navPremium');
    const navLogin = document.getElementById('navLogin');
    const navRegistro = document.getElementById('navRegistro');
    const navLogout = document.getElementById('navLogout');

    

    // Ocultar todo inicialmente

    navGenerarTest.style.display = 'none';
    navTemas.style.display = 'none';
    navSeguimiento.style.display = 'none';

    navPerfil.style.display = 'none';
    navAdmin.style.display = 'none';
    navAdmin.style.display = 'none';
navLogout.style.display = 'none';

    if(!estaLogueado()){

        navLogin.style.display = '';
        navRegistro.style.display = '';

        return;

    }

    const usuario = getUsuarioActual();

    navGenerarTest.style.display = '';
    navTemas.style.display = '';
    navSeguimiento.style.display = '';
    navPerfil.style.display = '';
    navAdmin.style.display = '';
    navLogout.style.display = '';

    navLogin.style.display = 'none';
    navRegistro.style.display = 'none';

    navPerfil
        .querySelector('a')
        .textContent = usuario.nome;

    if(esAdmin()){
        navAdmin.style.display = '';
    }

    if(esFree()){
        navPremium.style.display = '';
    }

    navLogout
        .querySelector('a')
        .addEventListener(
            'click',
            e => {

                e.preventDefault();
                cerrarSesion();

            }
        );

}

cargarNavbar();
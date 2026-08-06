async function cargarComponente(id, ruta) {

    const elemento =
        document.getElementById(id);

    if (!elemento) return;

    const response =
        await fetch(ruta);

    if (!response.ok) {
        console.error(`No se pudo cargar ${ruta}`);
        return;
    }

    elemento.innerHTML =
        await response.text();

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
    navPremium.style.display = 'none';
    navPerfil.style.display = 'none';
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

async function cargarLayout() {

    await cargarComponente(
        'navbar',
        '/componentes/navbar.html'
    );

    aplicarPermisosNavbar();

    await cargarComponente(
        'footer',
        '/componentes/footer.html'
    );

}

cargarLayout();
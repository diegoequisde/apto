async function cargarNavbar() {

    const response =
        await fetch('/componentes/navbar.html');

    const html =
        await response.text();

    document
        .getElementById('navbar')
        .innerHTML = html;

    aplicarPermisosNavbar();

}

function aplicarPermisosNavbar(){

    const usuario =
        getUsuarioActual();

    // Elementos
    const navPerfil =
        document.getElementById('navPerfil');

    const navAdmin =
        document.getElementById('navAdmin');

    const navLogin =
        document.getElementById('navLogin');

    const navRegistro =
        document.getElementById('navRegistro');

    const navLogout =
        document.getElementById('navLogout');

    // Ocultar todo inicialmente

    navPerfil.style.display = 'none';
    navAdmin.style.display = 'none';
    navLogout.style.display = 'none';

    if(usuario){

    navPerfil.style.display = '';
    navLogout.style.display = '';

    navLogin.style.display = 'none';
    navRegistro.style.display = 'none';

    // Mostrar el nombre del usuario
    navPerfil
        .querySelector('a')
        .textContent = usuario.nome;

    if(esAdmin()){
        navAdmin.style.display = '';
    }

    navLogout
        .querySelector('a')
        .addEventListener(
            'click',
            e=>{
                e.preventDefault();
                cerrarSesion();
            }
        );

}else{
    navLogin.style.display = '';
    navRegistro.style.display = '';
}

}

cargarNavbar();
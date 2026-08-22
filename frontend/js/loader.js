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
    
    inicializarMenuMobile();

    inicializarTema();

    await cargarComponente(
        'footer',
        '/componentes/footer.html'
    );

}

function inicializarMenuMobile() {

    const menuToggle = document.getElementById('menuToggle');
    const navbar = document.querySelector('.navbar');

    if (!menuToggle || !navbar) return;

    menuToggle.addEventListener('click', () => {

        const abierto = navbar.classList.toggle('mobile-open');

        menuToggle.setAttribute('aria-expanded', abierto);

        menuToggle.setAttribute(
            'aria-label',
            abierto ? 'Cerrar menú' : 'Abrir menú'
        );

        menuToggle.textContent = abierto ? '✕' : '☰';

    });

}

function inicializarTema() {

    const themeSwitchText =
    document.getElementById('themeSwitchText');

    const themeSwitch =
        document.getElementById('themeSwitch');

    const themeToggle =
        document.getElementById('themeToggle');

    if (!themeToggle) return;

    const html =
        document.documentElement;

    const temaGuardado =
        localStorage.getItem('tema');


    if (temaGuardado === 'dark') {

        html.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;

    }


    /* Actualizar accesibilidad */
    function actualizarAccesibilidad() {

        const modoOscuro =
            html.getAttribute('data-theme') === 'dark';

        const texto = modoOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';

        themeToggle.setAttribute('aria-label', texto);
        themeToggle.setAttribute('title', texto);
        themeSwitch.setAttribute('title', texto);
        themeSwitchText.textContent = texto;

    }

    themeToggle.addEventListener('change', () => {

        if (themeToggle.checked) {

            html.setAttribute('data-theme', 'dark');
            localStorage.setItem('tema', 'dark');

        } else {

            html.removeAttribute('data-theme');
            localStorage.setItem('tema', 'light');
        }

        actualizarAccesibilidad();

    });

    actualizarAccesibilidad();
}


function mostrarToast(mensaje, tipo = 'info', duracion = 1500) {

    let container =
        document.getElementById('toast-container');

    if (!container) {

        container =
            document.createElement('div');

        container.id =
            'toast-container';

        document.body.appendChild(container);
    }

    const toast =
        document.createElement('div');

    toast.className =
        `toast toast-${tipo}`;

    toast.textContent =
        mensaje;

    container.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, duracion);

}

cargarLayout();
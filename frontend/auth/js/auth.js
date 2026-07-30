// Gestión de sesión del usuario
const STORAGE_USER = 'usuario';
const STORAGE_TOKEN = 'token';


function guardarSesion(usuario, token){

    localStorage.setItem(
        STORAGE_USER,
        JSON.stringify(usuario)
    );

    localStorage.setItem(
        STORAGE_TOKEN,
        token
    );

}

function getToken(){

    return localStorage.getItem(STORAGE_TOKEN);

}

function getUsuarioActual(){

    const usuario = localStorage.getItem(STORAGE_USER);

    return usuario
        ? JSON.parse(usuario)
        : null;

}

function estaLogueado(){
    return getUsuarioActual() !== null;
}

function cerrarSesion(){

    localStorage.removeItem(STORAGE_USER);
    localStorage.removeItem(STORAGE_TOKEN);

    window.location.href='/';

}
// Roles

function tieneRol(rol){

    const usuario = getUsuarioActual();

    if(!usuario){
        return false;
    }

    return usuario.tipo === rol;

}

function esAdmin(){
    return tieneRol('admin');
}

function esPremium(){
    return tieneRol('premium');
}

function esFree(){
    return tieneRol('free');
}

// Permisos

function puede(permiso){

    if(!estaLogueado()){
        return false;
    }

    const usuario = getUsuarioActual();

    switch(permiso){

        case 'usuario':
            return ['free','premium','admin']
                .includes(usuario.tipo);

        case 'premium':
            return ['premium','admin']
                .includes(usuario.tipo);

        case 'admin':
            return usuario.tipo === 'admin';

        default:
            return false;

    }

}

// Protección de vistas
function requireLogin(){

    if(!puede('usuario')){
        window.location.href = '/auth/login.html';
    }

}

function requirePremium(){

    if(!puede('premium')){

        alert('Esta funcionalidade require unha conta Premium.');
        window.location.href = '/suscripcion/planes.html';

    }

}

function requireAdmin(){

    if(!puede('admin')){
        window.location.href = '/';
    }

}

 
window.getUsuarioActual = getUsuarioActual;
window.estaLogueado = estaLogueado;
window.guardarSesion = guardarSesion;
window.getToken = getToken;
window.cerrarSesion = cerrarSesion;

window.esAdmin = esAdmin;
window.esPremium = esPremium;
window.esFree = esFree;

window.puede = puede;

window.requireLogin = requireLogin;
window.requirePremium = requirePremium;
window.requireAdmin = requireAdmin;
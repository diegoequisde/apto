requireAdmin();

const API = CONFIG.API;

async function guardarOposicion() {

    const nombre =
        document.getElementById(
            'nombre'
        ).value;

    const descripcion =
        document.getElementById(
            'descripcion'
        ).value;

    const response =
await fetch(
    `${API}/oposiciones`,
    {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            Authorization: `Bearer ${getToken()}`
        },
        body:JSON.stringify({
            nome_oposicion:nombre,
            descripcion_oposicion:descripcion
        })
    }
);

const data =
await response.json();

if (!response.ok) {
      mostrarToast(data.mensaje, 'error');
    return;
}

window.location.href = '/admin/oposiciones/index.html';
}

document
    .getElementById(
        'guardarBtn'
    )
    .addEventListener(
        'click',
        guardarOposicion
    );
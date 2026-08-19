requireLogin();

const API = CONFIG.API;

async function guardarTema() {

    const nome_tema =
        document.getElementById(
            'nombreTema'
        ).value;

    const descripcion_tema =
        document.getElementById(
            'descripcionTema'
        ).value;

    const response =
        await fetch(
        `${API}/temas`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`
            },
            body: JSON.stringify({
                nome_tema,
                descripcion_tema
            })
        }
    );

    mostrarToast('Tema creado correctamente', 'success');

    const data =
        await response.json();

        if(!response.ok){
            mostrarToast(data.mensaje, 'error');
            return;
        }
        
    setTimeout(() => {
        window.location.href = './index.html';
    }, 500);

}

document
    .getElementById(
        'guardarBtn'
    )
    .addEventListener(
        'click',
        guardarTema
    );
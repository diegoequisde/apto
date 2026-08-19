requireLogin();

const API = CONFIG.API;

const params =
    new URLSearchParams(
        window.location.search
    );

const idTema =
    params.get('id');

async function cargarTema() {

    const response =
        await fetch(
            `${API}/temas/${idTema}`,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            }
        );

    if (!response.ok) {

        mostrarToast('No se ha podido cargar el tema.', 'warning');
        return;

    }

    const tema =
        await response.json();

    document.getElementById(
        'nombreTema'
    ).value =
        tema.nome_tema;

    document.getElementById(
        'descripcionTema'
    ).value =
        tema.descripcion_tema || '';

}

async function guardarCambios() {

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
            `${API}/temas/${idTema}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type':
                        'application/json',
                    Authorization:
                        `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    nome_tema,
                    descripcion_tema
                })
            }
        );

    if (!response.ok) {

        const data =
            await response.json();

        mostrarToast(data.mensaje || 'No se ha podido actualizar el tema.', 'error');
        return;

    }

    mostrarToast('Tema actualizado correctamente', 'success');

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
        guardarCambios
    );

cargarTema();
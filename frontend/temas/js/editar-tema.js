requireLogin();

const API =
    'http://localhost:3000/api';

const params =
    new URLSearchParams(
        window.location.search
    );

const idTema =
    params.get('id');

async function cargarTema() {

    const response =
        await fetch(
            `${API}/temas/${idTema}`
        );

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

    await fetch(
        `${API}/temas/${idTema}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type':
                    'application/json'
            },
            body: JSON.stringify({
                nome_tema,
                descripcion_tema
            })
        }
    );

    alert(
        'Tema actualizado'
    );

    window.location.href =
        './index.html';

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
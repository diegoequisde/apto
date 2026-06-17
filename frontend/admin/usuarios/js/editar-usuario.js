const API =
    'http://localhost:3000/api';

const params =
    new URLSearchParams(
        window.location.search
    );

const idUsuario =
    params.get('id');

async function cargarUsuario() {

    const response =
        await fetch(
            `${API}/usuarios/${idUsuario}`
        );

    const usuario =
        await response.json();

    document.getElementById(
        'nombre'
    ).value =
        usuario.nome;

    document.getElementById(
        'email'
    ).value =
        usuario.email;

}

async function guardarCambios() {

    const nome =
        document.getElementById(
            'nombre'
        ).value;

    const email =
        document.getElementById(
            'email'
        ).value;

    await fetch(
        `${API}/usuarios/${idUsuario}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type':
                    'application/json'
            },
            body: JSON.stringify({
                nome,
                email
            })
        }
    );

    alert(
        'Usuario actualizado'
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

cargarUsuario();
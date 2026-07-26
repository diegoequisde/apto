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

    document.getElementById('nombreUsuario').value = usuario.nome;
    document.getElementById('emailUsuario').value = usuario.email;
    document.getElementById('tipoUsuario').value = usuario.tipo;

}

async function guardarCambios() {

    const nome = document.getElementById('nombreUsuario').value;
    const email = document.getElementById('emailUsuario').value;
    const tipo = document.getElementById('tipoUsuario').value;

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
                email,
                tipo
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
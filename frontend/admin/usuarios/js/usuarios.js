const API =
    'http://localhost:3000/api';

const container =
    document.getElementById(
        'usuariosContainer'
    );

async function cargarUsuarios() {

    const response =
        await fetch(
            `${API}/usuarios`,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            }
        );

    const usuarios =
        await response.json();

    container.innerHTML = '';

    usuarios.forEach((usuario) => {

        container.innerHTML += `
            <div>
                <p>
                    <strong>Nombre:</strong>
                    ${usuario.nome}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${usuario.email}
                </p>

                <p>
                    <strong>Tipo:</strong>
                    ${usuario.tipo}
                </p>

                <button
                    onclick="editarUsuario(
                        ${usuario.id_usuario}
                    )"
                >
                    Editar
                </button>

                <button
                    onclick="eliminarUsuario(
                        ${usuario.id_usuario}
                    )"
                >
                    Eliminar
                </button>

                <hr>

            </div>
        `;

    });

}

function editarUsuario(id) {

    window.location.href =
        `editar.html?id=${id}`;

}

async function eliminarUsuario(id) {

    if (
        !confirm(
            '¿Eliminar usuario?'
        )
    ) {
        return;
    }

    await fetch(
        `${API}/usuarios/${id}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }
    );

    cargarUsuarios();

}

cargarUsuarios();
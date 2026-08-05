const API = CONFIG.API;

document
    .getElementById('loginForm')
    .addEventListener(
        'submit',
        async (e) => {

            e.preventDefault();

            const email = document.getElementById('email').value.trim();

            const password = document.getElementById('password').value;

            const response =
                await fetch(
                    `${API}/usuarios/login`,
                    {

                        method: 'POST',

                        headers: {
                            'Content-Type': 'application/json'
                        },

                        body: JSON.stringify({
                            email,
                            password
                        })

                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                alert(data.mensaje);
                return;

            }

            guardarSesion(
            {
                id: data.usuario.id_usuario,
                nome: data.usuario.nome,
                email: data.usuario.email,
                tipo: data.usuario.tipo
            },

            data.token

        );

        window.location.href = '/';

        });
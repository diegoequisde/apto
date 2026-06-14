const API =
    'http://localhost:3000/api';

async function guardarOposicion() {

    const nombre =
        document.getElementById(
            'nombre'
        ).value;

    const descripcion =
        document.getElementById(
            'descripcion'
        ).value;

    await fetch(
        `${API}/oposiciones`,
        {
            method: 'POST',
            headers: {
                'Content-Type':
                    'application/json'
            },
            body: JSON.stringify({
                nome_oposicion: nombre,
                descripcion_oposicion:
                    descripcion
            })
        }
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
        guardarOposicion
    );
const API =
    'http://localhost:3000/api';

async function guardarTema() {

    const nome_tema =
        document.getElementById(
            'nombreTema'
        ).value;

    const descripcion_tema =
        document.getElementById(
            'descripcionTema'
        ).value;

    await fetch(
        `${API}/temas`,
        {
            method: 'POST',
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
        'Tema creado correctamente'
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
        guardarTema
    );
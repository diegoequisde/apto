async function cargarComponente(id, ruta){

    const response = await fetch(ruta);

    document.getElementById(id).innerHTML =
        await response.text();

}

cargarComponente(
    'navbar',
    '/components/navbar.html'
);

cargarComponente(
    'footer',
    '/components/footer.html'
);
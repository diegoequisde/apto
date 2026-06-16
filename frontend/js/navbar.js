async function cargarNavbar() {

    const response =
        await fetch(
            '/componentes/navbar.html'
        );

    const html =
        await response.text();

    document
        .getElementById('navbar')
        .innerHTML = html;

}

cargarNavbar();
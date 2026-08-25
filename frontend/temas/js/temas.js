requireLogin();

const API = CONFIG.API;

const temasList = document.getElementById("temasList");

async function cargarTemas() {
  const response = await fetch(`${API}/temas`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const temas = await response.json();

  temasList.innerHTML = "";

  temas.forEach((tema) => {
    temasList.innerHTML += `
            <div>

                <p>
                    <strong>${tema.nome_tema}</strong>
                </p>

                <div class = "acciones">
                    <button class= "editar"
                        onclick="editarTema(
                            ${tema.id_tema}
                        )"
                    >
                        Editar
                    </button>

                    <button class= "eliminar"
                        onclick="eliminarTema(
                            ${tema.id_tema}
                        )"
                    >
                        Eliminar
                    </button>

                    <button
                        onclick="gestionarPreguntas(
                            ${tema.id_tema}
                        )"
                    >
                        Preguntas
                    </button>
                </div>
            <hr>

            </div>
        `;
  });
}

function gestionarPreguntas(idTema) {
  window.location.href = `/preguntas/index.html?idTema=${idTema}`;
}

function editarTema(idTema) {
  window.location.href = `./editar.html?id=${idTema}`;
}

async function eliminarTema(id) {
  if (!confirm("¿Eliminar tema?")) {
    return;
  }

  const response = await fetch(`${API}/temas/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    mostrarToast("No fue posible eliminar el tema.", "warning");
    return;
  }

  cargarTemas();
}

async function irCrearTema() {
  if (!puede("usuario")) {
    return;
  }

  if (esFree()) {
    const response = await fetch(`${API}/temas`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      mostrarToast("No se han podido comprobar tus temas.", "warning");

      return;
    }

    const temas = await response.json();

    if (temas.length >= 1) {
      mostrarToast(
        "La cuenta gratuita permite crear un único tema. Actualiza a Premium para crear más temas.",
        "warning",
      );

      return;
    }
  }

  window.location.href = "crear.html";
}

cargarTemas();

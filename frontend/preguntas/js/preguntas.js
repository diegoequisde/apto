requireLogin();

const API = CONFIG.API;

const container = document.getElementById("preguntasContainer");
const params = new URLSearchParams(window.location.search);
const idTema = params.get("idTema");

let paginaActual = 1;
const limite = 20;

async function cargarTema() {
  if (!idTema) {
    return true;
  }

  const response = await fetch(`${API}/temas/${idTema}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    if (response.status === 403) {
      mostrarToast("No tienes permiso para acceder a este tema.", "error");

      setTimeout(() => {
        window.location.href = "../temas/index.html";
      }, 1200);

      return false;
    }

    mostrarToast("No se ha podido cargar el tema.", "warning");

    return false;
  }

  const tema = await response.json();

  document.getElementById("tituloTema").textContent =
    `Preguntas · ${tema.nome_tema}`;

  return true;
}

async function cargarPreguntas() {
  let url = `${API}/preguntas?page=${paginaActual}&limit=${limite}`;

  if (idTema) {
    url += `&idTema=${idTema}`;
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await response.json();

  document.getElementById("siguienteBtn").disabled =
    paginaActual >= data.totalPages;

  document.getElementById("anteriorBtn").disabled = paginaActual === 1;

  const preguntas = data.items;

  document.getElementById("infoPaginacion").textContent = `
        Página
        ${data.page}
        de
        ${data.totalPages}
        `;

  container.innerHTML = "";

  const inicio = (paginaActual - 1) * limite + 1;

  const fin = Math.min(paginaActual * limite, data.total);

  document.getElementById("contadorPreguntas").textContent =
    `Mostrando ${inicio}-${fin} de ${data.total} preguntas`;

  preguntas.forEach((pregunta) => {
    container.innerHTML += `
            <div>
                <p>
                    ${pregunta.enunciado}
                </p>
                <div class = "acciones">
                    <button class= "editar" onclick="editarPregunta(
                            ${pregunta.id_pregunta}
                        )"
                    >
                        Editar
                    </button>
                    
                    <button class= "eliminar" onclick="eliminarPregunta(
                            ${pregunta.id_pregunta}
                        )"
                    >
                        Eliminar
                    </button>
                </div>
                <hr>
            </div>
        `;
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

async function irCrearPregunta() {
  if (!puede("usuario")) {
    return;
  }

  if (esFree()) {
    const response = await fetch(`${API}/preguntas?page=1&limit=1`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      mostrarToast("No se han podido comprobar tus preguntas.", "warning");

      return;
    }

    const data = await response.json();

    if (data.total >= 40) {
      mostrarToast(
        "La cuenta gratuita permite crear un máximo de 40 preguntas. Actualiza a PRO para crear más preguntas.",
        "warning",
      );

      return;
    }
  }

  window.location.href = "./crear.html";
}

function editarPregunta(id) {
  window.location.href = `editar.html?id=${id}`;
}

async function eliminarPregunta(id) {
  if (!confirm("¿Eliminar pregunta?")) {
    return;
  }

  const response = await fetch(`${API}/preguntas/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    mostrarToast("No fue posible eliminar la pregunta.", "warning");
    return;
  }

  cargarPreguntas();
}

// botones de paginación
document.getElementById("anteriorBtn").addEventListener("click", () => {
  if (paginaActual > 1) {
    paginaActual--;

    cargarPreguntas();
  }
});

document.getElementById("siguienteBtn").addEventListener("click", () => {
  paginaActual++;

  cargarPreguntas();
});

async function inicializar() {
  const temaValido = await cargarTema();

  if (!temaValido) {
    return;
  }

  await cargarPreguntas();
}
inicializar();

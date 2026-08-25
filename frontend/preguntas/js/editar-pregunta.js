requireLogin();

const API = CONFIG.API;

const params = new URLSearchParams(window.location.search);

const idPregunta = params.get("id");

let opcionesActuales = [];

async function inicializar() {
  const pregunta = await cargarPregunta();

  if (!pregunta) {
    return;
  }

  idTemaInicial = pregunta.id_tema;

  document.getElementById("enunciado").value = pregunta.enunciado;

  document.getElementById("idTema").value = pregunta.id_tema;

  await cargarTemas();

  await cargarOpciones();
}

async function cargarPregunta() {
  const response = await fetch(`${API}/preguntas/${idPregunta}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    if (response.status === 403) {
      mostrarToast("No tienes permiso para acceder a esta pregunta.", "error");

      setTimeout(() => {
        window.location.href = "./index.html";
      }, 1500);

      return null;
    }

    mostrarToast("No se ha podido cargar la pregunta.", "warning");

    return null;
  }

  return await response.json();
}

async function cargarTemas() {
  const response = await fetch(`${API}/temas`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const temas = await response.json();

  const select = document.getElementById("idTema");

  select.innerHTML = "";

  /*
    // Si se quisiera ordenar alfabéticamente

    temas.sort((a, b) =>
                a.nome_tema.localeCompare(
                b.nome_tema
            )
        );
*/

  temas.forEach((tema) => {
    select.innerHTML += `
            <option
                value="${tema.id_tema}"
            >
                ${tema.nome_tema}
            </option>
        `;
  });
}

async function cargarOpciones() {
  const response = await fetch(`${API}/preguntas/${idPregunta}/opciones`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  opcionesActuales = await response.json();

  pintarOpciones();
}

function pintarOpciones() {
  const container = document.getElementById("opcionesContainer");

  container.innerHTML = "";

  opcionesActuales.forEach((opcion) => {
    container.innerHTML += `
                <div>

                    <h3>
                       Opción ${opcion.letra_opcion}
                    </h3>

                    <input
                        type="text"
                        id="texto-${opcion.letra_opcion}"
                        value="${opcion.texto}"
                        aria-label="Texto de la opción ${opcion.letra_opcion}"
                    >

                    <input
                        type="radio"
                        name="correcta"
                        value="${opcion.letra_opcion}"
                        ${opcion.e_correcta ? "checked" : ""}
                        aria-label="Marcar opción ${opcion.letra_opcion} como correcta"
                    >

                    Correcta

                </div>

                <br>
            `;
  });
}

async function guardarCambios() {
  const enunciado = document.getElementById("enunciado").value;

  const idTema = document.getElementById("idTema").value;

  const response = await fetch(`${API}/preguntas/${idPregunta}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      enunciado,
      id_tema: idTema,
    }),
  });

  if (!response.ok) {
    mostrarToast("Error al actualizar la pregunta.", "error");
    return;
  }

  const correcta = document.querySelector(
    'input[name="correcta"]:checked',
  ).value;

  for (const opcion of opcionesActuales) {
    const letra = opcion.letra_opcion;

    const texto = document.getElementById(`texto-${letra}`).value;

    const response = await fetch(
      `${API}/preguntas/${idPregunta}/opciones/${letra}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          texto,
          e_correcta: letra === correcta,
        }),
      },
    );

    if (!response.ok) {
      mostrarToast("Error al actualizar una opción.", "error");
      return;
    }
  }

  mostrarToast("Pregunta actualizada correctamente", "success");

  setTimeout(() => {
    window.location.href = `./index.html?idTema=${idTemaInicial}`;
  }, 1500);
}

document.getElementById("guardarBtn").addEventListener("click", guardarCambios);

inicializar();

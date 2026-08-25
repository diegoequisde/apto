requireAdmin();

const API = CONFIG.API;

const params = new URLSearchParams(window.location.search);

const idUsuario = params.get("id");

async function cargarUsuario() {
  const response = await fetch(`${API}/usuarios/${idUsuario}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const usuario = await response.json();

  document.getElementById("nombreUsuario").value = usuario.nome;
  document.getElementById("emailUsuario").value = usuario.email;
  document.getElementById("tipoUsuario").value = usuario.tipo;
}

async function guardarCambios() {
  const nome = document.getElementById("nombreUsuario").value;
  const email = document.getElementById("emailUsuario").value;
  const tipo = document.getElementById("tipoUsuario").value;

  await fetch(`${API}/usuarios/${idUsuario}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      nome,
      email,
      tipo,
    }),
  });

  mostrarToast("Usuario actualizado", "success");

  setTimeout(() => {
    window.location.href = "./index.html";
  }, 1500);
}

document.getElementById("guardarBtn").addEventListener("click", guardarCambios);

cargarUsuario();

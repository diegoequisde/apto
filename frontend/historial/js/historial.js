requireLogin();

const API = CONFIG.API;

async function cargarHistorial() {
  const response = await fetch(`${API}/tests/historial`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const tests = await response.json();

  const tabla = document.getElementById("historial");

  tests.forEach((test) => {
    tabla.innerHTML += `
            <tr>
                <td>${formatearFecha(test.data_realizacion)}</td>
                <td>
                    ${
                      test.resultado != null
                        ? `<span class="${claseResultado(test.resultado)}">
                                ${Math.round(test.resultado)}%
                            </span>`
                        : "-"
                    }
                </td>
                <td>
                    <a href="/generar-test/revision.html?idTest=${test.id_test}" role="button">Revisar</a>
                </td>
            </tr>
        `;
  });
}

function claseResultado(resultado) {
  if (resultado < 50) return "resultado-bajo";
  if (resultado <= 80) return "resultado-medio";
  return "resultado-alto";
}

function formatearFecha(fecha) {
  const date = new Date(fecha);

  const dia = date.getDate();
  const mes = date.getMonth() + 1;
  const ano = String(date.getFullYear()).slice(-2);

  return `${dia}/${mes}/${ano}`;
}

cargarHistorial();

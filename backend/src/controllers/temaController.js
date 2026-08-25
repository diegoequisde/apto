const asyncHandler = require("../middlewares/asyncHandler");

const {
  findAllTemas,
  findTemaById,
  insertTema,
  updateTemaById,
  deleteTemaById,
  contarTemasUsuario,
} = require("../services/temaService");

const getTemas = asyncHandler(async (req, res) => {
  const temas = await findAllTemas(req.usuario);

  res.json(temas);
});

const getTemaById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tema = await findTemaById(id, req.usuario);

  if (!tema) {
    return res.status(404).json({
      ok: false,
      mensaje: "Tema no encontrado",
    });
  }

  res.json(tema);
});

const createTema = asyncHandler(async (req, res) => {
  const { nome_tema, descripcion_tema } = req.body;

  if (req.usuario.tipo === "free") {
    const total = await contarTemasUsuario(req.usuario.id);

    if (total >= 1) {
      return res.status(403).json({
        mensaje:
          "La cuenta gratuíta permite crear un único tema. Actualiza a PRO para crear más temas.",
      });
    }
  }
  const id_tema = await insertTema(nome_tema, descripcion_tema, req.usuario.id);

  res.status(201).json({
    ok: true,
    mensaje: "Tema creado correctamente",
    id_tema,
  });
});

const updateTema = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { nome_tema, descripcion_tema } = req.body;

  const result = await updateTemaById(
    id,
    nome_tema,
    descripcion_tema,
    req.usuario,
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({
      ok: false,
      mensaje: "Tema no encontrado",
    });
  }

  res.json({
    ok: true,
    mensaje: "Tema actualizado correctamente",
  });
});

const deleteTema = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await deleteTemaById(id, req.usuario);

  if (result.affectedRows === 0) {
    return res.status(404).json({
      ok: false,
      mensaje: "Tema no encontrado",
    });
  }

  res.json({
    ok: true,
    mensaje: "Tema eliminado correctamente",
  });
});

module.exports = {
  getTemas,
  getTemaById,
  createTema,
  updateTema,
  deleteTema,
};

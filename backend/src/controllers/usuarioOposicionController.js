const asyncHandler = require("../middlewares/asyncHandler");

const {
  findOposicionesByUsuario,
  insertOposicionToUsuario,
  deleteOposicionFromUsuarioById,
} = require("../services/usuarioOposicionService");

const getOposicionesByUsuario = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const oposiciones = await findOposicionesByUsuario(id);

  res.json(oposiciones);
});

const addOposicionToUsuario = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { id_oposicion } = req.body;

  await insertOposicionToUsuario(id, id_oposicion);

  res.status(201).json({
    ok: true,
    mensaje: "Oposición añadida al usuario",
  });
});

const deleteOposicionFromUsuario = asyncHandler(async (req, res) => {
  const { id, idOposicion } = req.params;

  const result = await deleteOposicionFromUsuarioById(id, idOposicion);

  if (result.affectedRows === 0) {
    return res.status(404).json({
      ok: false,
      mensaje: "Relación no encontrada",
    });
  }

  res.json({
    ok: true,
    mensaje: "Oposición eliminada del usuario",
  });
});

module.exports = {
  getOposicionesByUsuario,
  addOposicionToUsuario,
  deleteOposicionFromUsuario,
};

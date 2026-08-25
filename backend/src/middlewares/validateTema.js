const validateTema = (req, res, next) => {
  const { nome_tema, descripcion_tema } = req.body;

  if (!nome_tema || nome_tema.trim() === "") {
    return res.status(400).json({
      ok: false,
      mensaje: "El nombre del tema es obligatorio",
    });
  }

  if (nome_tema.length > 150) {
    return res.status(400).json({
      ok: false,
      mensaje: "El nombre del tema es demasiado largo",
    });
  }

  if (descripcion_tema && descripcion_tema.length > 1000) {
    return res.status(400).json({
      ok: false,
      mensaje: "La descripción es demasiado larga",
    });
  }

  next();
};

module.exports = validateTema;

const validatePregunta = (req, res, next) => {
  const { enunciado } = req.body;

  if (!enunciado || enunciado.trim() === "") {
    return res.status(400).json({
      ok: false,
      mensaje: "El enunciado es obligatorio",
    });
  }

  if (enunciado.length > 2000) {
    return res.status(400).json({
      ok: false,
      mensaje: "El enunciado es demasiado largo",
    });
  }

  next();
};

module.exports = validatePregunta;

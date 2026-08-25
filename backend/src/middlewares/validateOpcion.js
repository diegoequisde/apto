const validateOpcion = (req, res, next) => {
  const { letra_opcion, texto, e_correcta } = req.body;

  const letrasValidas = ["A", "B", "C", "D"];

  if (letra_opcion && !letrasValidas.includes(letra_opcion)) {
    return res.status(400).json({
      ok: false,
      mensaje: "Letra de opción inválida",
    });
  }

  if (!texto || texto.trim() === "") {
    return res.status(400).json({
      ok: false,
      mensaje: "El texto de la opción es obligatorio",
    });
  }

  if (e_correcta !== undefined && typeof e_correcta !== "boolean") {
    return res.status(400).json({
      ok: false,
      mensaje: "e_correcta debe ser boolean",
    });
  }

  next();
};

module.exports = validateOpcion;

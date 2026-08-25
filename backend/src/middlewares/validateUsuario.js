const validateUsuario = (req, res, next) => {
  const { nome, email, tipo, password } = req.body;

  if (!nome || nome.trim() === "") {
    return res.status(400).json({
      ok: false,
      mensaje: "El nombre es obligatorio",
    });
  }

  if (nome.length > 100) {
    return res.status(400).json({
      ok: false,
      mensaje: "El nombre es demasiado largo",
    });
  }

  if (password && password.length < 6) {
    return res.status(400).json({
      ok: false,
      mensaje: "La contraseña debe tener mínimo 6 caracteres",
    });
  }

  if (tipo && !["free", "premium", "admin"].includes(tipo)) {
    return res.status(400).json({
      ok: false,
      mensaje: "Tipo de usuario no válido",
    });
  }

  next();
};

module.exports = validateUsuario;

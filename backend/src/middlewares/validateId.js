const validateId = (req, res, next) => {
  const { id } = req.params;

  if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
    return res.status(400).json({
      ok: false,
      mensaje: "ID inválida",
    });
  }

  next();
};

module.exports = validateId;

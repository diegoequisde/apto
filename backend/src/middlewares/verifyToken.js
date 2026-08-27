const { jwt, JWT_SECRET } = require("../config/jwt");

function verifyToken(req, res, next) {
  // Obtén o token enviado polo cliente
  const authHeader = req.headers.authorization;

  // Comproba que existe e utiliza o formato Bearer
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      ok: false,
      mensaje: "Token requerido",
    });
  }

  // Extrae o token da cabeceira Authorization
  const token = authHeader.split(" ")[1];

  try {
    // Valida o token coa clave secreta
    const payload = jwt.verify(token, JWT_SECRET);

    //  Garda a identidade do usuario na petición
    //  para que os seguintes middlewares/controladores poidan utilizala
    req.usuario = payload;

    // O token é válido: continúa coa petición
    next();
  } catch (error) {
    // Token inválido ou caducado: rexeita a petición
    return res.status(401).json({
      ok: false,
      mensaje: "Token inválido",
    });
  }
}

module.exports = verifyToken;

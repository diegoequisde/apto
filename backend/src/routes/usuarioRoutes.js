const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");
const validateId = require("../middlewares/validateId");
const validateRequiredFields = require("../middlewares/validateRequiredFields");
const validateEmail = require("../middlewares/validateEmail");
const validateUsuario = require("../middlewares/validateUsuario");

const usuarioOposicionRoutes = require("./usuarioOposicionRoutes");

const {
  getUsuarios,
  getUsuarioById,
  login,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} = require("../controllers/usuarioController");

router.get("/", verifyToken, getUsuarios);

router.post("/login", login);

router.post(
  "/",
  validateRequiredFields(["nome", "email", "password"]),
  validateEmail,
  validateUsuario,
  createUsuario,
);

router.get("/:id", verifyToken, validateId, getUsuarioById);

router.put(
  "/:id",
  verifyToken,
  validateId,
  validateRequiredFields(["nome", "email"]),
  validateEmail,
  validateUsuario,
  updateUsuario,
);

router.delete("/:id", verifyToken, validateId, deleteUsuario);

router.use("/:id/oposiciones", verifyToken, usuarioOposicionRoutes);

module.exports = router;

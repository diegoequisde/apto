const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");
const validateId = require("../middlewares/validateId");
const validateRequiredFields = require("../middlewares/validateRequiredFields");
const validatePregunta = require("../middlewares/validatePregunta");

const opcionRoutes = require("./opcionRoutes");

const {
  getPreguntas,
  getPreguntaById,
  createPregunta,
  updatePregunta,
  deletePregunta,
} = require("../controllers/preguntaController");

router.get("/", verifyToken, getPreguntas);

router.get("/:id", verifyToken, validateId, getPreguntaById);

router.post(
  "/",
  verifyToken,
  validateRequiredFields(["enunciado", "id_tema"]),
  validatePregunta,
  createPregunta,
);

router.put(
  "/:id",
  verifyToken,
  validateId,
  validateRequiredFields(["enunciado", "id_tema"]),
  validatePregunta,
  updatePregunta,
);

router.delete("/:id", verifyToken, validateId, deletePregunta);

router.use("/:id/opciones", opcionRoutes);

module.exports = router;

const express = require("express");

const validateRequiredFields = require("../middlewares/validateRequiredFields");

const router = express.Router({ mergeParams: true });

const {
  getPreguntasByTest,
  addPreguntaToTest,
  answerPreguntaTest,
  deletePreguntaFromTest,
} = require("../controllers/preguntaTestController");

router.get("/", getPreguntasByTest);

router.post(
  "/",
  validateRequiredFields(["id_pregunta", "orde"]),
  addPreguntaToTest,
);

router.put(
  "/:idPregunta/resposta",
  validateRequiredFields(["resposta_usuario"]),
  answerPreguntaTest,
);

router.delete("/:idPregunta", deletePreguntaFromTest);

module.exports = router;

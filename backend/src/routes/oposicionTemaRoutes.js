const express = require("express");

const validateRequiredFields = require("../middlewares/validateRequiredFields");

const router = express.Router({ mergeParams: true });

const {
  getTemasByOposicion,
  addTemaToOposicion,
  deleteTemaFromOposicion,
} = require("../controllers/oposicionTemaController");

router.get("/", getTemasByOposicion);

router.post("/", validateRequiredFields(["id_tema"]), addTemaToOposicion);

router.delete("/:idTema", deleteTemaFromOposicion);

module.exports = router;

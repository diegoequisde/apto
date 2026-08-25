const express = require("express");

const validateRequiredFields = require("../middlewares/validateRequiredFields");

const router = express.Router({ mergeParams: true });

const {
  getOposicionesByUsuario,
  addOposicionToUsuario,
  deleteOposicionFromUsuario,
} = require("../controllers/usuarioOposicionController");

router.get("/", getOposicionesByUsuario);

router.post(
  "/",
  validateRequiredFields(["id_oposicion"]),
  addOposicionToUsuario,
);

router.delete("/:idOposicion", deleteOposicionFromUsuario);

module.exports = router;

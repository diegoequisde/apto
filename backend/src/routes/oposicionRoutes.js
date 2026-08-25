const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");
const validateId = require("../middlewares/validateId");
const validateRequiredFields = require("../middlewares/validateRequiredFields");
const validateOposicion = require("../middlewares/validateOposicion");
const oposicionTemaRoutes = require("./oposicionTemaRoutes");

const {
  getOposiciones,
  getOposicionById,
  createOposicion,
  updateOposicion,
  deleteOposicion,
} = require("../controllers/oposicionController");

router.get("/", getOposiciones);

router.get("/:id", getOposicionById);

router.post(
  "/",
  verifyToken,
  validateRequiredFields(["nome_oposicion"]),
  validateOposicion,
  createOposicion,
);

router.put(
  "/:id",
  verifyToken,
  validateId,
  validateRequiredFields(["nome_oposicion"]),
  validateOposicion,
  updateOposicion,
);

router.delete("/:id", verifyToken, validateId, deleteOposicion);

router.use("/:id/temas", verifyToken, oposicionTemaRoutes);

module.exports = router;

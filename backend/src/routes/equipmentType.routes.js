const express = require("express");
const {
  crearTipoEquipo,
  consultarTipoEquipo,
  actualizarTipoEquipo,
  eliminarTipoEquipo,
} = require("../controllers/equipmentType.controller.js");

const router = express.Router();

// Rutas para la gestión de tipos de equipos

router.post("/tiposEquipos", crearTipoEquipo);
router.get("/tiposEquipos", consultarTipoEquipo);
router.put("/tiposEquipos/:id", actualizarTipoEquipo);
router.delete("/tiposEquipos/:id", eliminarTipoEquipo);


module.exports = router;

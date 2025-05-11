const express = require("express");
const {
  crearTipoEquipo,
  consultarTipoEquipo,
  consultarUnTipoEquipo,
  actualizarTipoEquipo,
  eliminarTipoEquipo,
} = require("../controllers/equipmentType.controller.js");

const router = express.Router();

// Rutas para la gestión de tipos de equipos

// Crear un nuevo tipo de equipo
router.post("/tiposEquipos", crearTipoEquipo);

// Consultar todos los tipos de equipos
router.get("/tiposEquipos", consultarTipoEquipo);

// Actualizar un tipo de equipo específico por ID
router.put("/tiposEquipos/:id", actualizarTipoEquipo);

// Eliminar un tipo de equipo específico por ID
router.delete("/tiposEquipos/:id", eliminarTipoEquipo);

module.exports = router;

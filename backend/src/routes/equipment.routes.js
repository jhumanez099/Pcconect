const express = require("express");
const {
  crearEquipo,
  consultarEquipo,
  consultarUnEquipo,
  actualizarEquipo,
  eliminarEquipo,
} = require("../controllers/equipment.controller.js");

const router = express.Router();

// Rutas para la gestión de equipos

// Crear un nuevo equipo
router.post("/equipos", crearEquipo);

// Consultar todos los equipos
router.get("/equipos", consultarEquipo);

// Actualizar un equipo específico por ID
router.put("/equipos/:id", actualizarEquipo);

// Eliminar un equipo específico por ID
router.delete("/equipos/:id", eliminarEquipo);

module.exports = router;

const express = require("express");
const {
  crearTipoUsuario,
  consultarTiposUsuario,
  actualizarTipoUsuario,
  eliminarTipoUsuario,
} = require("../controllers/userType.controller.js");

const router = express.Router();

// Define la ruta para crear un tipo de usuario
router.post("/tiposUsuarios", crearTipoUsuario);

// Define la ruta para consultar todos los tipos de usuario
router.get("/tiposUsuarios", consultarTiposUsuario);

// Define la ruta para actualizar un tipo de usuario
router.put("/tiposUsuarios/:id", actualizarTipoUsuario);

// Define la ruta para eliminar un tipo de usuario
router.delete("/tiposUsuarios/:id", eliminarTipoUsuario);

module.exports = router;

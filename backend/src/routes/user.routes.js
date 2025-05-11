const express = require("express");
const {
  crearUsuario,
  consultarUnUsuario,
  consultarUsuarios,
  actualizarUsuario,
  eliminarUsuario,
} = require("../controllers/user.controller.js");

const router = express.Router();

// Define la ruta para crear un usuario
router.post("/usuarios", crearUsuario);

// Define la ruta para consultar todos los usuarios
router.get("/usuarios", consultarUsuarios);

// Define la ruta para actualizar un usuario
router.put("/usuarios/:id", actualizarUsuario);

// Define la ruta para eliminar un usuario
router.delete("/usuarios/:id", eliminarUsuario);

module.exports = router;

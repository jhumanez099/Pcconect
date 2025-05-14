const express = require("express");
const {
  crearUsuario,
  consultarUsuarios,
  actualizarUsuario,
  eliminarUsuario,
} = require("../controllers/user.controller.js");

const router = express.Router();

router
  .route("/usuarios")
  .post(crearUsuario)
  .get(consultarUsuarios);

router
  .route("/usuarios/:id")
  .put(actualizarUsuario)
  .delete(eliminarUsuario);

module.exports = router;

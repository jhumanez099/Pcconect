const express = require("express");
const {
  crearTipoUsuario,
  consultarTiposUsuario,
  actualizarTipoUsuario,
  eliminarTipoUsuario,
} = require("../controllers/userType.controller.js");

const router = express.Router();

router
  .route("/tiposUsuarios")
  .post(crearTipoUsuario)
  .get(consultarTiposUsuario);

router
  .route("/tiposUsuarios/:id")
  .put(actualizarTipoUsuario)
  .delete(eliminarTipoUsuario);

module.exports = router;

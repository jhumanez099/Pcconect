const express = require("express");
const {
  crearTipoEquipo,
  consultarTipoEquipo,
  actualizarTipoEquipo,
  eliminarTipoEquipo,
} = require("../controllers/equipmentType.controller.js");

const router = express.Router();

router
  .route("/tiposEquipos")
  .post(crearTipoEquipo)
  .get(consultarTipoEquipo);

router
  .route("/tiposEquipos/:id")
  .put(actualizarTipoEquipo)
  .delete(eliminarTipoEquipo);

module.exports = router;

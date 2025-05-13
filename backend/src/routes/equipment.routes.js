const express = require("express");
const {
  crearEquipo,
  consultarEquipo,
  actualizarEquipo,
  eliminarEquipo,
} = require("../controllers/equipment.controller.js");

const router = express.Router();

router.route("/equipos").post(crearEquipo).get(consultarEquipo);

router.route("/equipos/:id").put(actualizarEquipo).delete(eliminarEquipo);

module.exports = router;

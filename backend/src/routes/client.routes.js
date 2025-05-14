const express = require("express");
const {
  crearCliente,
  consultarClientes,
  actualizarCliente,
  eliminarCliente,
} = require("../controllers/client.controller.js");

const router = express.Router();

router
  .route("/clientes")
  .post(crearCliente)
  .get(consultarClientes);

router
  .route("/clientes/:id")
  .put(actualizarCliente)
  .delete(eliminarCliente);

module.exports = router;

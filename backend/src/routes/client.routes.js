const express = require("express");
const {
  crearClientes,
  consultarClientes,
  actualizarCliente,
  eliminarCliente,
} = require("../controllers/client.controller.js");

const router = express.Router();

// Rutas para la gestión de clientes

// Crear un nuevo cliente
router.post("/clientes", crearClientes);

// Consultar todos los clientes
router.get("/clientes", consultarClientes);

// Actualizar un cliente específico por ID
router.put("/clientes/:id", actualizarCliente);

// Eliminar un cliente específico por ID
router.delete("/clientes/:id", eliminarCliente);

module.exports = router;

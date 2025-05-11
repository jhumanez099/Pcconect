const express = require("express");
const {
  crearPedidos,
  consultarPedidos,
  consultarUnPedido,
  actualizarPedido,
  eliminarPedido,
} = require("../controllers/order.controller.js");

const router = express.Router();

// Define la ruta para crear un pedido
router.post("/pedidos", crearPedidos);

// Define la ruta para consultar todos los pedidos
router.get("/pedidos", consultarPedidos);

// Define la ruta para actualizar un pedido
router.put("/pedidos/:id", actualizarPedido);

// Define la ruta para eliminar un pedido
router.delete("/pedidos/:id", eliminarPedido);

module.exports = router;

const express = require("express");
const {
  crear_pedido,
  consultar_pedidos,
  actualizar_pedido,
  eliminar_pedido,
} = require("../controllers/order.controller.js");

const router = express.Router();

// Define la ruta para crear un pedido
router.post("/pedidos", crear_pedido);

// Define la ruta para consultar todos los pedidos
router.get("/pedidos", consultar_pedidos);

// Define la ruta para actualizar un pedido
router.put("/pedidos/:id", actualizar_pedido);

// Define la ruta para eliminar un pedido
router.delete("/pedidos/:id", eliminar_pedido);

module.exports = router;

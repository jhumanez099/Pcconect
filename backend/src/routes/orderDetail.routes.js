const express = require("express");
const {
  crear_detalle_pedido,
  consultar_detalles_pedido,
  actualizar_detalle_pedido,
  eliminar_detalle_pedido,
} = require("../controllers/orderDetail.controller.js");

const router = express.Router();

// Define la ruta para crear un detalle del pedido
router.post("/detalles", crear_detalle_pedido);

// Define la ruta para consultar todos los detalles de los pedidos
router.get("/detalles", consultar_detalles_pedido);

// Define la ruta para actualizar un detalle del pedido
router.put("/detalles/:id", actualizar_detalle_pedido);

// Define la ruta para eliminar un detalle del pedido
router.delete("/detalles/:id", eliminar_detalle_pedido);

module.exports = router;

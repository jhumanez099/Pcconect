const express = require("express");
const {
  crearDetallePedido,
  consultarDetallesPedidos,
  consultarUnDetallePedido,
  actualizarDetallePedido,
  eliminarDetallePedido,
} = require("../controllers/orderDetail.controller.js");

const router = express.Router();

// Define la ruta para crear un detalle del pedido
router.post("/detalles", crearDetallePedido);

// Define la ruta para consultar todos los detalles de los pedidos
router.get("/detalles", consultarDetallesPedidos);

// Define la ruta para actualizar un detalle del pedido
router.put("/detalles/:id", actualizarDetallePedido);

// Define la ruta para eliminar un detalle del pedido
router.delete("/detalles/:id", eliminarDetallePedido);

module.exports = router;

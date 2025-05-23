const express = require("express");
const {
  crear_pedido,
  consultar_pedidos,
  actualizar_pedido,
  eliminar_pedido,
  obtener_detalle_pedido,
} = require("../controllers/order.controller.js");

const router = express.Router();

// Define la ruta para crear un pedido
router
  .route("/pedidos")
  .post(crear_pedido)
  .get(consultar_pedidos);

  router
  .route("/pedidos/:id")
  .put(actualizar_pedido)
  .delete( eliminar_pedido);

  router
  .route("/pedidos/:id/detalle")
  .get(obtener_detalle_pedido)

module.exports = router;

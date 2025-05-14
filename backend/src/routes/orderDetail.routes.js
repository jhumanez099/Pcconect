const express = require("express");
const {
  crear_detalle_pedido,
  consultar_detalles_pedido,
  actualizar_detalle_pedido,
  eliminar_detalle_pedido,
} = require("../controllers/orderDetail.controller.js");

const router = express.Router();

router
  .route("/detalles")
  .post(crear_detalle_pedido)
  .get(consultar_detalles_pedido);

router
  .route("/detalles/:id")
  .put(actualizar_detalle_pedido)
  .delete(eliminar_detalle_pedido);

module.exports = router;

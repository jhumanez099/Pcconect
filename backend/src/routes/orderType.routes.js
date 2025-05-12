const express = require("express");
const {
  crearTipoPedido,
  consultarTipoPedido,
  actualizarTipoPedido,
  eliminarTipoPedido,
} = require("../controllers/orderType.controller.js");

const router = express.Router();

router.route("/tiposPedidos").post(crearTipoPedido).get(consultarTipoPedido);

router
  .route("/tiposPedidos/:id")
  .put(actualizarTipoPedido)
  .delete(eliminarTipoPedido);

module.exports = router;

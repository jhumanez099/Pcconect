const express = require("express");
const {
  crearTipoPedido,
  consultarTipoPedido,
  consultarUnTipoPedido,
  actualizarTipoPedido,
  eliminarTipoPedido,
} = require("../controllers/orderType.controller.js");

const router = express.Router();

// Define la ruta para crear un tipo de pedido
router.post("/tiposPedidos", crearTipoPedido);

// Define la ruta para consultar todos los tipos de pedidos
router.get("/tiposPedidos", consultarTipoPedido);

// Define la ruta para actualizar un tipo de pedido
router.put("/tiposPedidos/:id", actualizarTipoPedido);

// Define la ruta para eliminar un tipo de pedido
router.delete("/tiposPedidos/:id", eliminarTipoPedido);

module.exports = router;

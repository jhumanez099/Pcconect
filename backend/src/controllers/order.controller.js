const Pedido = require("../models/Order.js");

const ERROR_MESSAGES = {
  REQUIRED_FIELDS: "Todos los campos son obligatorios.",
  ORDER_NOT_FOUND: "Pedido no encontrado.",
  CREATION_ERROR: "Error al crear el pedido.",
  RETRIEVAL_ERROR: "Error al consultar el pedido.",
  UPDATE_ERROR: "Error al actualizar el pedido.",
  DELETE_ERROR: "Error al eliminar el pedido.",
};

const handleError = (res, status, message, error = null) => {
  console.error(message, error);
  res.status(status).json({ message, error: error?.message });
};

const validateFields = (fields) => {
  return Object.values(fields).every(
    (field) => field !== undefined && field !== null && field !== ""
  );
};

const crearPedidos = async (req, res) => {
  const fields = {
    fechaPedido: req.body.fechaPedido,
    fechaInicioPedido: req.body.fechaInicioPedido,
    fechaFinPedido: req.body.fechaFinPedido,
    precioTotalPedido: req.body.precioTotalPedido,
    estadoPedido: req.body.estadoPedido,
    cliente: req.body.cliente,
    usuario: req.body.usuario,
    tipoPedido: req.body.tipoPedido,
    motivoPedido: req.body.motivoPedido,
  };

  if (!validateFields(fields)) {
    return res.status(400).json({ message: ERROR_MESSAGES.REQUIRED_FIELDS });
  }

  try {
    const pedidoNuevo = await Pedido.crear(fields);
    res.status(201).json({
      message: "El pedido se creó con éxito",
      pedidoId: pedidoNuevo.insertId,
    });
  } catch (error) {
    handleError(res, 500, ERROR_MESSAGES.CREATION_ERROR, error);
  }
};

const consultarPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.obtenerTodos();
    res.status(200).json(pedidos);
  } catch (error) {
    handleError(res, 500, ERROR_MESSAGES.RETRIEVAL_ERROR, error);
  }
};

const actualizarPedido = async (req, res) => {
  const idPedido = req.params.id;
  const fields = {
    fechaPedido: req.body.fechaPedido,
    fechaInicioPedido: req.body.fechaInicioPedido,
    fechaFinPedido: req.body.fechaFinPedido,
    precioTotalPedido: req.body.precioTotalPedido,
    estadoPedido: req.body.estadoPedido,
    cliente: req.body.cliente,
    usuario: req.body.usuario,
    tipoPedido: req.body.tipoPedido,
    motivoPedido: req.body.motivoPedido,
  };

  try {
    // Obtener el pedido actual desde la base de datos
    const pedidoExistente = await Pedido.obtenerPorId(idPedido);

    // Si no existe el pedido, retornar error
    if (!pedidoExistente || pedidoExistente.length === 0) {
      return res
        .status(404)
        .json({ message: ERROR_MESSAGES.ORDER_NOT_FOUND });
    }

    // Filtrar solo los campos modificados
    const camposModificados = {};
    Object.keys(fields).forEach((key) => {
      if (fields[key] !== pedidoExistente[0][key]) {
        camposModificados[key] = fields[key];
      }
    });

    // Si no hay campos modificados, retornar mensaje de sin cambios
    if (Object.keys(camposModificados).length === 0) {
      return res
        .status(200)
        .json({ message: "No se realizaron cambios en el pedido." });
    }

    // Actualizar solo los campos modificados
    const pedidoActualizado = await Pedido.actualizar(
      idPedido,
      camposModificados
    );

    if (pedidoActualizado.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: ERROR_MESSAGES.ORDER_NOT_FOUND });
    }

    res.status(200).json({ message: "Pedido actualizado con éxito." });
  } catch (error) {
    handleError(res, 500, ERROR_MESSAGES.UPDATE_ERROR, error);
  }
};

const eliminarPedido = async (req, res) => {
  const idPedido = req.params.id;

  if (!idPedido) {
    return res.status(400).json({ message: "El ID del pedido es requerido." });
  }

  try {
    const pedidoEliminado = await Pedido.eliminar(idPedido);

    if (pedidoEliminado.affectedRows === 0) {
      return res.status(404).json({ message: ERROR_MESSAGES.ORDER_NOT_FOUND });
    }

    res.status(200).json({ message: "Pedido eliminado con éxito." });
  } catch (error) {
    handleError(res, 500, ERROR_MESSAGES.DELETE_ERROR, error);
  }
};

module.exports = {
  crearPedidos,
  consultarPedidos,
  actualizarPedido,
  eliminarPedido,
};

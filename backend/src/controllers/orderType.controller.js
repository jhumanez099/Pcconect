const TipoPedido = require("../models/OrderType.js");

const ERROR_MESSAGES = {
  REQUIRED_FIELDS: "El nombre del tipo de pedido es requerido.",
  ORDER_TYPE_NOT_FOUND: "Tipo de pedido no encontrado.",
  ORDER_TYPE_ALREADY_EXISTS: "El nombre del tipo de pedido ya existe.",
  CREATION_ERROR: "Error al crear el tipo de pedido.",
  RETRIEVAL_ERROR: "Error al consultar el tipo de pedido.",
  UPDATE_ERROR: "Error al actualizar el tipo de pedido.",
  DELETE_ERROR: "Error al eliminar el tipo de pedido.",
};

const handleError = (res, status, message, error = null) => {
  console.error(message, error);
  return res.status(status).json({ message });
};

const crearTipoPedido = async (req, res) => {
  const { nombre_tipo_pedido } = req.body;

  if (!nombre_tipo_pedido?.trim()) {
    return handleError(res, 400, ERROR_MESSAGES.REQUIRED_FIELDS);
  }

  try {
    const result = await TipoPedido.crear(nombre_tipo_pedido);
    res.status(201).json({
      message: "Tipo de pedido creado con éxito",
      tipoPedidoId: result.insertId,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return handleError(
        res,
        400,
        ERROR_MESSAGES.ORDER_TYPE_ALREADY_EXISTS,
        error
      );
    }
    return handleError(res, 500, ERROR_MESSAGES.CREATION_ERROR, error);
  }
};

const consultarTipoPedido = async (_req, res) => {
  try {
    const tipos = await TipoPedido.obtenerTodos();
    res.status(200).json(tipos);
  } catch (error) {
    return handleError(res, 500, ERROR_MESSAGES.RETRIEVAL_ERROR, error);
  }
};

const actualizarTipoPedido = async (req, res) => {
  const id = req.params.id;
  const { nombre_tipo_pedido } = req.body;

  try {
    const existente = await TipoPedido.obtenerPorId(id);
    if (!existente || existente.length === 0) {
      return handleError(res, 404, ERROR_MESSAGES.ORDER_TYPE_NOT_FOUND);
    }

    const cambios = {};
    if (nombre_tipo_pedido !== existente[0].nombre_tipo_pedido) {
      cambios.nombre_tipo_pedido = nombre_tipo_pedido;
    }

    if (Object.keys(cambios).length === 0) {
      return res.status(200).json({ message: "No se realizaron cambios." });
    }

    const resultado = await TipoPedido.actualizar(id, cambios);
    if (resultado.affectedRows === 0) {
      return handleError(res, 404, ERROR_MESSAGES.ORDER_TYPE_NOT_FOUND);
    }

    res.status(200).json({ message: "Tipo de pedido actualizado con éxito." });
  } catch (error) {
    return handleError(res, 500, ERROR_MESSAGES.UPDATE_ERROR, error);
  }
};

const eliminarTipoPedido = async (req, res) => {
  const id = req.params.id;

  try {
    const resultado = await TipoPedido.eliminar(id);
    if (resultado.affectedRows === 0) {
      return handleError(res, 404, ERROR_MESSAGES.ORDER_TYPE_NOT_FOUND);
    }

    res.status(200).json({ message: "Tipo de pedido eliminado con éxito." });
  } catch (error) {
    return handleError(res, 500, ERROR_MESSAGES.DELETE_ERROR, error);
  }
};

module.exports = {
  crearTipoPedido,
  consultarTipoPedido,
  actualizarTipoPedido,
  eliminarTipoPedido,
};

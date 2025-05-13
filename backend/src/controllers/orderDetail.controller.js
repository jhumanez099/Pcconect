const DetallePedido = require("../models/OrderDetail.js");

const ERROR_MESSAGES = {
  REQUIRED_FIELDS: "Todos los campos son obligatorios.",
  ORDER_DETAIL_NOT_FOUND: "Detalle del pedido no encontrado.",
  CREATION_ERROR: "Error al crear el detalle del pedido.",
  RETRIEVAL_ERROR: "Error al consultar los detalles del pedido.",
  UPDATE_ERROR: "Error al actualizar el detalle del pedido.",
  DELETE_ERROR: "Error al eliminar el detalle del pedido.",
};

const handleError = (res, status, message, error = null) => {
  console.error(message, error);
  res.status(status).json({ message });
};

const validateFields = (fields) =>
  Object.values(fields).every(
    (field) => field !== undefined && field !== null && field !== ""
  );

const crear_detalle_pedido = async (req, res) => {
  const {
    pedido,
    equipo,
    cantidad_detalle_pedido,
    precio_unitario_detalle_pedido,
    fecha_inicio_detalle_pedido,
    fecha_fin_detalle_pedido,
  } = req.body;

  const subtotal_detalle_pedido =
    cantidad_detalle_pedido * precio_unitario_detalle_pedido;

  if (
    !validateFields([
      pedido,
      equipo,
      cantidad_detalle_pedido,
      precio_unitario_detalle_pedido,
      fecha_inicio_detalle_pedido,
      fecha_fin_detalle_pedido,
    ])
  ) {
    return handleError(res, 400, ERROR_MESSAGES.REQUIRED_FIELDS);
  }

  try {
    const campos = {
      pedido,
      equipo,
      cantidad_detalle_pedido,
      precio_unitario_detalle_pedido,
      subtotal_detalle_pedido,
      fecha_inicio_detalle_pedido,
      fecha_fin_detalle_pedido,
    };

    const resultado = await DetallePedido.crear(campos);
    res.status(201).json({
      message: "El detalle del pedido se creó con éxito",
      id_detalle_pedido: resultado.insertId,
    });
  } catch (error) {
    return handleError(res, 500, ERROR_MESSAGES.CREATION_ERROR, error);
  }
};

const consultar_detalles_pedido = async (_req, res) => {
  try {
    const detalles = await DetallePedido.obtenerTodos();
    res.status(200).json(detalles);
  } catch (error) {
    return handleError(res, 500, ERROR_MESSAGES.RETRIEVAL_ERROR, error);
  }
};

const actualizar_detalle_pedido = async (req, res) => {
  const id = req.params.id;
  const {
    pedido,
    equipo,
    cantidad_detalle_pedido,
    precio_unitario_detalle_pedido,
    fecha_inicio_detalle_pedido,
    fecha_fin_detalle_pedido,
  } = req.body;

  const subtotal_detalle_pedido =
    cantidad_detalle_pedido * precio_unitario_detalle_pedido;

  try {
    const actual = await DetallePedido.obtenerPorId(id);
    if (!actual || actual.length === 0) {
      return handleError(res, 404, ERROR_MESSAGES.ORDER_DETAIL_NOT_FOUND);
    }

    const nuevos = {
      pedido,
      equipo,
      cantidad_detalle_pedido,
      precio_unitario_detalle_pedido,
      subtotal_detalle_pedido,
      fecha_inicio_detalle_pedido,
      fecha_fin_detalle_pedido,
    };

    const cambios = {};
    for (const key in nuevos) {
      if (nuevos[key] !== actual[0][key]) {
        cambios[key] = nuevos[key];
      }
    }

    if (Object.keys(cambios).length === 0) {
      return res.status(200).json({ message: "No se realizaron cambios." });
    }

    const actualizado = await DetallePedido.actualizar(id, cambios);
    if (actualizado.affectedRows === 0) {
      return handleError(res, 404, ERROR_MESSAGES.ORDER_DETAIL_NOT_FOUND);
    }

    res
      .status(200)
      .json({ message: "Detalle del pedido actualizado con éxito." });
  } catch (error) {
    return handleError(res, 500, ERROR_MESSAGES.UPDATE_ERROR, error);
  }
};

const eliminar_detalle_pedido = async (req, res) => {
  const id = req.params.id;

  try {
    const eliminado = await DetallePedido.eliminar(id);
    if (eliminado.affectedRows === 0) {
      return handleError(res, 404, ERROR_MESSAGES.ORDER_DETAIL_NOT_FOUND);
    }

    res
      .status(200)
      .json({ message: "Detalle del pedido eliminado con éxito." });
  } catch (error) {
    return handleError(res, 500, ERROR_MESSAGES.DELETE_ERROR, error);
  }
};

module.exports = {
  crear_detalle_pedido,
  consultar_detalles_pedido,
  actualizar_detalle_pedido,
  eliminar_detalle_pedido,
};

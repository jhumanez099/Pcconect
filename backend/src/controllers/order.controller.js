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
  res.status(status).json({ message });
};

const validateFields = (fields) =>
  Object.values(fields).every(
    (field) => field !== undefined && field !== null && field !== ""
  );

const crear_pedido = async (req, res) => {
  const fields = {
    fecha_inicio_pedido: req.body.fecha_inicio_pedido,
    fecha_fin_pedido: req.body.fecha_fin_pedido,
    precio_total_pedido: req.body.precio_total_pedido,
    estado_pedido: req.body.estado_pedido,
    id_cliente: req.body.id_cliente,
    id_usuario: req.body.id_usuario,
    id_tipo_pedido: req.body.id_tipo_pedido,
    motivo_pedido: req.body.motivo_pedido,
  };

  if (!validateFields(fields)) {
    return handleError(res, 400, ERROR_MESSAGES.REQUIRED_FIELDS);
  }

  try {
    const result = await Pedido.crear(fields);
    res.status(201).json({
      message: "El pedido se creó con éxito",
      id_pedido: result.insertId,
    });
  } catch (error) {
    return handleError(res, 500, ERROR_MESSAGES.CREATION_ERROR, error);
  }
};

const consultar_pedidos = async (_req, res) => {
  try {
    const pedidos = await Pedido.obtenerTodos();
    res.status(200).json(pedidos);
  } catch (error) {
    return handleError(res, 500, ERROR_MESSAGES.RETRIEVAL_ERROR, error);
  }
};

const actualizar_pedido = async (req, res) => {
  const id_pedido = req.params.id;

  const fields = {
    fecha_inicio_pedido: req.body.fecha_inicio_pedido,
    fecha_fin_pedido: req.body.fecha_fin_pedido,
    precio_total_pedido: req.body.precio_total_pedido,
    estado_pedido: req.body.estado_pedido,
    id_cliente: req.body.id_cliente,
    id_usuario: req.body.id_usuario,
    motivo_pedido: req.body.motivo_pedido,
    id_tipo_pedido: req.body.id_tipo_pedido,
  };

  try {
    const pedido_actual = await Pedido.obtenerPorId(id_pedido);
    if (!pedido_actual || pedido_actual.length === 0) {
      return handleError(res, 404, ERROR_MESSAGES.ORDER_NOT_FOUND);
    }

    const cambios = {};
    for (const key in fields) {
      if (fields[key] !== pedido_actual[0][key]) {
        cambios[key] = fields[key];
      }
    }

    if (Object.keys(cambios).length === 0) {
      return res.status(200).json({ message: "No se realizaron cambios." });
    }

    const actualizado = await Pedido.actualizar(id_pedido, cambios);
    if (actualizado.affectedRows === 0) {
      return handleError(res, 404, ERROR_MESSAGES.ORDER_NOT_FOUND);
    }

    res.status(200).json({ message: "Pedido actualizado con éxito." });
  } catch (error) {
    return handleError(res, 500, ERROR_MESSAGES.UPDATE_ERROR, error);
  }
};

const eliminar_pedido = async (req, res) => {
  const id_pedido = req.params.id;

  try {
    const result = await Pedido.eliminar(id_pedido);
    if (result.affectedRows === 0) {
      return handleError(res, 404, ERROR_MESSAGES.ORDER_NOT_FOUND);
    }

    res.status(200).json({ message: "Pedido eliminado con éxito." });
  } catch (error) {
    return handleError(res, 500, ERROR_MESSAGES.DELETE_ERROR, error);
  }
};

module.exports = {
  crear_pedido,
  consultar_pedidos,
  actualizar_pedido,
  eliminar_pedido,
};

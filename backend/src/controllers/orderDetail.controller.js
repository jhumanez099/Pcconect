const DetallePedido = require("../models/OrderDetail.js");

const ERROR_MESSAGES = {
  REQUIRED_FIELDS: "Todos los campos son obligatorios.",
  ORDER_DETAIL_NOT_FOUND: "Detalle del pedido no encontrado.",
  CREATION_ERROR: "Error al crear el detalle del pedido.",
  RETRIEVAL_ERROR: "Error al consultar el detalle del pedido.",
  UPDATE_ERROR: "Error al actualizar el detalle del pedido.",
  DELETE_ERROR: "Error al eliminar el detalle del pedido.",
};

const handleError = (res, status, message, error = null) => {
  console.error(message, error);
  res.status(status).json({ message });
};

const validateFields = (fields) => {
  return fields.every(
    (field) => field !== undefined && field !== null && field !== ""
  );
};

const crearDetallePedido = async (req, res) => {
  const {
    pedido,
    equipo,
    cantidadDetallePedido,
    precioUnitarioDetallePedido,
    fechaInicioDetallePedido,
    fechaFinDetallePedido,
  } = req.body;
  const subtotalDetallePedido =
    cantidadDetallePedido * precioUnitarioDetallePedido;

  if (
    !validateFields([
      pedido,
      equipo,
      cantidadDetallePedido,
      precioUnitarioDetallePedido,
      fechaInicioDetallePedido,
      fechaFinDetallePedido,
    ])
  ) {
    return res.status(400).json({ message: ERROR_MESSAGES.REQUIRED_FIELDS });
  }

  try {
    const fields = {
      pedido,
      equipo,
      cantidadDetallePedido,
      precioUnitarioDetallePedido,
      subtotalDetallePedido,
      fechaInicioDetallePedido,
      fechaFinDetallePedido,
    };

    const detallePedidoNuevo = await DetallePedido.crear(fields);
    res.status(201).json({
      message: "El detalle del pedido se creó con éxito",
      detallePedidoId: detallePedidoNuevo.insertId,
    });
  } catch (error) {
    handleError(res, 500, ERROR_MESSAGES.CREATION_ERROR, error);
  }
};

const consultarDetallesPedidos = async (req, res) => {
  try {
    const detallesPedidos = await DetallePedido.obtenerTodos();
    res.status(200).json(detallesPedidos);
  } catch (error) {
    handleError(res, 500, ERROR_MESSAGES.RETRIEVAL_ERROR, error);
  }
};

const actualizarDetallePedido = async (req, res) => {
  const idDetallePedido = req.params.id;
  const {
    pedido,
    equipo,
    cantidadDetallePedido,
    precioUnitarioDetallePedido,
    fechaInicioDetallePedido,
    fechaFinDetallePedido,
  } = req.body;
  const subtotalDetallePedido =
    cantidadDetallePedido * precioUnitarioDetallePedido;

  const fields = {
    pedido,
    equipo,
    cantidadDetallePedido,
    precioUnitarioDetallePedido,
    subtotalDetallePedido,
    fechaInicioDetallePedido,
    fechaFinDetallePedido,
  };

  try {
    // Obtener el detalle del pedido actual desde la base de datos
    const detallePedidoExistente = await DetallePedido.obtenerPorId(idDetallePedido);

    // Si no existe el detalle del pedido, retornar error
    if (!detallePedidoExistente || detallePedidoExistente.length === 0) {
      return res
        .status(404)
        .json({ message: ERROR_MESSAGES.ORDER_DETAIL_NOT_FOUND });
    }

    // Filtrar solo los campos modificados
    const camposModificados = {};
    Object.keys(fields).forEach((key) => {
      if (fields[key] !== detallePedidoExistente[0][key]) {
        camposModificados[key] = fields[key];
      }
    });

    // Si no hay campos modificados, retornar mensaje de sin cambios
    if (Object.keys(camposModificados).length === 0) {
      return res
        .status(200)
        .json({ message: "No se realizaron cambios en el detalle del pedido." });
    }

    // Actualizar solo los campos modificados
    const detallePedidoActualizado = await DetallePedido.actualizar(
      idDetallePedido,
      camposModificados
    );

    if (detallePedidoActualizado.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: ERROR_MESSAGES.ORDER_DETAIL_NOT_FOUND });
    }

    res.status(200).json({ message: "Detalle del pedido actualizado con éxito." });
  } catch (error) {
    handleError(res, 500, ERROR_MESSAGES.UPDATE_ERROR, error);
  }
};

const eliminarDetallePedido = async (req, res) => {
  const idDetallePedido = req.params.id;

  if (!idDetallePedido) {
    return res
      .status(400)
      .json({ message: "El ID del detalle del pedido es requerido." });
  }

  try {
    const detallePedidoEliminado = await DetallePedido.eliminar(
      idDetallePedido
    );

    if (detallePedidoEliminado.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: ERROR_MESSAGES.ORDER_DETAIL_NOT_FOUND });
    }

    res
      .status(200)
      .json({ message: "Detalle del pedido eliminado con éxito." });
  } catch (error) {
    handleError(res, 500, ERROR_MESSAGES.DELETE_ERROR, error);
  }
};

module.exports = {
  crearDetallePedido,
  consultarDetallesPedidos,
  actualizarDetallePedido,
  eliminarDetallePedido,
};

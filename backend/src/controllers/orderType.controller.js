const TipoPedido = require("../models/OrderType.js");

const ERROR_MESSAGES = {
  REQUIRED_FIELDS: "El nombre del tipo del pedido es requerido.",
  ORDER_TYPE_NOT_FOUND: "Tipo de pedido no encontrado.",
  ORDER_TYPE_ALREADY_EXISTS: "El nombre del tipo de pedido ya existe.",
  CREATION_ERROR: "Error al crear el tipo de pedido.",
  RETRIEVAL_ERROR: "Error al consultar el tipo de pedido.",
  UPDATE_ERROR: "Error al actualizar el tipo de pedido.",
  DELETE_ERROR: "Error al eliminar el tipo de pedido.",
};

const handleError = (res, status, message, error = null) => {
  console.error(message, error);
  res.status(status).json({ message });
};

const validateFields = (fields) => {
  return Object.values(fields).every(
    (field) => field !== undefined && field !== null && field !== ""
  );
};

const crearTipoPedido = async (req, res) => {
  const { nombreTipoPedido } = req.body;

  if (!validateFields({ nombreTipoPedido })) {
    return res.status(400).json({ message: ERROR_MESSAGES.REQUIRED_FIELDS });
  }

  try {
    const tipoPedidoNuevo = await TipoPedido.crear(nombreTipoPedido);

    res.status(201).json({
      message: "El tipo de pedido se creó con éxito",
      tipoPedidoId: tipoPedidoNuevo.insertId,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      handleError(res, 400, ERROR_MESSAGES.ORDER_TYPE_ALREADY_EXISTS, error);
    } else {
      handleError(res, 500, ERROR_MESSAGES.CREATION_ERROR, error);
    }
  }
};

const consultarTipoPedido = async (req, res) => {
  try {
    const tiposPedidos = await TipoPedido.obtenerTodos();
    res.status(200).json(tiposPedidos);
  } catch (error) {
    handleError(res, 500, ERROR_MESSAGES.RETRIEVAL_ERROR, error);
  }
};

const actualizarTipoPedido = async (req, res) => {
  const idTipoPedido = req.params.id;
  const fields = {
    nombre_tipo_pedido: req.body.nombre_tipo_pedido,
  };

  console.log(fields)

  try {
    const tipoExistente = await TipoPedido.obtenerPorId(idTipoPedido);

    if (!tipoExistente || tipoExistente.length === 0) {
      return res
        .status(404)
        .json({ message: ERROR_MESSAGES.ORDER_TYPE_NOT_FOUND});
    }

    const camposModificados = {};
    Object.keys(fields).forEach((key) => {
      if (fields[key] !== tipoExistente[0][key]) {
        camposModificados[key] = fields[key];
      }
    });

    if (Object.keys(camposModificados).length === 0) {
      return res.status(200).json({ message: "No se realizaron cambios." });
    }

    const actualizado = await TipoPedido.actualizar(
      idTipoPedido,
      camposModificados
    );

    if (actualizado.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: ERROR_MESSAGES.ORDER_TYPE_NOT_FOUND });
    }

    res.status(200).json({ message: "Tipo de pedido actualizado con éxito." });
  } catch (error) {
    handleError(res, 500, ERROR_MESSAGES.UPDATE_ERROR, error);
  }
};

const eliminarTipoPedido = async (req, res) => {
  const idTipoPedido = req.params.id;

  if (!idTipoPedido) {
    return res
      .status(400)
      .json({ message: "El ID del tipo de pedido es requerido." });
  }

  try {
    const tipoPedidoEliminado = await TipoPedido.eliminar(idTipoPedido);

    if (tipoPedidoEliminado.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: ERROR_MESSAGES.ORDER_TYPE_NOT_FOUND });
    }

    res.status(200).json({ message: "Tipo de pedido eliminado con éxito." });
  } catch (error) {
    handleError(res, 500, ERROR_MESSAGES.DELETE_ERROR, error);
  }
};

module.exports = {
  crearTipoPedido,
  consultarTipoPedido,
  actualizarTipoPedido,
  eliminarTipoPedido,
};

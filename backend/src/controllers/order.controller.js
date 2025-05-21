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
    const {
      fecha_inicio_pedido,
      fecha_fin_pedido,
      precio_total_pedido,
      estado_pedido,
      id_cliente,
      id_usuario,
      id_tipo_pedido,
      motivo_pedido,
      detalles // <-- esto debe venir como array
    } = req.body;
  
    try {
      const pedido = await Pedido.crear({
        fecha_inicio_pedido,
        fecha_fin_pedido,
        precio_total_pedido,
        estado_pedido,
        id_cliente,
        id_usuario,
        id_tipo_pedido,
        motivo_pedido,
      });
  
      const id_pedido = pedido.insertId;
  
      // Insertar detalles
      if (Array.isArray(detalles)) {
        for (const d of detalles) {
          await Pedido.insertarDetalle({
            id_pedido,
            id_equipo: d.id_equipo,
            cantidad: d.cantidad,
            precio_unitario: d.precio_unitario,
            subtotal: d.subtotal,
            fecha_inicio: d.fecha_inicio,
            fecha_fin: d.fecha_fin
          });
        }
      }
  
      res.status(201).json({ message: "Pedido y detalle(s) creados con éxito", id_pedido });
    } catch (error) {
      console.error("Error al crear pedido:", error);
      res.status(500).json({ message: "Error al crear el pedido" });
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
    if (!pedido_actual) {
      return res.status(404).json({ message: "Pedido no encontrado." });
    }

    const cambios = {};
    for (const key in fields) {
      if (fields[key] !== pedido_actual[key]) {
        cambios[key] = fields[key];
      }
    }

    // Si no hay cambios, salir
    if (Object.keys(cambios).length === 0) {
      return res.status(200).json({ message: "No se realizaron cambios." });
    }

    // 🔐 Filtrar solo campos que existen en la tabla 'pedidos'
    const columnasValidas = [
      "fecha_inicio_pedido",
      "fecha_fin_pedido",
      "precio_total_pedido",
      "estado_pedido",
      "id_cliente",
      "id_usuario",
      "id_tipo_pedido",
      "motivo_pedido",
    ];

    const camposLimpiados = {};
    for (const key of columnasValidas) {
      if (cambios.hasOwnProperty(key)) {
        camposLimpiados[key] = cambios[key];
      }
    }
    if (req.body.eliminados && Array.isArray(req.body.eliminados)) {
      for (const id of req.body.eliminados) {
        await Pedido.eliminarDetalle(id);
      }
    }
    if (req.body.detalles && Array.isArray(req.body.detalles)) {
      for (const d of req.body.detalles) {
        if (d.id_detalle_pedido) {
          // Ya existe, actualizar
          await Pedido.actualizarDetalle({
            id_detalle_pedido: d.id_detalle_pedido,
            cantidad: d.cantidad,
            precio_unitario: d.precio_unitario,
            subtotal: d.subtotal,
            fecha_inicio: d.fecha_inicio,
            fecha_fin: d.fecha_fin,
          });
        }
      }
    }

    const actualizado = await Pedido.actualizar(id_pedido, {
      ...pedido_actual,
      ...camposLimpiados,
    });

    if (actualizado.affectedRows === 0) {
      return res.status(404).json({ message: "Pedido no encontrado." });
    }
    res.status(200).json({ message: "Pedido actualizado con éxito." });
  } catch (error) {
    console.error("Error al actualizar el pedido:", error);
    res.status(500).json({ message: "Error al actualizar el pedido." });
  }
};



const eliminar_pedido = async (req, res) => {
  const id_pedido = req.params.id;

  try {
    // Primero elimina todos los detalles de ese pedido
    await Pedido.eliminarDetallesPorPedido(id_pedido);

    // Luego sí elimina el pedido
    const result = await Pedido.eliminar(id_pedido);
    if (result.affectedRows === 0) {
      return handleError(res, 404, ERROR_MESSAGES.ORDER_NOT_FOUND);
    }

    res.status(200).json({ message: "Pedido eliminado con éxito." });
  } catch (error) {
    return handleError(res, 500, ERROR_MESSAGES.DELETE_ERROR, error);
  }
};


const obtener_detalle_pedido = async (req, res) => {
  const id_pedido = req.params.id;

  try {
    const detalles = await Pedido.obtenerDetallesPorIdPedido(id_pedido);
    res.status(200).json(detalles);
  } catch (error) {
    console.error("Error al consultar detalles del pedido:", error);
    res.status(500).json({ message: "Error al consultar detalles del pedido" });
  }
}

module.exports = {
  crear_pedido,
  consultar_pedidos,
  actualizar_pedido,
  eliminar_pedido,
  obtener_detalle_pedido
};

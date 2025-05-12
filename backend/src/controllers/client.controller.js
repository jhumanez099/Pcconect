const Cliente = require("../models/Client.js");

const ERROR_MESSAGES = {
  REQUIRED_FIELDS: "Todos los campos son obligatorios.",
  CLIENT_NOT_FOUND: "Cliente no encontrado.",
  CLIENT_ALREADY_EXISTS: "El nombre o correo del cliente ya existe.",
  CREATION_ERROR: "Error al crear el cliente.",
  RETRIEVAL_ERROR: "Error al consultar el cliente.",
  UPDATE_ERROR: "Error al actualizar el cliente.",
  DELETE_ERROR: "Error al eliminar el cliente.",
};

const handleError = (res, status, message, error = null) => {
  console.error(message, error);
  return res.status(status).json({ message });
};

const validateFields = (fields) => {
  return Object.values(fields).every(
    (field) => field !== undefined && field !== null && field !== ""
  );
};

// Crear
const crearCliente = async (req, res) => {
  const fields = {
    nombre_cliente: req.body.nombre_cliente,
    direccion_cliente: req.body.direccion_cliente,
    telefono_cliente: req.body.telefono_cliente,
    correo_cliente: req.body.correo_cliente,
    encargado_cliente: req.body.encargado_cliente,
    estado_cliente: req.body.estado_cliente,
  };

  if (!validateFields(fields)) {
    return handleError(res, 400, ERROR_MESSAGES.REQUIRED_FIELDS);
  }

  try {
    const clienteNuevo = await Cliente.crear(fields);
    res.status(201).json({
      message: "El cliente se creó con éxito",
      clienteId: clienteNuevo.insertId,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      const campo = error.sqlMessage.includes("unique_correo_cliente")
        ? "correo"
        : "nombre";
      return handleError(res, 400, `El ${campo} del cliente ya existe.`, error);
    }
    return handleError(res, 500, ERROR_MESSAGES.CREATION_ERROR, error);
  }
};

// Consultar
const consultarClientes = async (_req, res) => {
  try {
    const clientes = await Cliente.obtenerTodos();
    res.status(200).json(clientes);
  } catch (error) {
    return handleError(res, 500, ERROR_MESSAGES.RETRIEVAL_ERROR, error);
  }
};

// Actualizar
const actualizarCliente = async (req, res) => {
  const id = req.params.id;

  const fields = {
    nombre_cliente: req.body.nombre_cliente,
    direccion_cliente: req.body.direccion_cliente,
    telefono_cliente: req.body.telefono_cliente,
    correo_cliente: req.body.correo_cliente,
    encargado_cliente: req.body.encargado_cliente,
    estado_cliente: req.body.estado_cliente,
  };

  try {
    const existente = await Cliente.obtenerPorId(id);

    if (!existente || existente.length === 0) {
      return handleError(res, 404, ERROR_MESSAGES.CLIENT_NOT_FOUND);
    }

    const cambios = {};
    Object.keys(fields).forEach((key) => {
      if (fields[key] !== existente[0][key]) {
        cambios[key] = fields[key];
      }
    });

    if (Object.keys(cambios).length === 0) {
      return res.status(200).json({ message: "No se realizaron cambios." });
    }

    const resultado = await Cliente.actualizar(id, cambios);

    if (resultado.affectedRows === 0) {
      return handleError(res, 404, ERROR_MESSAGES.CLIENT_NOT_FOUND);
    }

    res.status(200).json({ message: "Cliente actualizado con éxito." });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return handleError(res, 400, ERROR_MESSAGES.CLIENT_ALREADY_EXISTS, error);
    }
    return handleError(res, 500, ERROR_MESSAGES.UPDATE_ERROR, error);
  }
};

// Eliminar
const eliminarCliente = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return handleError(res, 400, "El ID del cliente es requerido.");
  }

  try {
    const resultado = await Cliente.eliminar(id);

    if (resultado.affectedRows === 0) {
      return handleError(res, 404, ERROR_MESSAGES.CLIENT_NOT_FOUND);
    }

    res.status(200).json({ message: "Cliente eliminado con éxito." });
  } catch (error) {
    return handleError(res, 500, ERROR_MESSAGES.DELETE_ERROR, error);
  }
};

module.exports = {
  crearCliente,
  consultarClientes,
  actualizarCliente,
  eliminarCliente,
};

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
  res.status(status).json({ message });
};

const validateFields = (fields) => {
  return Object.values(fields).every(
    (field) => field !== undefined && field !== null && field !== ""
  );
};

const crearClientes = async (req, res) => {
  const fields = {
    nombreCliente: req.body.nombreCliente,
    direccionCliente: req.body.direccionCliente,
    telefonoCliente: req.body.telefonoCliente,
    correoCliente: req.body.correoCliente,
    encargadoCliente: req.body.encargadoCliente,
    estadoCliente: req.body.estadoCliente,
  };

  if (!validateFields(fields)) {
    return res.status(400).json({ message: ERROR_MESSAGES.REQUIRED_FIELDS });
  }

  try {
    const clienteNuevo = await Cliente.crear(fields);
    res.status(201).json({
      message: "El cliente se creó con éxito", clienteNuevo
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      const campoDuplicado = error.sqlMessage.includes("unique_correo_cliente")
        ? "correo"
        : "nombre";
      return res
        .status(400)
        .json({ message: `El ${campoDuplicado} del cliente ya existe.` });
    }
    res.status(500).json({ message: "Error al crear el cliente." });
  }
};

const consultarClientes = async (req, res) => {
  try {
    const clientes = await Cliente.obtenerTodos();
    res.status(200).json(clientes);
  } catch (error) {
    handleError(res, 500, ERROR_MESSAGES.RETRIEVAL_ERROR, error);
  }
};

const actualizarCliente = async (req, res) => {
  const idCliente = req.params.id;
  const fields = {
    nombreCliente: req.body.nombreCliente,
    direccionCliente: req.body.direccionCliente,
    telefonoCliente: req.body.telefonoCliente,
    correoCliente: req.body.correoCliente,
    encargadoCliente: req.body.encargadoCliente,
    estadoCliente: req.body.estadoCliente,
  };

  try {
    // Obtener el cliente actual desde la base de datos
    const clienteExistente = await Cliente.obtenerPorId(idCliente);

    // Si no existe el cliente, retornar error
    if (!clienteExistente || clienteExistente.length === 0) {
      return res.status(404).json({ message: ERROR_MESSAGES.CLIENT_NOT_FOUND });
    }

    // Filtrar solo los campos modificados
    const camposModificados = {};
    Object.keys(fields).forEach((key) => {
      if (fields[key] !== clienteExistente[0][key]) {
        camposModificados[key] = fields[key];
      }
    });

    // Si no hay campos modificados, retornar mensaje de sin cambios
    if (Object.keys(camposModificados).length === 0) {
      return res
        .status(200)
        .json({ message: "No se realizaron cambios en el cliente." });
    }

    // Actualizar solo los campos modificados
    const clienteActualizado = await Cliente.actualizar(
      idCliente,
      camposModificados
    );

    if (clienteActualizado.affectedRows === 0) {
      return res.status(404).json({ message: ERROR_MESSAGES.CLIENT_NOT_FOUND });
    }

    res.status(200).json({ message: "Cliente actualizado con éxito." });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      handleError(res, 400, ERROR_MESSAGES.CLIENT_ALREADY_EXISTS, error);
    } else {
      handleError(res, 500, ERROR_MESSAGES.UPDATE_ERROR, error);
    }
  }
};

const eliminarCliente = async (req, res) => {
  const idCliente = req.params.id;

  if (!idCliente) {
    return res.status(400).json({ message: "El ID del cliente es requerido." });
  }

  try {
    const clienteEliminado = await Cliente.eliminar(idCliente);

    if (clienteEliminado.affectedRows === 0) {
      return res.status(404).json({ message: ERROR_MESSAGES.CLIENT_NOT_FOUND });
    }

    res.status(200).json({ message: "Cliente eliminado con éxito." });
  } catch (error) {
    handleError(res, 500, ERROR_MESSAGES.DELETE_ERROR, error);
  }
};

module.exports = {
  crearClientes,
  consultarClientes,
  actualizarCliente,
  eliminarCliente,
};

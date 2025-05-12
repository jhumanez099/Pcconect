const TipoUsuario = require("../models/UserType.js");

const ERROR_MESSAGES = {
  REQUIRED_FIELDS: "El nombre del tipo de usuario es requerido.",
  USER_TYPE_NOT_FOUND: "Tipo de usuario no encontrado.",
  USER_TYPE_ALREADY_EXISTS: "El nombre del tipo de usuario ya existe.",
  CREATION_ERROR: "Error al crear el tipo de usuario.",
  RETRIEVAL_ERROR: "Error al consultar el tipo de usuario.",
  UPDATE_ERROR: "Error al actualizar el tipo de usuario.",
  DELETE_ERROR: "Error al eliminar el tipo de usuario.",
};

const handleError = (res, status, message, error = null) => {
  console.error(message, error);
  return res.status(status).json({ message });
};

const validarCampo = (campo) => {
  return (
    campo !== undefined && campo !== null && campo.toString().trim() !== ""
  );
};

// 🟩 Crear tipo de usuario
const crearTipoUsuario = async (req, res) => {
  const { nombre_tipo_usuario } = req.body;

  if (!validarCampo(nombre_tipo_usuario)) {
    return handleError(res, 400, ERROR_MESSAGES.REQUIRED_FIELDS);
  }

  try {
    const result = await TipoUsuario.crear({ nombre_tipo_usuario });
    return res.status(201).json({
      message: "Tipo de usuario creado con éxito",
      tipoUsuarioId: result.insertId,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return handleError(
        res,
        400,
        ERROR_MESSAGES.USER_TYPE_ALREADY_EXISTS,
        error
      );
    }
    return handleError(res, 500, ERROR_MESSAGES.CREATION_ERROR, error);
  }
};

// 🟦 Consultar todos
const consultarTiposUsuario = async (_req, res) => {
  try {
    const tipos = await TipoUsuario.obtenerTodos();
    return res.status(200).json(tipos);
  } catch (error) {
    return handleError(res, 500, ERROR_MESSAGES.RETRIEVAL_ERROR, error);
  }
};

// 🟨 Actualizar tipo de usuario
const actualizarTipoUsuario = async (req, res) => {
  const id = req.params.id;
  const { nombre_tipo_usuario } = req.body;

  try {
    const existente = await TipoUsuario.obtenerPorId(id);
    if (!existente || existente.length === 0) {
      return handleError(res, 404, ERROR_MESSAGES.USER_TYPE_NOT_FOUND);
    }

    const cambios = {};
    if (nombre_tipo_usuario !== existente[0].nombre_tipo_usuario) {
      cambios.nombre_tipo_usuario = nombre_tipo_usuario;
    }

    if (Object.keys(cambios).length === 0) {
      return res.status(200).json({ message: "No se realizaron cambios." });
    }

    const actualizado = await TipoUsuario.actualizar(id, cambios);
    if (actualizado.affectedRows === 0) {
      return handleError(res, 404, ERROR_MESSAGES.USER_TYPE_NOT_FOUND);
    }

    return res
      .status(200)
      .json({ message: "Tipo de usuario actualizado con éxito." });
  } catch (error) {
    return handleError(res, 500, ERROR_MESSAGES.UPDATE_ERROR, error);
  }
};

// 🟥 Eliminar tipo de usuario
const eliminarTipoUsuario = async (req, res) => {
  const id = req.params.id;

  try {
    const eliminado = await TipoUsuario.eliminar(id);
    if (eliminado.affectedRows === 0) {
      return handleError(res, 404, ERROR_MESSAGES.USER_TYPE_NOT_FOUND);
    }

    return res
      .status(200)
      .json({ message: "Tipo de usuario eliminado con éxito." });
  } catch (error) {
    return handleError(res, 500, ERROR_MESSAGES.DELETE_ERROR, error);
  }
};

module.exports = {
  crearTipoUsuario,
  consultarTiposUsuario,
  actualizarTipoUsuario,
  eliminarTipoUsuario,
};

const Usuario = require("../models/User.js");

const ERROR_MESSAGES = {
  REQUIRED_FIELDS: "Todos los campos son obligatorios.",
  USER_NOT_FOUND: "Usuario no encontrado.",
  USER_ALREADY_EXISTS: "El correo del usuario ya está registrado.",
  CREATION_ERROR: "Error al crear el usuario.",
  RETRIEVAL_ERROR: "Error al consultar los usuarios.",
  UPDATE_ERROR: "Error al actualizar el usuario.",
  DELETE_ERROR: "Error al eliminar el usuario.",
};

const handleError = (res, status, message, error = null) => {
  console.error(message, error);
  return res.status(status).json({ message });
};

const crearUsuario = async (req, res) => {
  const {
    nombre_usuario,
    correo_usuario,
    contraseña_usuario,
    telefono_usuario,
    cargo_usuario,
    estado_usuario,
    id_tipo_usuario,
  } = req.body;

  if (
    !nombre_usuario ||
    !correo_usuario ||
    !contraseña_usuario ||
    !telefono_usuario ||
    !cargo_usuario ||
    !estado_usuario ||
    !id_tipo_usuario
  ) {
    return handleError(res, 400, ERROR_MESSAGES.REQUIRED_FIELDS);
  }

  try {
    const nuevo = await Usuario.crear({
      nombre_usuario,
      correo_usuario,
      contraseña_usuario,
      telefono_usuario,
      cargo_usuario,
      estado_usuario,
      id_tipo_usuario,
    });

    res.status(201).json({
      message: "Usuario creado con éxito",
      usuarioId: nuevo.insertId,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return handleError(res, 400, ERROR_MESSAGES.USER_ALREADY_EXISTS, error);
    }
    return handleError(res, 500, ERROR_MESSAGES.CREATION_ERROR, error);
  }
};

const consultarUsuarios = async (_req, res) => {
  try {
    const usuarios = await Usuario.obtenerTodos();
    res.status(200).json(usuarios);
  } catch (error) {
    return handleError(res, 500, ERROR_MESSAGES.RETRIEVAL_ERROR, error);
  }
};

const actualizarUsuario = async (req, res) => {
  const id = req.params.id;
  const {
    nombre_usuario,
    correo_usuario,
    telefono_usuario,
    cargo_usuario,
    estado_usuario,
    id_tipo_usuario,
  } = req.body;

  try {
    const actual = await Usuario.obtenerPorId(id);
    if (!actual || actual.length === 0) {
      return handleError(res, 404, ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const cambios = {};
    if (nombre_usuario !== actual[0].nombre_usuario)
      cambios.nombre_usuario = nombre_usuario;
    if (correo_usuario !== actual[0].correo_usuario)
      cambios.correo_usuario = correo_usuario;
    if (telefono_usuario !== actual[0].telefono_usuario)
      cambios.telefono_usuario = telefono_usuario;
    if (cargo_usuario !== actual[0].cargo_usuario)
      cambios.cargo_usuario = cargo_usuario;
    if (estado_usuario !== actual[0].estado_usuario)
      cambios.estado_usuario = estado_usuario;
    if (id_tipo_usuario !== actual[0].id_tipo_usuario)
      cambios.id_tipo_usuario = id_tipo_usuario;

    if (Object.keys(cambios).length === 0) {
      return res.status(200).json({ message: "No se realizaron cambios." });
    }

    const actualizado = await Usuario.actualizar(id, cambios);

    if (actualizado.affectedRows === 0) {
      return handleError(res, 404, ERROR_MESSAGES.USER_NOT_FOUND);
    }

    res.status(200).json({ message: "Usuario actualizado con éxito." });
  } catch (error) {
    return handleError(res, 500, ERROR_MESSAGES.UPDATE_ERROR, error);
  }
};

const eliminarUsuario = async (req, res) => {
  const id = req.params.id;

  try {
    const resultado = await Usuario.eliminar(id);
    if (resultado.affectedRows === 0) {
      return handleError(res, 404, ERROR_MESSAGES.USER_NOT_FOUND);
    }

    res.status(200).json({ message: "Usuario eliminado con éxito." });
  } catch (error) {
    return handleError(res, 500, ERROR_MESSAGES.DELETE_ERROR, error);
  }
};

module.exports = {
  crearUsuario,
  consultarUsuarios,
  actualizarUsuario,
  eliminarUsuario,
};

const Usuario = require("../models/User.js");
const bcrypt = require("bcryptjs");

const ERROR_MESSAGES = {
  REQUIRED_FIELDS: "Todos los campos son obligatorios.",
  USER_NOT_FOUND: "Usuario no encontrado.",
  CREATION_ERROR: "Error al crear el usuario.",
  RETRIEVAL_ERROR: "Error al consultar el usuario.",
  UPDATE_ERROR: "Error al actualizar el usuario.",
  DELETE_ERROR: "Error al eliminar el usuario.",
};

const handleError = (res, status, message, error = null) => {
  console.error(message, error);
  res.status(status).json({ message, error: error?.message });
};

const validateFields = (fields) => {
  return Object.values(fields).every(
    (field) => field !== undefined && field !== null && field !== ""
  );
};

const crearUsuario = async (req, res) => {
  const fields = {
    id_tipo_usuario: req.body.id_tipo_usuario,
    nombre_usuario: req.body.nombre_usuario,
    correo_usuario: req.body.correo_usuario,
    contraseña_usuario: req.body.contraseña_usuario,
    telefono_usuario: req.body.telefono_usuario,
    cargo_usuario: req.body.cargo_usuario,
    estado_usuario: req.body.estado_usuario,
  };

  if (!validateFields(fields)) {
    return res.status(400).json({ message: ERROR_MESSAGES.REQUIRED_FIELDS });
  }

  try {
    fields.contraseña_usuario = await bcrypt.hash(
      fields.contraseña_usuario,
      10
    );
    const nuevoUsuario = await Usuario.crear(fields);
    res.status(201).json({
      message: "Usuario creado con éxito",
      usuarioId: nuevoUsuario.insertId,
    });
  } catch (error) {
    handleError(res, 500, ERROR_MESSAGES.CREATION_ERROR, error);
  }
};

const consultarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.obtenerTodos();
    res.status(200).json(usuarios);
  } catch (error) {
    handleError(res, 500, ERROR_MESSAGES.RETRIEVAL_ERROR, error);
  }
};

const actualizarUsuario = async (req, res) => {
  const id = req.params.id;
  const fields = {
    id_tipo_usuario: req.body.id_tipo_usuario,
    nombre_usuario: req.body.nombre_usuario,
    correo_usuario: req.body.correo_usuario,
    contraseña_usuario: req.body.contraseña_usuario,
    telefono_usuario: req.body.telefono_usuario,
    cargo_usuario: req.body.cargo_usuario,
    estado_usuario: req.body.estado_usuario,
  };

  try {
    const usuarioExistente = await Usuario.obtenerPorId(id);
    if (!usuarioExistente) {
      return res.status(404).json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
    }

    const camposModificados = {};
    Object.keys(fields).forEach((key) => {
      if (fields[key] !== usuarioExistente[key]) {
        camposModificados[key] = fields[key];
      }
    });

    // Si no hay cambios, no actualices
    if (Object.keys(camposModificados).length === 0) {
      return res
        .status(200)
        .json({ message: "No se realizaron cambios en el usuario." });
    }

    // Si la contraseña fue modificada, la encriptas
    if (camposModificados.contraseña_usuario) {
      camposModificados.contraseña_usuario = await bcrypt.hash(
        fields.contraseña_usuario,
        10
      );
    }

    const actualizado = await Usuario.actualizar(id, {
      ...usuarioExistente,
      ...camposModificados,
    });

    if (actualizado.affectedRows === 0) {
      return res.status(404).json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
    }

    res.status(200).json({ message: "Usuario actualizado con éxito." });
  } catch (error) {
    handleError(res, 500, ERROR_MESSAGES.UPDATE_ERROR, error);
  }
};


const eliminarUsuario = async (req, res) => {
  const id = req.params.id;

  try {
    const eliminado = await Usuario.eliminar(id);

    if (eliminado.affectedRows === 0) {
      return res.status(404).json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
    }

    res.status(200).json({ message: "Usuario eliminado con éxito." });
  } catch (error) {
    handleError(res, 500, ERROR_MESSAGES.DELETE_ERROR, error);
  }
};

module.exports = {
  crearUsuario,
  consultarUsuarios,
  actualizarUsuario,
  eliminarUsuario,
};

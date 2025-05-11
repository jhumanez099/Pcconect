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
    idTipoUsuario: req.body.idTipoUsuario,
    nombreUsuario: req.body.nombreUsuario,
    correoUsuario: req.body.correoUsuario,
    contraseñaUsuario: req.body.contraseñaUsuario,
    telefonoUsuario: req.body.telefonoUsuario,
    cargoUsuario: req.body.cargoUsuario,
    estadoUsuario: req.body.estadoUsuario,
  };
  
  if (!validateFields(fields)) {
    return res.status(400).json({ message: ERROR_MESSAGES.REQUIRED_FIELDS });
  }

  try {

    const contraseñaEncriptada = await bcrypt.hash(
      fields.contraseñaUsuario,
      10
    );

    fields.contraseñaUsuario = contraseñaEncriptada;

    const usuarioNuevo = await Usuario.crear(fields);
    res.status(201).json({
      message: "Usuario creado con éxito",
      usuarioId: usuarioNuevo.insertId,
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
  const idUsuario = req.params.id;
  const fields = {
    idTipoUsuario: req.body.idTipoUsuario,
    nombreUsuario: req.body.nombreUsuario,
    correoUsuario: req.body.correoUsuario,
    contraseñaUsuario: req.body.contraseñaUsuario,
    telefonoUsuario: req.body.telefonoUsuario,
    cargoUsuario: req.body.cargoUsuario,
    estadoUsuario: req.body.estadoUsuario,
  };

  try {
    // Obtener el usuario actual desde la base de datos
    const usuarioExistente = await Usuario.obtenerPorId(idUsuario);

    // Si no existe el usuario, retornar error
    if (!usuarioExistente || usuarioExistente.length === 0) {
      return res
        .status(404)
        .json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
    }

    // Filtrar solo los campos modificados
    const camposModificados = {};
    Object.keys(fields).forEach((key) => {
      if (fields[key] !== usuarioExistente[0][key]) {
        camposModificados[key] = fields[key];
      }
    });

    // Si no hay campos modificados, retornar mensaje de sin cambios
    if (Object.keys(camposModificados).length === 0) {
      return res
        .status(200)
        .json({ message: "No se realizaron cambios en el usuario." });
    }

    // Actualizar solo los campos modificados
    const usuarioActualizado = await Usuario.actualizar(
      idUsuario,
      camposModificados
    );

    if (usuarioActualizado.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
    }

    res.status(200).json({ message: "Usuario actualizado con éxito." });
  } catch (error) {
    handleError(res, 500, ERROR_MESSAGES.UPDATE_ERROR, error);
  }
};

const eliminarUsuario = async (req, res) => {
  const idUsuario = req.params.id;

  if (!idUsuario) {
    return res.status(400).json({ message: "El ID del usuario es requerido." });
  }

  try {
    const usuarioEliminado = await Usuario.eliminar(idUsuario);

    if (usuarioEliminado.affectedRows === 0) {
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

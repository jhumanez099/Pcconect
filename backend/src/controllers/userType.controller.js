const TipoUsuario = require("../models/UserType.js");

const ERROR_MESSAGES = {
  REQUIRED_FIELDS: "El nombre del tipo del usuario es requerido.",
  USER_TYPE_NOT_FOUND: "Tipo de usuario no encontrado.",
  USER_TYPE_ALREADY_EXISTS: "El nombre del tipo de usuario ya existe.",
  CREATION_ERROR: "Error al crear el tipo de usuario.",
  RETRIEVAL_ERROR: "Error al consultar el tipo de usuario.",
  UPDATE_ERROR: "Error al actualizar el tipo de usuario.",
  DELETE_ERROR: "Error al eliminar el tipo de usuario.",
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

const crearTipoUsuario = async (req, res) => {
  const fields = {
    nombre_tipo_usuario: req.body.nombre_tipo_usuario,
  };

  if (!validateFields(fields)) {
    return res.status(400).json({ message: ERROR_MESSAGES.REQUIRED_FIELDS });
  }

  try {
    const nuevoTipo = await TipoUsuario.crear(fields);
    res
      .status(201)
      .json({ message: "Tipo de usuario creado con éxito", nuevoTipo });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ message: ERROR_MESSAGES.USER_TYPE_ALREADY_EXISTS });
    }
    handleError(res, 500, ERROR_MESSAGES.CREATION_ERROR, error);
  }
};

const consultarTiposUsuario = async (req, res) => {
  try {
    const tiposUsuarios = await TipoUsuario.obtenerTodos();
    res.status(200).json(tiposUsuarios);
  } catch (error) {
    handleError(res, 500, ERROR_MESSAGES.RETRIEVAL_ERROR, error);
  }
};

const actualizarTipoUsuario = async (req, res) => {
  const idTipoUsuario = req.params.id;
  const fields = {
    nombre_tipo_usuario: req.body.nombre_tipo_usuario,
  };

  try {
    const tipoExistente = await TipoUsuario.obtenerPorId(idTipoUsuario);

    if (!tipoExistente || tipoExistente.length === 0) {
      return res
        .status(404)
        .json({ message: ERROR_MESSAGES.USER_TYPE_NOT_FOUND });
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

    const actualizado = await TipoUsuario.actualizar(
      idTipoUsuario,
      camposModificados
    );

    if (actualizado.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: ERROR_MESSAGES.USER_TYPE_NOT_FOUND });
    }

    res.status(200).json({ message: "Tipo de usuario actualizado con éxito." });
  } catch (error) {
    handleError(res, 500, ERROR_MESSAGES.UPDATE_ERROR, error);
  }
};

const eliminarTipoUsuario = async (req, res) => {
  const id = req.params.id;

  try {
    const eliminado = await TipoUsuario.eliminar(id);

    if (eliminado.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: ERROR_MESSAGES.USER_TYPE_NOT_FOUND });
    }

    res.status(200).json({ message: "Tipo de usuario eliminado con éxito." });
  } catch (error) {
    handleError(res, 500, ERROR_MESSAGES.DELETE_ERROR, error);
  }
};

module.exports = {
  crearTipoUsuario,
  consultarTiposUsuario,
  actualizarTipoUsuario,
  eliminarTipoUsuario,
};

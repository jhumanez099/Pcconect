const TipoEquipo = require("../models/EquipmentType.js");

const ERROR_MESSAGES = {
  REQUIRED_FIELDS: "El nombre del tipo de equipo es requerido.",
  EQUIPMENT_TYPE_NOT_FOUND: "Tipo de equipo no encontrado.",
  EQUIPMENT_TYPE_ALREADY_EXISTS: "El nombre del tipo de equipo ya existe.",
  CREATION_ERROR: "Error al crear el tipo de equipo.",
  RETRIEVAL_ERROR: "Error al consultar el tipo de equipo.",
  UPDATE_ERROR: "Error al actualizar el tipo de equipo.",
  DELETE_ERROR: "Error al eliminar el tipo de equipo.",
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

const crearTipoEquipo = async (req, res) => {
  const fields = {
    nombre_tipo_equipo: req.body.nombre_tipo_equipo,
  };

  if (!validateFields(fields)) {
    return res.status(400).json({ message: ERROR_MESSAGES.REQUIRED_FIELDS });
  }

  try {
    const nuevoTipo = await TipoEquipo.crear(fields);
    res.status(201).json({
      message: "Tipo de equipo creado con éxito",
      tipoEquipoId: nuevoTipo.insertId,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      handleError(
        res,
        400,
        ERROR_MESSAGES.EQUIPMENT_TYPE_ALREADY_EXISTS,
        error
      );
    } else {
      handleError(res, 500, ERROR_MESSAGES.CREATION_ERROR, error);
    }
  }
};

const consultarTipoEquipo = async (req, res) => {
  try {
    const tipos = await TipoEquipo.obtenerTodos();
    res.status(200).json(tipos);
  } catch (error) {
    handleError(res, 500, ERROR_MESSAGES.RETRIEVAL_ERROR, error);
  }
};

const actualizarTipoEquipo = async (req, res) => {
  const id = req.params.id;
  const fields = {
    nombre_tipo_equipo: req.body.nombre_tipo_equipo,
  };

  try {
    const existente = await TipoEquipo.obtenerPorId(id);

    if (!existente || existente.length === 0) {
      return res
        .status(404)
        .json({ message: ERROR_MESSAGES.EQUIPMENT_TYPE_NOT_FOUND });
    }

    const cambios = {};
    if (fields.nombre_tipo_equipo !== existente[0].nombre_tipo_equipo) {
      cambios.nombre_tipo_equipo = fields.nombre_tipo_equipo;
    }

    if (Object.keys(cambios).length === 0) {
      return res.status(200).json({ message: "No se realizaron cambios." });
    }

    const actualizado = await TipoEquipo.actualizar(id, cambios);

    if (actualizado.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: ERROR_MESSAGES.EQUIPMENT_TYPE_NOT_FOUND });
    }

    res.status(200).json({ message: "Tipo de equipo actualizado con éxito." });
  } catch (error) {
    handleError(res, 500, ERROR_MESSAGES.UPDATE_ERROR, error);
  }
};

const eliminarTipoEquipo = async (req, res) => {
  const id = req.params.id;

  try {
    const eliminado = await TipoEquipo.eliminar(id);

    if (eliminado.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: ERROR_MESSAGES.EQUIPMENT_TYPE_NOT_FOUND });
    }

    res.status(200).json({ message: "Tipo de equipo eliminado con éxito." });
  } catch (error) {
    handleError(res, 500, ERROR_MESSAGES.DELETE_ERROR, error);
  }
};

module.exports = {
  crearTipoEquipo,
  consultarTipoEquipo,
  actualizarTipoEquipo,
  eliminarTipoEquipo,
};

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
  return res.status(status).json({ message });
};

const validateFields = (fields) => {
  return Object.values(fields).every(
    (field) => field !== undefined && field !== null && field !== ""
  );
};

// 🟩 Crear
const crearTipoEquipo = async (req, res) => {
  const { nombre_tipo_equipo } = req.body;

  if (!validateFields({ nombre_tipo_equipo })) {
    return handleError(res, 400, ERROR_MESSAGES.REQUIRED_FIELDS);
  }

  try {
    const result = await TipoEquipo.crear({ nombre_tipo_equipo });
    res.status(201).json({
      message: "Tipo de equipo creado con éxito",
      tipoEquipoId: result.insertId,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return handleError(
        res,
        400,
        ERROR_MESSAGES.EQUIPMENT_TYPE_ALREADY_EXISTS,
        error
      );
    }
    return handleError(res, 500, ERROR_MESSAGES.CREATION_ERROR, error);
  }
};

// 🟦 Consultar
const consultarTipoEquipo = async (_req, res) => {
  try {
    const tipos = await TipoEquipo.obtenerTodos();
    res.status(200).json(tipos);
  } catch (error) {
    return handleError(res, 500, ERROR_MESSAGES.RETRIEVAL_ERROR, error);
  }
};

// 🟨 Actualizar
const actualizarTipoEquipo = async (req, res) => {
  const id = req.params.id;
  const { nombre_tipo_equipo } = req.body;

  try {
    const existente = await TipoEquipo.obtenerPorId(id);
    if (!existente || existente.length === 0) {
      return handleError(res, 404, ERROR_MESSAGES.EQUIPMENT_TYPE_NOT_FOUND);
    }

    const cambios = {};
    if (nombre_tipo_equipo !== existente[0].nombre_tipo_equipo) {
      cambios.nombre_tipo_equipo = nombre_tipo_equipo;
    }

    if (Object.keys(cambios).length === 0) {
      return res.status(200).json({ message: "No se realizaron cambios." });
    }

    const resultado = await TipoEquipo.actualizar(id, cambios);

    if (resultado.affectedRows === 0) {
      return handleError(res, 404, ERROR_MESSAGES.EQUIPMENT_TYPE_NOT_FOUND);
    }

    res.status(200).json({ message: "Tipo de equipo actualizado con éxito." });
  } catch (error) {
    return handleError(res, 500, ERROR_MESSAGES.UPDATE_ERROR, error);
  }
};

// 🟥 Eliminar
const eliminarTipoEquipo = async (req, res) => {
  const id = req.params.id;

  try {
    const resultado = await TipoEquipo.eliminar(id);

    if (resultado.affectedRows === 0) {
      return handleError(res, 404, ERROR_MESSAGES.EQUIPMENT_TYPE_NOT_FOUND);
    }

    res.status(200).json({ message: "Tipo de equipo eliminado con éxito." });
  } catch (error) {
    return handleError(res, 500, ERROR_MESSAGES.DELETE_ERROR, error);
  }
};

module.exports = {
  crearTipoEquipo,
  consultarTipoEquipo,
  actualizarTipoEquipo,
  eliminarTipoEquipo,
};

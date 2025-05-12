const Equipo = require("../models/Equipment.js");

const ERROR_MESSAGES = {
  REQUIRED_FIELDS: "Todos los campos son obligatorios.",
  EQUIPMENT_NOT_FOUND: "Equipo no encontrado.",
  CREATION_ERROR: "Error al crear el equipo.",
  RETRIEVAL_ERROR: "Error al consultar el equipo.",
  UPDATE_ERROR: "Error al actualizar el equipo.",
  DELETE_ERROR: "Error al eliminar el equipo.",
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

// 🟩 Crear equipo
const crearEquipo = async (req, res) => {
  const {
    id_tipo_equipo,
    modelo_equipo,
    marca_equipo,
    especificaciones_equipo,
    estado_equipo,
    fecha_compra_equipo,
  } = req.body;

  const campos = {
    id_tipo_equipo,
    modelo_equipo,
    marca_equipo,
    especificaciones_equipo,
    estado_equipo,
    fecha_compra_equipo,
  };

  if (!validateFields(campos)) {
    return handleError(res, 400, ERROR_MESSAGES.REQUIRED_FIELDS);
  }

  try {
    const equipoNuevo = await Equipo.crear(campos);
    return res.status(201).json({
      message: "El equipo se creó con éxito",
      equipoId: equipoNuevo.insertId,
    });
  } catch (error) {
    return handleError(res, 500, ERROR_MESSAGES.CREATION_ERROR, error);
  }
};

// 🟦 Consultar todos los equipos
const consultarEquipo = async (_req, res) => {
  try {
    const equipos = await Equipo.obtenerTodos();
    return res.status(200).json(equipos);
  } catch (error) {
    return handleError(res, 500, ERROR_MESSAGES.RETRIEVAL_ERROR, error);
  }
};

// 🟨 Actualizar equipo
const actualizarEquipo = async (req, res) => {
  const id_equipo = req.params.id;

  const {
    id_tipo_equipo,
    modelo_equipo,
    marca_equipo,
    especificaciones_equipo,
    estado_equipo,
    fecha_compra_equipo,
  } = req.body;

  const campos = {
    id_tipo_equipo,
    modelo_equipo,
    marca_equipo,
    especificaciones_equipo,
    estado_equipo,
    fecha_compra_equipo,
  };

  try {
    const existente = await Equipo.obtenerPorId(id_equipo);

    if (!existente || existente.length === 0) {
      return handleError(res, 404, ERROR_MESSAGES.EQUIPMENT_NOT_FOUND);
    }

    const camposModificados = {};
    for (const key in campos) {
      if (campos[key] !== existente[0][key]) {
        camposModificados[key] = campos[key];
      }
    }

    if (Object.keys(camposModificados).length === 0) {
      return res
        .status(200)
        .json({ message: "No se realizaron cambios en el equipo." });
    }

    const resultado = await Equipo.actualizar(id_equipo, camposModificados);

    if (resultado.affectedRows === 0) {
      return handleError(res, 404, ERROR_MESSAGES.EQUIPMENT_NOT_FOUND);
    }

    return res.status(200).json({ message: "Equipo actualizado con éxito." });
  } catch (error) {
    return handleError(res, 500, ERROR_MESSAGES.UPDATE_ERROR, error);
  }
};

// 🟥 Eliminar equipo
const eliminarEquipo = async (req, res) => {
  const id_equipo = req.params.id;

  if (!id_equipo) {
    return handleError(res, 400, "El ID del equipo es requerido.");
  }

  try {
    const resultado = await Equipo.eliminar(id_equipo);

    if (resultado.affectedRows === 0) {
      return handleError(res, 404, ERROR_MESSAGES.EQUIPMENT_NOT_FOUND);
    }

    return res.status(200).json({ message: "Equipo eliminado con éxito." });
  } catch (error) {
    return handleError(res, 500, ERROR_MESSAGES.DELETE_ERROR, error);
  }
};

module.exports = {
  crearEquipo,
  consultarEquipo,
  actualizarEquipo,
  eliminarEquipo,
};

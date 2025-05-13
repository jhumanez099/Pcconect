const Equipo = require("../models/Equipment.js");

const ERROR_MESSAGES = {
  REQUIRED_FIELDS: "Todos los campos son obligatorios.",
  EQUIPMENT_NOT_FOUND: "Equipo no encontrado.",
  CREATION_ERROR: "Error al crear el equipo.",
  RETRIEVAL_ERROR: "Error al consultar los equipos.",
  UPDATE_ERROR: "Error al actualizar el equipo.",
  DELETE_ERROR: "Error al eliminar el equipo.",
};

const handleError = (res, status, message, error = null) => {
  console.error(message, error);
  return res.status(status).json({ message });
};

const crearEquipo = async (req, res) => {
  const {
    id_tipo_equipo,
    modelo_equipo,
    marca_equipo,
    especificaciones_equipo,
    fecha_compra_equipo,
    estado_equipo,
  } = req.body;

  if (
    !id_tipo_equipo ||
    !modelo_equipo ||
    !marca_equipo ||
    !especificaciones_equipo ||
    !fecha_compra_equipo ||
    !estado_equipo
  ) {
    return handleError(res, 400, ERROR_MESSAGES.REQUIRED_FIELDS);
  }

  try {
    const result = await Equipo.crear({
      id_tipo_equipo,
      modelo_equipo,
      marca_equipo,
      especificaciones_equipo,
      fecha_compra_equipo,
      estado_equipo,
    });

    res.status(201).json({
      message: "Equipo creado con éxito",
      equipoId: result.insertId,
    });
  } catch (error) {
    return handleError(res, 500, ERROR_MESSAGES.CREATION_ERROR, error);
  }
};

const consultarEquipo = async (_req, res) => {
  try {
    const equipos = await Equipo.obtenerTodos();
    res.status(200).json(equipos);
  } catch (error) {
    return handleError(res, 500, ERROR_MESSAGES.RETRIEVAL_ERROR, error);
  }
};

const actualizarEquipo = async (req, res) => {
  const id = req.params.id;
  const {
    id_tipo_equipo,
    modelo_equipo,
    marca_equipo,
    especificaciones_equipo,
    fecha_compra_equipo,
    estado_equipo,
  } = req.body;

  try {
    const actual = await Equipo.obtenerPorId(id);
    if (!actual || actual.length === 0) {
      return handleError(res, 404, ERROR_MESSAGES.EQUIPMENT_NOT_FOUND);
    }

    const cambios = {};
    if (id_tipo_equipo !== actual[0].id_tipo_equipo)
      cambios.id_tipo_equipo = id_tipo_equipo;
    if (modelo_equipo !== actual[0].modelo_equipo)
      cambios.modelo_equipo = modelo_equipo;
    if (marca_equipo !== actual[0].marca_equipo)
      cambios.marca_equipo = marca_equipo;
    if (especificaciones_equipo !== actual[0].especificaciones_equipo)
      cambios.especificaciones_equipo = especificaciones_equipo;
    if (
      fecha_compra_equipo !==
      actual[0].fecha_compra_equipo.toISOString().split("T")[0]
    )
      cambios.fecha_compra_equipo = fecha_compra_equipo;
    if (estado_equipo !== actual[0].estado_equipo)
      cambios.estado_equipo = estado_equipo;

    if (Object.keys(cambios).length === 0) {
      return res.status(200).json({ message: "No se realizaron cambios." });
    }

    const actualizado = await Equipo.actualizar(id, cambios);
    if (actualizado.affectedRows === 0) {
      return handleError(res, 404, ERROR_MESSAGES.EQUIPMENT_NOT_FOUND);
    }

    res.status(200).json({ message: "Equipo actualizado con éxito." });
  } catch (error) {
    return handleError(res, 500, ERROR_MESSAGES.UPDATE_ERROR, error);
  }
};

const eliminarEquipo = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await Equipo.eliminar(id);
    if (result.affectedRows === 0) {
      return handleError(res, 404, ERROR_MESSAGES.EQUIPMENT_NOT_FOUND);
    }

    res.status(200).json({ message: "Equipo eliminado con éxito." });
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

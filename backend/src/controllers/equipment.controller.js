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
  res.status(status).json({ message });
};

const validateFields = (fields) => {
  return Object.values(fields).every(
    (field) => field !== undefined && field !== null
  );
};

const crearEquipo = async (req, res) => {
  console.log(req.body.fechaCompraEquipo);
  const {
    nombreTipoEquipo,
    modeloEquipo,
    marcaEquipo,
    especificacionesEquipo,
    estadoEquipo,
    fechaCompraEquipo,
  } = req.body;

  const fields = {
    nombreTipoEquipo,
    modeloEquipo,
    marcaEquipo,
    especificacionesEquipo,
    estadoEquipo,
    fechaCompraEquipo,
  };

  if (!validateFields(fields)) {
    return res.status(400).json({ message: ERROR_MESSAGES.REQUIRED_FIELDS });
  }

  try {
    const equipoNuevo = await Equipo.crear(fields);
    res.status(201).json({
      message: "El equipo se creó con éxito",
      equipoId: equipoNuevo.insertId,
    });
  } catch (error) {
    handleError(res, 500, ERROR_MESSAGES.CREATION_ERROR, error);
  }
};

const consultarEquipo = async (req, res) => {
  try {
    const equipos = await Equipo.obtenerTodos();
    res.status(200).json(equipos);
  } catch (error) {
    handleError(res, 500, ERROR_MESSAGES.RETRIEVAL_ERROR, error);
  }
};

const actualizarEquipo = async (req, res) => {
  const idEquipo = req.params.id;

  console.log("ID RECIBIDO: ", idEquipo);

  const {
    nombreTipoEquipo,
    modeloEquipo,
    marcaEquipo,
    estadoEquipo,
    fechaCompraEquipo,
  } = req.body;

  const fields = {
    nombreTipoEquipo,
    modeloEquipo,
    marcaEquipo,
    estadoEquipo,
    fechaCompraEquipo,
  };

  try {
    // Obtener el equipo actual desde la base de datos
    const equipoExistente = await Equipo.obtenerPorId(idEquipo);

    // Si no existe el equipo, retornar error
    if (!equipoExistente || equipoExistente.length === 0) {
      return res
        .status(404)
        .json({ message: ERROR_MESSAGES.EQUIPMENT_NOT_FOUND });
    }

    // Filtrar solo los campos modificados
    const camposModificados = {};
    Object.keys(fields).forEach((key) => {
      if (fields[key] !== equipoExistente[0][key]) {
        camposModificados[key] = fields[key];
      }
    });

    // Si no hay campos modificados, retornar mensaje de sin cambios
    if (Object.keys(camposModificados).length === 0) {
      return res
        .status(200)
        .json({ message: "No se realizaron cambios en el equipo." });
    }

    // Actualizar solo los campos modificados
    const equipoActualizado = await Equipo.actualizar(
      idEquipo,
      camposModificados
    );

    if (equipoActualizado.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: ERROR_MESSAGES.EQUIPMENT_NOT_FOUND });
    }

    res.status(200).json({ message: "Equipo actualizado con éxito." });
  } catch (error) {
    handleError(res, 500, ERROR_MESSAGES.UPDATE_ERROR, error);
  }
};

const eliminarEquipo = async (req, res) => {
  const idEquipo = req.params.id;
  console.log(idEquipo);
  if (!idEquipo) {
    return res.status(400).json({ message: "El ID del equipo es requerido." });
  }

  try {
    const equipoEliminado = await Equipo.eliminar(idEquipo);

    if (equipoEliminado.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: ERROR_MESSAGES.EQUIPMENT_NOT_FOUND });
    }

    res.status(200).json({ message: "Equipo eliminado con éxito." });
  } catch (error) {
    handleError(res, 500, ERROR_MESSAGES.DELETE_ERROR, error);
  }
};

module.exports = {
  crearEquipo,
  consultarEquipo,
  actualizarEquipo,
  eliminarEquipo,
};

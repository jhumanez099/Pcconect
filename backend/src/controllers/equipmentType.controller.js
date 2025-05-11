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
  const { nombreTipoEquipo } = req.body;

  if (!validateFields({ nombreTipoEquipo })) {
    return res.status(400).json({ message: ERROR_MESSAGES.REQUIRED_FIELDS });
  }

  try {
    const tipoEquipoNuevo = await TipoEquipo.crear(nombreTipoEquipo);

    res.status(201).json({
      message: "El tipo de equipo se creó con éxito",
      tipoEquipoId: tipoEquipoNuevo.insertId,
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
    const tiposEquipos = await TipoEquipo.obtenerTodos();
    res.status(200).json(tiposEquipos);
  } catch (error) {
    handleError(res, 500, ERROR_MESSAGES.RETRIEVAL_ERROR, error);
  }
};

const actualizarTipoEquipo = async (req, res) => {
  const idTipoEquipo = req.params.id;
  const { nombreTipoEquipo } = req.body;

  try {
    // Obtener el tipo equipo actual desde la base de datos
    const tipoEquipoExistente = await TipoEquipo.obtenerPorId(idTipoEquipo);

    // Si no existe el tipo equipo, retornar error
    if (!tipoEquipoExistente || tipoEquipoExistente.length === 0) {
      return res
        .status(404)
        .json({ message: ERROR_MESSAGES.EQUIPMENT_TYPE_NOT_FOUND });
    }

    // Filtrar solo los campos modificados
    const camposModificados = {};

    // Comprobar si el nombre del tipo equipo ha cambiado
    if (
      nombreTipoEquipo &&
      nombreTipoEquipo !== tipoEquipoExistente[0].nombreTipoEquipo
    ) {
      camposModificados.nombreTipoEquipo = nombreTipoEquipo; // Solo agregar los campos que cambian
    }

    // Si no hay campos modificados, retornar mensaje de sin cambios
    if (Object.keys(camposModificados).length === 0) {
      return res
        .status(200)
        .json({ message: "No se realizaron cambios en el tipo de equipo." });
    }

    // Actualizar solo los campos modificados
    const tipoEquipoActualizado = await TipoEquipo.actualizar(
      idTipoEquipo,
      camposModificados
    );

    if (tipoEquipoActualizado.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: ERROR_MESSAGES.EQUIPMENT_TYPE_NOT_FOUND });
    }

    res.status(200).json({ message: "Tipo del equipo actualizado con éxito." });
  } catch (error) {
    handleError(res, 500, ERROR_MESSAGES.UPDATE_ERROR, error);
  }
};


const eliminarTipoEquipo = async (req, res) => {
  const idTipoEquipo = req.params.id;

  if (!idTipoEquipo) {
    return res
      .status(400)
      .json({ message: "El ID del tipo de equipo es requerido." });
  }

  try {
    const tipoEquipoEliminado = await TipoEquipo.eliminar(idTipoEquipo);

    if (tipoEquipoEliminado.affectedRows === 0) {
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

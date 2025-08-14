const pool = require("../config/db.js");

const TipoEquipo = {
  // Crear tipo de equipo
  async crear(fields) {
    const query = `
      INSERT INTO tipo_equipo (nombre_tipo_equipo)
      VALUES (?)
    `;
    const [result] = await pool.query(query, [fields.nombre_tipo_equipo]);
    return result;
  },

  // Obtener todos los tipos
  async obtenerTodos() {
    const [tiposEquipos] = await pool.query(
      "SELECT * FROM tipo_equipo ORDER BY id_tipo_equipo DESC"
    );
    return tiposEquipos;
  },

  // Obtener uno por ID
  async obtenerPorId(id) {
    const query = `
      SELECT * FROM tipo_equipo
      WHERE id_tipo_equipo = ?
      LIMIT 1
    `;
    const [tipoEquipo] = await pool.query(query, [id]);
    return tipoEquipo;
  },

  // Actualizar dinámicamente
  async actualizar(id, fields) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);

    if (keys.length === 0) {
      return { affectedRows: 0 }; // No hay cambios
    }

    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const query = `UPDATE tipo_equipo SET ${setClause} WHERE id_tipo_equipo = ?`;
    const [result] = await pool.query(query, [...values, id]);
    return result;
  },

  // Eliminar
  async eliminar(id) {
    const query = "DELETE FROM tipo_equipo WHERE id_tipo_equipo = ? LIMIT 1";
    const [result] = await pool.query(query, [id]);
    return result;
  },
};

module.exports = TipoEquipo;

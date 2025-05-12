const pool = require("../config/db.js");

const TipoEquipo = {
  async crear(fields) {
    const query = `
      INSERT INTO tipo_equipo(nombre_tipo_equipo)
      VALUES (?)
    `;
    const [result] = await pool.query(query, [fields.nombre_tipo_equipo]);
    return result;
  },

  async obtenerTodos() {
    const [tiposEquipos] = await pool.query("SELECT * FROM tipo_equipo");
    return tiposEquipos;
  },

  async obtenerPorId(id) {
    const query = "SELECT * FROM tipo_equipo WHERE id_tipo_equipo = ? LIMIT 1";
    const [tipoEquipo] = await pool.query(query, [id]);
    return tipoEquipo;
  },

  async actualizar(id, fields) {
    const query = `
      UPDATE tipo_equipo 
      SET nombre_tipo_equipo = ?
      WHERE id_tipo_equipo = ?
    `;
    const [result] = await pool.query(query, [fields.nombre_tipo_equipo, id]);
    return result;
  },

  async eliminar(id) {
    const query = "DELETE FROM tipo_equipo WHERE id_tipo_equipo = ? LIMIT 1";
    const [result] = await pool.query(query, [id]);
    return result;
  },
};

module.exports = TipoEquipo;

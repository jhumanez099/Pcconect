const pool = require("../config/db.js");

const Equipo = {
  async crear(fields) {
    const sql = `
      INSERT INTO equipos (
        id_tipo_equipo,
        modelo_equipo,
        marca_equipo,
        especificaciones_equipo,
        fecha_compra_equipo,
        estado_equipo
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(sql, Object.values(fields));
    return result;
  },

  async obtenerTodos() {
    const sql = `
      SELECT e.*, t.nombre_tipo_equipo
      FROM equipos e
      JOIN tipo_equipo t ON e.id_tipo_equipo = t.id_tipo_equipo
      ORDER BY e.id_equipo DESC
    `;
    const [rows] = await pool.query(sql);
    return rows;
  },

  async obtenerPorId(id) {
    const sql = "SELECT * FROM equipos WHERE id_equipo = ?";
    const [rows] = await pool.query(sql, [id]);
    return rows;
  },

  async actualizar(id, fields) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    if (keys.length === 0) return { affectedRows: 0 };

    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const sql = `UPDATE equipos SET ${setClause} WHERE id_equipo = ?`;

    const [result] = await pool.query(sql, [...values, id]);
    return result;
  },

  async eliminar(id) {
    const sql = "DELETE FROM equipos WHERE id_equipo = ?";
    const [result] = await pool.query(sql, [id]);
    return result;
  },
};

module.exports = Equipo;

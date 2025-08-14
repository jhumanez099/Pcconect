const pool = require("../config/db.js");

const TipoUsuario = {
  async crear(fields) {
    const query = "INSERT INTO tipo_usuario (nombre_tipo_usuario) VALUES (?)";
    const [result] = await pool.query(query, [fields.nombre_tipo_usuario]);
    return result;
  },

  async obtenerTodos() {
    const [rows] = await pool.query(
      "SELECT * FROM tipo_usuario ORDER BY id_tipo_usuario DESC"
    );
    return rows;
  },

  async obtenerPorId(id) {
    const query =
      "SELECT * FROM tipo_usuario WHERE id_tipo_usuario = ? LIMIT 1";
    const [rows] = await pool.query(query, [id]);
    return rows;
  },

  async actualizar(id, fields) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    if (keys.length === 0) return { affectedRows: 0 };

    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const query = `UPDATE tipo_usuario SET ${setClause} WHERE id_tipo_usuario = ?`;
    const [result] = await pool.query(query, [...values, id]);
    return result;
  },

  async eliminar(id) {
    const query = "DELETE FROM tipo_usuario WHERE id_tipo_usuario = ? LIMIT 1";
    const [result] = await pool.query(query, [id]);
    return result;
  },
};

module.exports = TipoUsuario;

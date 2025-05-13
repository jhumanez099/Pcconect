const pool = require("../config/db");

const Usuario = {
  async crear(fields) {
    const query = `
      INSERT INTO usuarios (
        nombre_usuario,
        correo_usuario,
        contraseña_usuario,
        telefono_usuario,
        cargo_usuario,
        estado_usuario,
        id_tipo_usuario
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, Object.values(fields));
    return result;
  },

  async obtenerTodos() {
    const query = `
      SELECT u.*, tu.nombre_tipo_usuario
      FROM usuarios u
      JOIN tipo_usuario tu ON u.id_tipo_usuario = tu.id_tipo_usuario
    `;
    const [rows] = await pool.query(query);
    return rows;
  },

  async obtenerPorId(id) {
    const query = "SELECT * FROM usuarios WHERE id_usuario = ?";
    const [rows] = await pool.query(query, [id]);
    return rows;
  },

  async actualizar(id, fields) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    if (keys.length === 0) return { affectedRows: 0 };

    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const query = `UPDATE usuarios SET ${setClause} WHERE id_usuario = ?`;

    const [result] = await pool.query(query, [...values, id]);
    return result;
  },

  async eliminar(id) {
    const query = "DELETE FROM usuarios WHERE id_usuario = ?";
    const [result] = await pool.query(query, [id]);
    return result;
  },
};

module.exports = Usuario;

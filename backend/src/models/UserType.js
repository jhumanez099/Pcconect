const pool = require("../config/db.js");

const TipoUsuario = {
  // Crear un tipo de usuario
  async crear(fields) {
    const query = "INSERT INTO tipo_usuario (nombre_tipo_usuario) VALUES (?)";
    const [result] = await pool.query(query, [fields.nombre_tipo_usuario]);
    return result;
  },

  // Obtener todos los tipos de usuario
  async obtenerTodos() {
    const query = "SELECT * FROM tipo_usuario";
    const [tiposUsuarios] = await pool.query(query);
    return tiposUsuarios;
  },

  // Obtener un tipo de usuario por ID
  async obtenerPorId(id) {
    const query =
      "SELECT * FROM tipo_usuario WHERE id_tipo_usuario = ? LIMIT 1";
    const [tipoUsuario] = await pool.query(query, [id]);
    return tipoUsuario;
  },

  // Actualizar tipo de usuario (dinámico)
  async actualizar(id, fields) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);

    if (keys.length === 0) return { affectedRows: 0 };

    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const query = `UPDATE tipo_usuario SET ${setClause} WHERE id_tipo_usuario = ?`;

    const [result] = await pool.query(query, [...values, id]);
    return result;
  },

  // Eliminar un tipo de usuario
  async eliminar(id) {
    const query = "DELETE FROM tipo_usuario WHERE id_tipo_usuario = ? LIMIT 1";
    const [result] = await pool.query(query, [id]);
    return result;
  },
};

module.exports = TipoUsuario;

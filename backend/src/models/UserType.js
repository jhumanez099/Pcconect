const pool = require("../config/db.js");

const TipoUsuario = {
  // Crear un tipo de usuario
  async crear(nombreTipoUsuario) {
    const query = "INSERT INTO tipo_usuario(nombre_tipo_usuario) VALUES (?)";
    const [result] = await pool.query(query, [nombreTipoUsuario]);
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
    const query = "SELECT * FROM tipo_usuario WHERE id_tipo_usuario = ?";
    const [tipoUsuario] = await pool.query(query, [id]);
    return tipoUsuario;
  },

  // Actualizar un tipo de usuario
  async actualizar(id, nombreTipoUsuario) {
    const query =
      "UPDATE tipo_usuario SET nombre_tipo_usuario = ? WHERE id_tipo_usuario = ?";
    const [result] = await pool.query(query, [nombreTipoUsuario, id]);
    return result;
  },

  // Eliminar un tipo de usuario
  async eliminar(id) {
    const query = "DELETE FROM tipo_usuario WHERE id_tipo_usuario = ?";
    const [result] = await pool.query(query, [id]);
    return result;
  },
};

module.exports = TipoUsuario;

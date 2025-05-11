const pool = require("../config/db.js");

const Usuario = {
  async crear(fields) {
    const query = `
      INSERT INTO usuarios (
        id_tipo_usuario, nombre_usuario, correo_usuario, contraseña_usuario,
        telefono_usuario, cargo_usuario, estado_usuario
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
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
    const [usuarios] = await pool.query(query);
    return usuarios;
  },

  async obtenerPorId(id) {
    const query = `
      SELECT u.*, tu.nombre_tipo_usuario
      FROM usuarios u
      JOIN tipo_usuario tu ON u.id_tipo_usuario = tu.id_tipo_usuario
      WHERE u.id_usuario = ?
      LIMIT 1
    `;
    const [usuario] = await pool.query(query, [id]);
    return usuario;
  },

  async actualizar(id, fields) {
    const query = `
      UPDATE usuarios
      SET 
        id_tipo_usuario = ?, 
        nombre_usuario = ?, 
        correo_usuario = ?, 
        contraseña_usuario = ?, 
        telefono_usuario = ?, 
        cargo_usuario = ?, 
        estado_usuario = ?
      WHERE id_usuario = ?
    `;
  
    const valores = [
      fields.id_tipo_usuario,
      fields.nombre_usuario,
      fields.correo_usuario,
      fields.contraseña_usuario,
      fields.telefono_usuario,
      fields.cargo_usuario,
      fields.estado_usuario,
      id
    ];
  
    const [result] = await pool.query(query, valores);
    return result;
  },

  async eliminar(id) {
    const [result] = await pool.query(
      "DELETE FROM usuarios WHERE id_usuario = ?",
      [id]
    );
    return result;
  },
};

module.exports = Usuario;

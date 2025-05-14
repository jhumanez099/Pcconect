// src/models/User.js
const pool = require("../config/db.js");

const Usuario = {
  // ✅ Crear un nuevo usuario
  async crear(fields) {
    const query = `
      INSERT INTO usuarios (
        id_tipo_usuario, nombre_usuario, correo_usuario, contraseña_usuario,
        telefono_usuario, cargo_usuario, estado_usuario
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [
      fields.id_tipo_usuario,
      fields.nombre_usuario,
      fields.correo_usuario,
      fields.contraseña_usuario,
      fields.telefono_usuario,
      fields.cargo_usuario,
      fields.estado_usuario,
    ]);

    return { insertId: result.insertId };
  },

  async obtenerTodos() {
    const sql = `
      SELECT u.*, t.nombre_tipo_usuario
      FROM usuarios u
      JOIN tipo_usuario t ON u.id_tipo_usuario = t.id_tipo_usuario
    `;
    const [rows] = await pool.query(sql);
    return rows;
  },

  // ✅ Obtener usuario por correo (para login)
  async obtenerPorCorreo(correo_usuario) {
    const query = `
      SELECT * FROM usuarios 
      WHERE correo_usuario = ?
      LIMIT 1
    `;
    const [usuario] = await pool.query(query, [correo_usuario]);
    return usuario.length > 0 ? usuario[0] : null;
  },

  // ✅ Obtener usuario por ID
  async obtenerPorId(id) {
    const query = `
      SELECT * FROM usuarios 
      WHERE id_usuario = ?
      LIMIT 1
    `;
    const [usuario] = await pool.query(query, [id]);
    return usuario.length > 0 ? usuario[0] : null;
  },

  // ✅ Actualizar usuario (opcional)
  async actualizar(id, fields) {
    const query = `
      UPDATE usuarios
      SET 
        nombre_usuario = ?, 
        correo_usuario = ?, 
        contraseña_usuario = ?, 
        telefono_usuario = ?, 
        cargo_usuario = ?, 
        estado_usuario = ?
      WHERE id_usuario = ?
    `;
    const valores = [
      fields.nombre_usuario,
      fields.correo_usuario,
      fields.contraseña_usuario,
      fields.telefono_usuario,
      fields.cargo_usuario,
      fields.estado_usuario,
      id,
    ];

    const [result] = await pool.query(query, valores);
    return result;
  },

  // ✅ Eliminar usuario (opcional)
  async eliminar(id) {
    const query = `
      DELETE FROM usuarios 
      WHERE id_usuario = ?
    `;
    const [result] = await pool.query(query, [id]);
    return result;
  },
};

module.exports = Usuario;

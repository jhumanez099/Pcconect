const pool = require("../config/db.js");

const Usuario = {
  // Crear un usuario
  async crear(fields) {
    const query = `
      INSERT INTO 
        usuarios (id_tipo_usuario, nombre_usuario, correo_usuario, contraseña_usuario, telefono_usuario, cargo_usuario, estado_usuario) 
      VALUES 
        (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, Object.values(fields));
    return result;
  },

  // Consultar todos los usuarios
  async obtenerTodos() {
    const query = `
      SELECT 
        u.*, tu.nombre_tipo_usuario
      FROM 
        usuarios u
      JOIN 
        tipo_usuario tu ON u.id_tipo_usuario = tu.id_tipo_usuario
    `;
    const [usuarios] = await pool.query(query);
    return usuarios;
  },

  // Consultar un usuario por ID
  async obtenerPorId(id) {
    const query = `
      SELECT 
        u.*, tu.*
      FROM 
        usuarios u
      JOIN 
        tipo_usuario tu ON u.id_tipo_usuario = tu.id_tipo_usuario
      WHERE 
        u.id_usuario = ? 
      LIMIT 
        1
    `;
    const [usuario] = await pool.query(query, [id]);
    return usuario;
  },

  // Actualizar un usuario
  async actualizar(id, fields) {
    const query = `
      UPDATE 
        usuarios 
      SET 
        id_tipo_usuario = ?, nombre_usuario = ?, correo_usuario = ?, contraseña_usuario = ?, telefono_usuario = ?, cargo_usuario = ?, estado_usuario = ? 
      WHERE 
        id_usuario = ?
    `;
    const [result] = await pool.query(query, [...Object.values(fields), id]);
    return result;
  },

  // Eliminar un usuario
  async eliminar(id) {
    const query = "DELETE FROM usuarios WHERE id_usuario = ? LIMIT 1";
    const [result] = await pool.query(query, [id]);
    return result;
  },

  // Encontrar usuario por correo
  async obtenerPorCorreo(correo) {
    const query = `
    SELECT 
      correo_usuario AS correoUsuario, contraseña_usuario AS contraseñaUsuario, id_usuario AS idUsuario, nombre_usuario AS nombreUsuario
    FROM
      usuarios
    WHERE
      correo_usuario = ?
  `;
    const [result] = await pool.query(query, [correo]);
    return result.length > 0 ? result[0] : null;
  },
};



module.exports = Usuario;

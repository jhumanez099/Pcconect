const pool = require("../config/db.js");

const Cliente = {
  // Crear un cliente
  async crear(fields) {
    const query = `
      INSERT INTO clientes (
        nombre_cliente,
        direccion_cliente,
        telefono_cliente,
        correo_cliente,
        encargado_cliente,
        estado_cliente
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, Object.values(fields));
    return result;
  },

  // Obtener todos los clientes
  async obtenerTodos() {
    const [clientes] = await pool.query("SELECT * FROM clientes");
    return clientes;
  },

  // Obtener un cliente por ID
  async obtenerPorId(id) {
    const query = `
      SELECT * FROM clientes
      WHERE id_cliente = ?
      LIMIT 1
    `;
    const [cliente] = await pool.query(query, [id]);
    return cliente;
  },

  // Actualizar dinámicamente un cliente
  async actualizar(id, fields) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);

    if (keys.length === 0) {
      return { affectedRows: 0 }; // No hay cambios
    }

    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const query = `UPDATE clientes SET ${setClause} WHERE id_cliente = ?`;

    const [result] = await pool.query(query, [...values, id]);
    return result;
  },

  // Eliminar cliente
  async eliminar(id) {
    const query = "DELETE FROM clientes WHERE id_cliente = ? LIMIT 1";
    const [result] = await pool.query(query, [id]);
    return result;
  },
};

module.exports = Cliente;

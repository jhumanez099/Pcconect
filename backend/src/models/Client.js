const pool = require("../config/db.js");

const Cliente = {
  // Crear un cliente
  async crear(fields) {
    const query = `
      INSERT INTO 
        clientes(nombre_cliente, direccion_cliente, telefono_cliente, correo_cliente, encargado_cliente, estado_cliente)
      VALUES 
        (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, Object.values(fields));
    return result;
  },

  // Consultar todos los clientes
  async obtenerTodos() {
    const [clientes] = await pool.query("SELECT * FROM clientes");
    return clientes;
  },

  // Consultar un cliente por ID
  async obtenerPorId(id) {
    const [cliente] = await pool.query(
      "SELECT * FROM clientes WHERE id_cliente = ? LIMIT 1",
      [id]
    );
    return cliente;
  },

  // Actualizar un cliente
  async actualizar(id, fields) {
    const query = `
      UPDATE 
        clientes 
      SET 
        nombre_cliente = ?, direccion_cliente = ?, telefono_cliente = ?, correo_cliente = ?, encargado_cliente = ?, estado_cliente = ?
      WHERE 
        id_cliente = ?
    `;
    const [result] = await pool.query(query, [...Object.values(fields), id]);
    return result;
  },

  // Eliminar un cliente
  async eliminar(id) {
    const [result] = await pool.query(
      "DELETE FROM clientes WHERE id_cliente = ? LIMIT 1",
      [id]
    );
    return result;
  },
};

module.exports = Cliente;

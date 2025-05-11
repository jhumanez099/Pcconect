const pool = require("../config/db.js");

const Pedido = {
  // Crear un pedido
  async crear(fields) {
    const query = `
      INSERT INTO
        pedidos (fecha_pedido, fecha_inicio_pedido, fecha_fin_pedido, precio_total_pedido, estado_pedido, id_cliente, id_usuario, id_tipo_pedido, motivo_pedido) 
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, Object.values(fields));
    return result;
  },

  // Consultar todos los pedidos
  async obtenerTodos() {
    const query = `
      SELECT 
        p.*, c.nombre_cliente, u.nombre_usuario, t.nombre_tipo_pedido 
      FROM 
        pedidos p
      JOIN 
        clientes c ON c.id_cliente = p.id_cliente
      JOIN 
        usuarios u ON u.id_usuario = p.id_usuario
      JOIN 
        tipo_pedido t ON t.id_tipo_pedido = p.id_tipo_pedido
    `;
    const [pedidos] = await pool.query(query);
    return pedidos;
  },

  // Consultar un pedido por ID
  async obtenerPorId(id) {
    const query = `
      SELECT 
        p.*, c.nombre_cliente, u.nombre_usuario, t.nombre_tipo_pedido 
      FROM 
        pedidos p
      JOIN 
        clientes c ON c.id_cliente = p.id_cliente
      JOIN 
        usuarios u ON u.id_usuario = p.id_usuario
      JOIN 
        tipo_pedido t ON t.id_tipo_pedido = p.id_tipo_pedido
      WHERE 
        p.id_pedido = ?
      LIMIT 
        1
    `;
    const [pedido] = await pool.query(query, [id]);
    return pedido;
  },

  // Actualizar un pedido
  async actualizar(id, fields) {
    const query = `
      UPDATE 
        pedidos 
      SET 
        fecha_pedido = ?, fecha_inicio_pedido = ?, fecha_fin_pedido = ?, precio_total_pedido = ?, estado_pedido = ?, id_cliente = ?, id_usuario = ?, id_tipo_pedido = ?, motivo_pedido = ? 
      WHERE
        id_pedido = ?
    `;
    const [result] = await pool.query(query, [...Object.values(fields), id]);
    return result;
  },

  // Eliminar un pedido
  async eliminar(id) {
    const query = "DELETE FROM pedidos WHERE id_pedido = ? LIMIT 1";
    const [result] = await pool.query(query, [id]);
    return result;
  },
};

module.exports = Pedido;

const pool = require("../config/db.js");

const DetallePedido = {
  // Crear un detalle del pedido
  async crear(fields) {
    const query = `
      INSERT INTO detalle_pedido (id_pedido, id_equipo, cantidad_detalle_pedido, precio_unitario_detalle_pedido, subtotal_detalle_pedido, fecha_inicio_detalle_pedido, fecha_fin_detalle_pedido)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, Object.values(fields));
    return result;
  },

  // Obtener todos los detalles de pedidos
  async obtenerTodos() {
    const query = `
      SELECT d.*, e.modelo_equipo, e.marca_equipo, te.nombre_tipo_equipo 
      FROM detalle_pedido d 
      JOIN equipos e ON d.id_equipo = e.id_equipo
      JOIN tipo_equipo te ON e.id_tipo_equipo = te.id_tipo_equipo
    `;
    const [detalles] = await pool.query(query);
    return detalles;
  },

  // Obtener un detalle del pedido por ID
  async obtenerPorId(id) {
    const query = `
      SELECT d.*, e.*, te.*, p.*
      FROM detalle_pedido d 
      JOIN equipos e ON d.id_equipo = e.id_equipo
      JOIN tipo_equipo te ON e.id_tipo_equipo = te.id_tipo_equipo
      JOIN pedidos p ON e.id_pedido = d.id_pedido
      WHERE d.id_detalle_pedido = ?
      LIMIT 1
    `;
    const [detalle] = await pool.query(query, [id]);
    return detalle;
  },

  // Actualizar un detalle del pedido
  async actualizar(id, fields) {
    const query = `
      UPDATE detalle_pedido 
      SET id_pedido = ?, id_equipo = ?, cantidad_detalle_pedido = ?, precio_unitario_detalle_pedido = ?, subtotal_detalle_pedido = ?, fecha_inicio_detalle_pedido = ?, fecha_fin_detalle_pedido = ?
      WHERE id_detalle_pedido = ?
    `;
    const [result] = await pool.query(query, [...Object.values(fields), id]);
    return result;
  },

  // Eliminar un detalle del pedido
  async eliminar(id) {
    const query = "DELETE FROM detalle_pedido WHERE id_detalle_pedido = ? LIMIT 1";
    const [result] = await pool.query(query, [id]);
    return result;
  },
};

module.exports = DetallePedido;

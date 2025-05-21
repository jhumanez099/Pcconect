const pool = require("../config/db.js");

const Pedido = {
  // ✅ Crear un nuevo pedido
  async crear(fields) {
    const query = `
      INSERT INTO pedidos (
        fecha_inicio_pedido, fecha_fin_pedido, precio_total_pedido, 
        estado_pedido, id_cliente, id_usuario, id_tipo_pedido, motivo_pedido
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [
      fields.fecha_inicio_pedido,
      fields.fecha_fin_pedido,
      fields.precio_total_pedido,
      fields.estado_pedido,
      fields.id_cliente,
      fields.id_usuario,
      fields.id_tipo_pedido,
      fields.motivo_pedido,
    ]);
    return result;
  },

  // ✅ Consultar todos los pedidos
  async obtenerTodos() {
    const query = `
      SELECT 
        p.*, c.nombre_cliente, u.nombre_usuario, t.nombre_tipo_pedido 
      FROM pedidos p
      JOIN clientes c ON c.id_cliente = p.id_cliente
      JOIN usuarios u ON u.id_usuario = p.id_usuario
      JOIN tipo_pedido t ON t.id_tipo_pedido = p.id_tipo_pedido
    `;
    const [pedidos] = await pool.query(query);
    return pedidos;
  },

  // ✅ Consultar un pedido por ID
  async obtenerPorId(id) {
    const query = `
      SELECT 
        p.*, c.nombre_cliente, u.nombre_usuario, t.nombre_tipo_pedido 
      FROM pedidos p
      JOIN clientes c ON c.id_cliente = p.id_cliente
      JOIN usuarios u ON u.id_usuario = p.id_usuario
      JOIN tipo_pedido t ON t.id_tipo_pedido = p.id_tipo_pedido
      WHERE p.id_pedido = ?
      LIMIT 1
    `;
    const [pedido] = await pool.query(query, [id]);
    return pedido.length > 0 ? pedido[0] : null;
  },

  // ✅ Actualizar pedido
  async actualizar(id, campos) {
    const columnasValidas = [
      "fecha_inicio_pedido",
      "fecha_fin_pedido",
      "precio_total_pedido",
      "estado_pedido",
      "id_cliente",
      "id_usuario",
      "id_tipo_pedido",
      "motivo_pedido",
    ];

    const keys = Object.keys(campos).filter((key) =>
      columnasValidas.includes(key)
    );
    const values = keys.map((key) => campos[key]);

    if (keys.length === 0) return { affectedRows: 0 };

    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const query = `UPDATE pedidos SET ${setClause} WHERE id_pedido = ?`;

    const [result] = await pool.query(query, [...values, id]);
    return result;
  },

  // ✅ Eliminar pedido
  async eliminar(id) {
    const query = "DELETE FROM pedidos WHERE id_pedido = ? LIMIT 1";
    const [result] = await pool.query(query, [id]);
    return result;
  },

  // ✅ Insertar
  async insertarDetalle({
    id_pedido,
    id_equipo,
    cantidad,
    precio_unitario,
    subtotal,
    fecha_inicio,
    fecha_fin,
  }) {
    const query = `
      INSERT INTO detalle_pedido (
        id_pedido, id_equipo, cantidad_detalle_pedido, 
        precio_unitario_detalle_pedido, subtotal_detalle_pedido,
        fecha_inicio_detalle_pedido, fecha_fin_detalle_pedido
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [
      id_pedido,
      id_equipo,
      cantidad,
      precio_unitario,
      subtotal,
      fecha_inicio,
      fecha_fin,
    ]);
    return result;
  },

  async obtenerDetallesPorIdPedido(id_pedido) {
    const query = `
      SELECT dp.*, e.modelo_equipo, e.marca_equipo
      FROM detalle_pedido dp
      JOIN equipos e ON dp.id_equipo = e.id_equipo
      WHERE dp.id_pedido = ?
    `;
    const [result] = await pool.query(query, [id_pedido]);
    return result;
  },

  async eliminarDetalle(id_detalle_pedido) {
    const query = `DELETE FROM detalle_pedido WHERE id_detalle_pedido = ? LIMIT 1`;
    const [result] = await pool.query(query, [id_detalle_pedido]);
    return result;
  },

  async eliminarDetallesPorPedido(id_pedido) {
    const query = `DELETE FROM detalle_pedido WHERE id_pedido = ?`;
    const [result] = await pool.query(query, [id_pedido]);
    return result;
  },  

  async actualizarDetalle({
    id_detalle_pedido,
    cantidad,
    precio_unitario,
    subtotal,
    fecha_inicio,
    fecha_fin,
  }) {
    const query = `
      UPDATE detalle_pedido
      SET cantidad_detalle_pedido = ?, 
          precio_unitario_detalle_pedido = ?, 
          subtotal_detalle_pedido = ?,
          fecha_inicio_detalle_pedido = ?,
          fecha_fin_detalle_pedido = ?
      WHERE id_detalle_pedido = ?
    `;
    const [result] = await pool.query(query, [
      cantidad,
      precio_unitario,
      subtotal,
      fecha_inicio,
      fecha_fin,
      id_detalle_pedido,
    ]);
    return result;
  },
};



module.exports = Pedido;

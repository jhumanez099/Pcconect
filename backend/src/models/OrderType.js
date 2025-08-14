const connection = require("../config/db");

const TipoPedido = {
  // Crear un tipo de pedido
  async crear(nombre_tipo_pedido) {
    const sql = "INSERT INTO tipo_pedido (nombre_tipo_pedido) VALUES (?)";
    const [result] = await connection.query(sql, [nombre_tipo_pedido]);
    return result;
  },

  // Obtener todos los tipos de pedido
  async obtenerTodos() {
    const sql = "SELECT * FROM tipo_pedido ORDER BY id_tipo_pedido DESC";
    const [rows] = await connection.query(sql);
    return rows;
  },

  // Obtener uno por ID
  async obtenerPorId(id) {
    const sql = "SELECT * FROM tipo_pedido WHERE id_tipo_pedido = ? LIMIT 1";
    const [rows] = await connection.query(sql, [id]);
    return rows;
  },

  // Actualizar dinámicamente
  async actualizar(id, campos) {
    const keys = Object.keys(campos);
    const values = Object.values(campos);

    if (keys.length === 0) return { affectedRows: 0 };

    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const sql = `UPDATE tipo_pedido SET ${setClause} WHERE id_tipo_pedido = ?`;

    const [result] = await connection.query(sql, [...values, id]);
    return result;
  },

  // Eliminar
  async eliminar(id) {
    const sql = "DELETE FROM tipo_pedido WHERE id_tipo_pedido = ?";
    const [result] = await connection.query(sql, [id]);
    return result;
  },
};

module.exports = TipoPedido;

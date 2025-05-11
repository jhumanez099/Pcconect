const pool = require("../config/db.js");

const TipoPedido = {
  // Crear un tipo de pedido
  async crear(nombreTipoPedido) {
    const query = "INSERT INTO tipo_pedido(nombre_tipo_pedido) VALUES (?)";
    const [result] = await pool.query(query, [nombreTipoPedido]);
    return result;
  },

  // Obtener todos los tipos de pedido
  async obtenerTodos() {
    const query = "SELECT * FROM tipo_pedido";
    const [tiposPedidos] = await pool.query(query);
    return tiposPedidos;
  },

  // Obtener un tipo de pedido por ID
  async obtenerPorId(id) {
    const query = "SELECT * FROM tipo_pedido WHERE id_tipo_pedido = ?";
    const [tipoPedido] = await pool.query(query, [id]);
    return tipoPedido;
  },

  // Actualizar un tipo de pedido
  async actualizar(id, nombreTipoPedido) {
    const query =
      "UPDATE tipo_pedido SET nombre_tipo_pedido = ? WHERE id_tipo_pedido = ?";
    const [result] = await pool.query(query, [nombreTipoPedido, id]);
    return result;
  },

  // Eliminar un tipo de pedido
  async eliminar(id) {
    const query = "DELETE FROM tipo_pedido WHERE id_tipo_pedido = ?";
    const [result] = await pool.query(query, [id]);
    return result;
  },
};

module.exports = TipoPedido;

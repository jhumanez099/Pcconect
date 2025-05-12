const connection = require("../config/db");

const crear = async (nombre_tipo_pedido) => {
  const sql = "INSERT INTO tipo_pedido (nombre_tipo_pedido) VALUES (?)";
  return await connection.query(sql, [nombre_tipo_pedido]);
};

const obtenerTodos = async () => {
  const sql = "SELECT * FROM tipo_pedido";
  const [rows] = await connection.query(sql);
  return rows;
};

const obtenerPorId = async (id) => {
  const sql = "SELECT * FROM tipo_pedido WHERE id_tipo_pedido = ?";
  const [rows] = await connection.query(sql, [id]);
  return rows;
};

const actualizar = async (id, campos) => {
  const camposSQL = Object.keys(campos)
    .map((key) => `${key} = ?`)
    .join(", ");

  const valores = Object.values(campos);

  const sql = `UPDATE tipo_pedido SET ${camposSQL} WHERE id_tipo_pedido = ?`;

  return await connection.query(sql, [...valores, id]);
};

const eliminar = async (id) => {
  const sql = "DELETE FROM tipo_pedido WHERE id_tipo_pedido = ?";
  return await connection.query(sql, [id]);
};

module.exports = {
  crear,
  obtenerTodos,
  obtenerPorId,
  actualizar,
  eliminar,
};

const pool = require('../db.js')

const getOrders = async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      pool.query('SELECT * FROM pedidos p, clientes c, productos pr, usuarios u WHERE c.id_cliente = p.id_cliente AND pr.id_producto = p.id_producto AND u.id_usuario = p.id_usuario', (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
    console.log('Pedidos consultados correctamente')
    res.json(result.rows)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error al consultar los pedidos' });
  }
}

const createOrders = async (req, res) => {
  const { id_producto, id_cliente, id_usuario, fecha_pedido, hora_pedido } = req.body

  try {
    const result = await new Promise((resolve, reject) => {
      pool.query('INSERT INTO pedidos (id_producto, id_cliente, id_usuario, fecha_pedido, hora_pedido) VALUES ($1, $2, $3, $4, $5) RETURNING *', [id_producto, id_cliente, id_usuario, fecha_pedido, hora_pedido], (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
    console.log('Pedido creado con exito')
    res.status(200).json({ message: 'El pedido se creo con éxito' });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al crear el pedido' });
  }
}

const getOnlyOrder = async (req, res) => {
  const { id_pedido } = req.params
  try {
    const result = await new Promise((resolve, reject) => {
      pool.query('SELECT * FROM pedidos WHERE c.id_cliente = p.id_cliente AND pr.id_producto = p.id_producto AND u.id_usuario = p.id_usuario AND id_pedido = $1', [id_pedido], (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
    if (result.rowCount === 0) return res.status(404).json({
      message: "Pedido no encontrado",
    })
    console.log('Pedido consultado con éxito');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al consultar el pedido' });
  }
}

const updateOrders = async (req, res) => {
  const { id_pedido } = req.params
  const { id_producto, id_cliente, id_usuario, fecha_pedido, hora_pedido, cantidad_pedido } = req.body
  try {
    const result = await new Promise((resolve, reject) => {
      pool.query('UPDATE pedidos SET id_producto = $1, id_cliente = $2, id_usuario = $3, fecha_pedido = $4, hora_pedido = $5, cantidad_pedido = $6 WHERE id_pedido = $7 RETURNING *', [id_producto, id_cliente, id_usuario, fecha_pedido, hora_pedido, cantidad_pedido, id_pedido], (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
    if (result.rowCount === 0) return res.status(404).json({
      message: "Pedido no encontrado",
    })
    console.log('Pedido actualizado con éxito', result.rows);
    res.status(200).json({ message: 'Pedido actualizado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el pedido' });
  }
}

const deleteOrders = async (req, res) => {
  const { id_pedido } = req.params
  try {
    const result = await new Promise((resolve, reject) => {
      pool.query('DELETE FROM pedidos WHERE id_pedido = $1', [id_pedido], (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
    if (result.rowCount === 0) return res.status(404).json({
      message: "Pedido no encontrado",
    })
    console.log('Pedido eliminado con éxito');
    res.json({ message: 'Pedido eliminado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el pedido' });
  }
}

module.exports = { getOrders, createOrders, getOnlyOrder, updateOrders, deleteOrders }
const pool = require('../db.js')

const getProducts = async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      pool.query('SELECT * FROM productos', (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
    console.log('Productos consultados correctamente')
    res.json(result.rows)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error al consultar los productos' });
  }
}

const createProducts = async (req, res) => {
  const { id_producto, nombre_producto, valor_actual, caracteristicas_producto } = req.body
  try {
    const result = await new Promise((resolve, reject) => {
      pool.query('INSERT INTO productos (id_producto, nombre_producto, valor_actual, caracteristicas_producto) VALUES ($1, $2, $3, $4) RETURNING *', [id_producto, nombre_producto, valor_actual, caracteristicas_producto], (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
    console.log('Producto creado con exito')
    res.status(200).json({ message: 'El producto se creo con éxito' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al crear el producto' });
  }
}

const getOnlyProduct = async (req, res) => {
  const { id_producto } = req.params
  try {
    const result = await new Promise((resolve, reject) => {
      pool.query('SELECT * FROM productos WHERE id_producto = $1', [id_producto], (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
    if (result.rowCount === 0) return res.status(404).json({
      message: "Producto no encontrado",
    })
    console.log('Producto consultado con éxito');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al consultar el producto' });
  }
}

const updateProducts = async (req, res) => {
  const { id } = req.params
  const { id_producto, nombre_producto, valor_actual, caracteristicas_producto } = req.body
  try {
    const result = await new Promise((resolve, reject) => {
      pool.query('UPDATE productos SET id_producto = $1, nombre_producto = $2, valor_actual = $3, caracteristicas_producto = $4 WHERE id_producto = $5 RETURNING *', [id_producto, nombre_producto, valor_actual, caracteristicas_producto, id], (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
    if (result.rowCount === 0) return res.status(404).json({
      message: "Producto no encontrado",
    })
    console.log('Producto actualizado con éxito', result.rows);
    res.status(200).json({ message: 'Producto actualizado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el producto' });
  }
}

const deleteProducts = async (req, res) => {
  const { id_producto } = req.params
  try {
    const result = await new Promise((resolve, reject) => {
      pool.query('DELETE FROM productos WHERE id_producto = $1', [id_producto], (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
    if (result.rowCount === 0) return res.status(404).json({
      message: "Producto no encontrado",
    })
    console.log('Producto eliminado con éxito');
    res.json({ message: 'Producto eliminado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el producto' });
  }
}

module.exports = { getOnlyProduct, getProducts, createProducts, updateProducts, deleteProducts }
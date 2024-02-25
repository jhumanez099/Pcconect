const pool = require('../db.js')

const getTypeClients = async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      pool.query('SELECT * FROM tipo_clientes', (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
    console.log('Tipos de clientes consultado correctamente')
    res.json(result.rows)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error al consultar los tipos de clientes' });
  }
}

const createTypeClients = async (req, res) => {
  const { clase_cliente } = req.body

  try {
    const result = await new Promise((resolve, reject) => {
      pool.query('INSERT INTO tipo_clientes (clase_cliente) VALUES ($1) RETURNING *', [clase_cliente], (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
    console.log('Tipo de cliente creado con exito')
    res.status(200).json({ message: 'El tipo de cliente se creo con éxito' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al crear el tipo de cliente' });
  }
}

const getOnlyTypeClients = async (req, res) => {
  const { clase_cliente } = req.params
  try {
    const result = await new Promise((resolve, reject) => {
      pool.query('SELECT * FROM tipo_clientes WHERE clase_cliente = $1', [clase_cliente], (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
    console.log('Tipo de cliente consultada con éxito');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al consultar el tipo de cliente' });
  }
}

const updateTypeClients = async (req, res) => {
  const { id_tipo_cliente } = req.params
  const { clase_cliente } = req.body
  try {
    const result = await new Promise((resolve, reject) => {
      pool.query('UPDATE tipo_clientes SET clase_cliente = $1 WHERE id_tipo_cliente = $2 RETURNING *', [clase_cliente, id_tipo_cliente], (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
    console.log('Tipo de cliente actualizado con éxito', result.rows);
    res.status(200).json({ message: 'Tipo de cliente actualizado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el tipo de cliente' });
  }
}

const deleteTypeClients = async (req, res) => {
  const {id_tipo_cliente} = req.params
  try {
    const result = await new Promise((resolve,reject) => {
      pool.query('DELETE FROM tipo_clientes WHERE id_tipo_cliente = $1', [id_tipo_cliente], (err,result) => {
        if(err){
          reject(err)
        }else{
          resolve(result)
        }
      })
    })
    console.log('Tipo de cliente eliminado con éxito');
    res.json({ message: 'Tipo de cliente eliminado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el tipo de cliente' });
  }
}

module.exports = { getTypeClients, createTypeClients, getOnlyTypeClients, updateTypeClients, deleteTypeClients }
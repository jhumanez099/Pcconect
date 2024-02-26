const pool = require('../db.js')

const getClients = async (req, res ) => {
  try {
    const result = await new Promise((resolve, reject) =>{
      pool.query('SELECT * FROM clientes', (err, result) => {
        if(err){
          reject(err)
        }else{
          resolve(result)
        }
      })
    }) 
    console.log('Clientes consultados correctamente')
    res.json(result.rows)
  } catch (error) {
    console.log(error)
    res.status(500).json({message: 'Error al consultar los clientes'});
  }
}

const createClients = async (req, res) => {
  const { tipo_cliente, nombre_empresa, nombre_representante_empresa, telefono, correo, ubicaciones, estado_cliente } = req.body

  try {
    const result = await new Promise((resolve, reject ) =>{
      pool.query('INSERT INTO clientes (id_tipo_cliente, nombre_empresa, nombre_representante_empresa, telefono, correo, ubicaciones, estado_cliente) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *', [tipo_cliente, nombre_empresa, nombre_representante_empresa, telefono, correo, ubicaciones, estado_cliente], (err, result) => {
        if(err){
          reject(err)
        }else{
          resolve(result)
        }
      })
    })
    console.log('Cliente creado con exito')
    res.status(200).json({ message: 'El cliente se creo con éxito' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al crear el cliente' });
  }
}

const getOnlyClients = async (req, res) => {
  const {nombre_empresa} = req.params
  try {
    const result = await new Promise((resolve, reject) => {
      pool.query('SELECT * FROM tipo_clientes tc, clientes c WHERE tc.id_tipo_cliente = c.id_tipo_cliente AND c.nombre_empresa = $1', [nombre_empresa], (err, result)=>{
        if(err){
          reject(err)
        }else{
          resolve(result)
        }
      })
    })
    if (result.rowCount === 0) return res.status(404).json({
      message: "Cliente no encontrado",
    })
    console.log('Cliente consultada con éxito');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al consultar el cliente' });
  }
}

const updateClients = async (req, res) =>{
  const {id_cliente} = req.params
  const { tipo_cliente, nombre_empresa, nombre_representante_empresa, telefono, correo, ubicaciones, estado_cliente } = req.body
  try {
    const result = await new Promise((resolve, reject) => {
      pool.query('UPDATE clientes SET id_tipo_cliente = $1, nombre_empresa = $2, nombre_representante_empresa = $3, telefono = $4, correo = $5, ubicaciones = $6, estado_cliente = $7 WHERE id_cliente = $8 RETURNING *', [tipo_cliente, nombre_empresa, nombre_representante_empresa, telefono, correo, ubicaciones, estado_cliente, id_cliente], (err, result) => {
        if(err){
          reject(err)
        }else{
          resolve(result)
        }
      })
    })
    if (result.rowCount === 0) return res.status(404).json({
      message: "Cliente no encontrado",
    })
    console.log('Cliente actualizado con éxito', result.rows);
    res.status(200).json({ message: 'Cliente actualizado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el cliente' });
  }
}

module.exports = {getClients, createClients, getOnlyClients, updateClients}
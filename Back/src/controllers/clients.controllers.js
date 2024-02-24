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
    console.log('Clientes consultado correctamente')
    res.json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({message: 'Error al consultar los clientes'});
  }
}

module.exports = {getClients}
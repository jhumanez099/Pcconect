const pool = require('../db.js')

const getUsers = async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      pool.query('SELECT * FROM usuarios', (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
    console.log('Usuarios consultados correctamente')
    res.json(result.rows)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error al consultar los usuarios' });
  }
}

const createUsers = async (req, res) => {
  const { nombres_usuario, apellidos_usuario, correo_usuario, telefono } = req.body

  try {
    const result = await new Promise((resolve, reject) => {
      pool.query('INSERT INTO usuarios (nombres_usuario, apellidos_usuario, correo_usuario, telefono) VALUES ($1, $2, $3, $4) RETURNING *', [nombres_usuario, apellidos_usuario, correo_usuario, telefono], (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
    console.log('Usuario creado con exito')
    res.status(200).json({ message: 'El usuario se creo con éxito' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al crear el usuario' });
  }
}

const getOnlyUser = async (req, res) => {
  const { id_usuario } = req.params
  try {
    const result = await new Promise((resolve, reject) => {
      pool.query('SELECT * FROM usuarios WHERE id_usuario = $1', [id_usuario], (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
    if (result.rowCount === 0) return res.status(404).json({
      message: "Usuario no encontrado",
    })
    console.log('Usuario consultado con éxito');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al consultar el usuario' });
  }
}

const updateUsers = async (req, res) => {
  const { id_usuario } = req.params
  const { nombres_usuario, apellidos_usuario, correo_usuario, telefono } = req.body
  try {
    const result = await new Promise((resolve, reject) => {
      pool.query('UPDATE usuarios SET nombres_usuario = $1, apellidos_usuario = $2, correo_usuario = $3, telefono = $4 WHERE id_usuario = $5 RETURNING *', [nombres_usuario, apellidos_usuario, correo_usuario, telefono, id_usuario], (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
    if (result.rowCount === 0) return res.status(404).json({
      message: "Usuario no encontrado",
    })
    console.log('Usuario actualizado con éxito', result.rows);
    res.status(200).json({ message: 'Usuario actualizado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
}

const deleteUsers = async (req, res) => {
  const { id_usuario } = req.params
  try {
    const result = await new Promise((resolve, reject) => {
      pool.query('DELETE FROM usuarios WHERE id_usuario = $1', [id_usuario], (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
    if (result.rowCount === 0) return res.status(404).json({
      message: "Usuario no encontrado",
    })
    console.log('Usuario eliminado con éxito');
    res.json({ message: 'Usuario eliminado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
}

module.exports = { getUsers, createUsers, getOnlyUser, updateUsers, deleteUsers }
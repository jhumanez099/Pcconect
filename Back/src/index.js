const app = require('./app.js')

const pool = require('./db')

const getPedidos = () => {
  pool.query('SELECT * FROM Pedidos')
}

getPedidos()
app.listen(3000)
console.log('Server on port', 3000)
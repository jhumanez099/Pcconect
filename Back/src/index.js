const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express()
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

const clients_routes = require('./routes/clients.routes')


app.use(clients_routes)

app.listen(3000, () =>{
  console.log('El servidor esta escuchando en el puerto: ', 'http://localhost:3000/')
})




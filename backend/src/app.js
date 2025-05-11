const express = require("express");
const morgan = require("morgan"); // Importa el módulo morgan (para el registro de solicitudes)
const cors = require("cors")
const cookieParser = require("cookie-parser");

// Importamos las rutas
const clienteRoutes = require("./routes/client.routes.js");
const tipoEquipoRoutes = require("./routes/equipmentType.routes.js");
const equipoRoutes = require("./routes/equipment.routes.js");
const tipoPedidoRoutes = require("./routes/orderType.routes.js");
const tipoUsuarioRoutes = require("./routes/userType.routes.js");
const usuarioRoutes = require("./routes/user.routes.js");
const pedidoRoutes = require("./routes/order.routes.js");
const detallePedidoRoutes = require("./routes/orderDetail.routes.js");
const authRoutes = require("./routes/auth.routes.js")

const app = express();

app.use(morgan("dev")); //Sirve para ver las peticiones que se le hacen al servidor
app.use(express.json()); // Habilita el middleware para analizar datos JSON en las solicitudes
app.use(cors());
app.use(cookieParser());


app.use('/api',clienteRoutes); //Utilizamos las rutas del CRUD de clientes
app.use('/api',tipoEquipoRoutes); //Utilizamos las rutas del CRUD de tipo de equipos
app.use('/api',equipoRoutes); //Utilizamos las rutas del CRUD de equipos
app.use('/api',tipoPedidoRoutes); //Utilizamos las rutas del CRUD de tipo de pedidos
app.use('/api',tipoUsuarioRoutes); //Utilizamos las rutas del CRUD de tipo de usuarios
app.use('/api',usuarioRoutes); //Utilizamos las rutas del CRUD de usuarios
app.use('/api',pedidoRoutes); //Utilizamos las rutas del CRUD de pedidos
app.use('/api',detallePedidoRoutes); //Utilizamos las rutas del CRUD de pedidos
app.use('/api',authRoutes); //Utilizamos las rutas para la autenticacion


module.exports = app;

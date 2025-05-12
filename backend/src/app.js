// src/app.js
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
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
const authRoutes = require("./routes/auth.routes.js");

const app = express();

// ✅ Middleware de Configuración
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// ✅ Configuración de CORS (Permitir Cookies)
app.use(
  cors({
    origin: "http://localhost:3000", // Cambia esto al dominio de tu frontend
    credentials: true, // ✅ Permitir el envío de cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Configurar las Rutas
app.use('/api', clienteRoutes);
app.use('/api', tipoEquipoRoutes);
app.use('/api', equipoRoutes);
app.use('/api', tipoPedidoRoutes);
app.use('/api', tipoUsuarioRoutes);
app.use('/api', usuarioRoutes);
app.use('/api', pedidoRoutes);
app.use('/api', detallePedidoRoutes);
app.use('/api', authRoutes);

// ✅ Manejo de errores (opcional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

module.exports = app;

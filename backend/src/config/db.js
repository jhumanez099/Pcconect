const mysql = require("mysql2");
require("dotenv").config(); // Asegúrate de cargar dotenv primero

// Configuración de la conexión con promesas
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Exportar el pool como promesa
module.exports = pool.promise();


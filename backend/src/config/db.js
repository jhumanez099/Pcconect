// src/config/db.js
const mysql = require("mysql2/promise");
require("dotenv").config(); // ✅ Asegúrate de cargar dotenv primero

console.log("✅ Verificando variables de entorno:");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);

// Verificar que las variables de entorno están cargadas
if (!process.env.DB_NAME) {
  console.error("❌ Error: No se ha especificado una base de datos (DB_NAME) en el archivo .env");
  process.exit(1); // Detener el servidor si no está configurado
}

// Configuración de la conexión con promesas
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, // ✅ Asegúrate de que esté configurado aquí
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Verificar conexión a la base de datos
pool.getConnection()
  .then(connection => {
    console.log(`✅ Conexión a la base de datos ${process.env.DB_NAME} establecida correctamente.`);
    connection.release();
  })
  .catch(error => {
    console.error("❌ Error al conectar con la base de datos:", error);
  });


module.exports = pool;

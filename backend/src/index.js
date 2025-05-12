// src/index.js
require("dotenv").config(); // ✅ Debe estar en la primera línea
const app = require('./app');

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${port}`);
});

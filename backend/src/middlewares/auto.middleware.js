// src/middlewares/auto.middleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // ✅ Verificar el token desde las cookies

  if (!token) {
    return res.status(401).json({ message: "Acceso no autorizado. No hay token." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido." });
  }
};

module.exports = authMiddleware;

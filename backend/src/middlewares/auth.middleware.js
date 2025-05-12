// src/middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // ✅ JWT en las cookies

  // ✅ Verificar si el token está presente
  if (!token) {
    return res.status(401).json({ message: "Acceso denegado. No has iniciado sesión." });
  }

  try {
    // ✅ Verificar el token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Guardar la información del usuario en la solicitud
    next(); // Continuar a la siguiente ruta
  } catch (error) {
    console.error("Error de autenticación:", error);
    return res.status(403).json({ message: "Token inválido o expirado." });
  }
};

module.exports = authMiddleware;

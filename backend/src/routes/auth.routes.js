// src/routes/auth.routes.js
const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auto.middleware"); // Asegúrate que el nombre coincida

// ✅ Ruta para Registrar Usuarios (Pública)
router.post("/register", register);

// ✅ Ruta para Iniciar Sesión (Pública)
router.post("/login", login);

// ✅ Ruta para Cerrar Sesión (Pública)
router.post("/logout", logout);

// ✅ Ruta Protegida (Requiere Autenticación)
router.get("/profile", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Perfil del usuario autenticado.",
    user: req.user, // Información del usuario extraída del JWT
  });
});

module.exports = router;

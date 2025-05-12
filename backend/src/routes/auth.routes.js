// src/routes/auth.routes.js
const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// ✅ Rutas Públicas
router.post("/register", register);
router.post("/login", login);

// ✅ Ruta de Logout (Pública)
router.post("/logout", logout);

// ✅ Ruta Protegida para el Perfil (Solo usuarios autenticados)
router.get("/profile", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Perfil del usuario autenticado.",
    user: req.user,
  });
});

module.exports = router;

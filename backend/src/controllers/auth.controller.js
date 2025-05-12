// src/controllers/auth.controller.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/User.js");

// ✅ Registro de Usuarios
const register = async (req, res) => {
  const { 
    nombre_usuario, 
    correo_usuario, 
    contraseña_usuario,
    telefono_usuario,
    cargo_usuario 
  } = req.body;

  if (!nombre_usuario || !correo_usuario || !contraseña_usuario) {
    return res.status(400).json({ message: "Todos los campos son obligatorios." });
  }

  try {
    // ✅ Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.obtenerPorCorreo(correo_usuario);
    if (usuarioExistente) {
      return res.status(400).json({ message: "El correo ya está registrado." });
    }

    // ✅ Encriptar la contraseña
    const contraseñaEncriptada = await bcrypt.hash(contraseña_usuario, 10);

    // ✅ Crear el usuario
    const nuevoUsuario = await Usuario.crear({
      id_tipo_usuario: 12, // Ajusta según tu lógica
      nombre_usuario,
      correo_usuario,
      contraseña_usuario: contraseñaEncriptada,
      telefono_usuario,
      cargo_usuario,
      estado_usuario: "activo"
    });

    // ✅ Iniciar sesión automáticamente (generar JWT)
    const token = jwt.sign(
      { id: nuevoUsuario.insertId, nombre: nombre_usuario },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Configurar la cookie del token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 día
    });

    res.status(201).json({ 
      message: "Usuario registrado y autenticado con éxito", 
      usuarioId: nuevoUsuario.insertId 
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
};
// ✅ Login de Usuarios (Sin cambios)
const login = async (req, res) => {
  const { correo_usuario, contraseña_usuario } = req.body;

  if (!correo_usuario || !contraseña_usuario) {
    return res.status(400).json({ message: "Correo y contraseña son requeridos." });
  }

  try {
    const usuario = await Usuario.obtenerPorCorreo(correo_usuario);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const contraseñaCorrecta = await bcrypt.compare(contraseña_usuario, usuario.contraseña_usuario);
    if (!contraseñaCorrecta) {
      return res.status(401).json({ message: "Contraseña incorrecta." });
    }

    const token = jwt.sign(
      { id: usuario.id_usuario, nombre: usuario.nombre_usuario },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Configurar la cookie del token (asegurarse de que SameSite sea "Lax")
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax", // ✅ Asegurar que la cookie esté disponible en el frontend
      maxAge: 24 * 60 * 60 * 1000, // 1 día
    });

    res.status(200).json({ message: "Usuario autenticado correctamente" });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};


// src/controllers/auth.controller.js
const logout = (req, res) => {
  // ✅ Limpiar la cookie del token JWT
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });

  res.status(200).json({ message: "Sesión cerrada correctamente." });
};


// ✅ Exportar las funciones
module.exports = {
  register,
  login,
  logout,
};

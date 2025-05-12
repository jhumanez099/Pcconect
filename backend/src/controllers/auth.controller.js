// src/controllers/auth.controller.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/User.js");

// ✅ Registro de Usuarios (Siempre como Auxiliar de pedidos)
const register = async (req, res) => {
  const { 
    nombre_usuario, 
    correo_usuario, 
    contraseña_usuario,
    telefono_usuario,
    cargo_usuario,
    estado_usuario 
  } = req.body;

  // ✅ Validar que los campos son obligatorios
  if (!nombre_usuario || !correo_usuario || !contraseña_usuario || !telefono_usuario || !cargo_usuario) {
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

    // ✅ Crear el usuario siempre como "Auxiliar de pedidos"
    const nuevoUsuario = await Usuario.crear({
      id_tipo_usuario: 12, // ✅ Siempre será "Auxiliar de pedidos"
      nombre_usuario,
      correo_usuario,
      contraseña_usuario: contraseñaEncriptada,
      telefono_usuario,
      cargo_usuario,
      estado_usuario: estado_usuario || "activo"
    });

    res.status(201).json({ 
      message: "Usuario registrado con éxito", 
      usuarioId: nuevoUsuario.insertId 
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
};

// ✅ Login de Usuarios (Sin cambios)
// ✅ Login de Usuarios (Mejorado)
const login = async (req, res) => {
  const { correo_usuario, contraseña_usuario } = req.body;

  // ✅ Verificar que los campos están presentes
  if (!correo_usuario || !contraseña_usuario) {
    return res.status(400).json({ message: "Correo y contraseña son requeridos." });
  }

  try {
    // ✅ Verificar si el usuario existe
    const usuario = await Usuario.obtenerPorCorreo(correo_usuario);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // ✅ Verificar la contraseña encriptada
    const contraseñaCorrecta = await bcrypt.compare(contraseña_usuario, usuario.contraseña_usuario);
    if (!contraseñaCorrecta) {
      return res.status(401).json({ message: "Contraseña incorrecta." });
    }

    // ✅ Generar el token JWT
    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        nombre: usuario.nombre_usuario,
        id_tipo_usuario: usuario.id_tipo_usuario,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Configurar la cookie del token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 día de duración
      sameSite: "Lax",
    });

    res.status(200).json({ 
      message: "Usuario autenticado correctamente", 
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre_usuario,
        correo: usuario.correo_usuario,
        tipo: usuario.id_tipo_usuario
      }
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

// ✅ Logout (Cerrar Sesión)
const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Usuario desconectado con éxito." });
};

// ✅ Exportar las funciones
module.exports = {
  register,
  login,
  logout,
};

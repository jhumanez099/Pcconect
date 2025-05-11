const Usuario = require("../models/User.js");
const bcrypt = require("bcryptjs");
const crearToken = require("../libs/jwt.js")


const ERROR_MESSAGES = {
  REQUIRED_FIELDS: "Todos los campos son obligatorios.",
  USER_NOT_FOUND: "Usuario no encontrado.",
  REGISTER_ERROR: "Error al registrar el usuario.",
  LOGIN_ERROR: "Error al logear el usuario",
  RETRIEVAL_ERROR: "Error al consultar el usuario.",
  UPDATE_ERROR: "Error al actualizar el usuario.",
  DELETE_ERROR: "Error al eliminar el usuario.",
};

const handleError = (res, status, message, error = null) => {
  console.error(message, error);
  res.status(status).json({ message, error: error?.message });
};

const validateFields = (fields) => {
  return Object.values(fields).every(
    (field) => field !== undefined && field !== null && field !== ""
  );
};

const register = async (req, res) => {
  const fields = {
    idTipoUsuario: req.body.idTipoUsuario,
    nombreUsuario: req.body.nombreUsuario,
    correoUsuario: req.body.correoUsuario,
    contraseñaUsuario: req.body.contraseñaUsuario,
    telefonoUsuario: req.body.telefonoUsuario,
    cargoUsuario: req.body.cargoUsuario,
    estadoUsuario: req.body.estadoUsuario,
  };

  if (!validateFields(fields)) {
    return res.status(400).json({ message: ERROR_MESSAGES.REQUIRED_FIELDS });
  }

  try {
    const contraseñaEncriptada = await bcrypt.hash(
      fields.contraseñaUsuario,
      10
    );

    fields.contraseñaUsuario = contraseñaEncriptada;

    const usuarioNuevo = await Usuario.crear(fields);

    // Generar el token JWT
    const token = crearToken({
      id: usuarioNuevo.insertId,
      nombre: fields.nombreUsuario,
    });

    // Configurar la cookie
    res.cookie("token", token, {
      httpOnly: true, // Previene el acceso desde JavaScript
      secure: process.env.NODE_ENV,
      maxAge: process.env.TOKEN_EXPIRATION,
      sameSite: "Strict", // Previene ataques CSRF
    });

    res.status(201).json({
      message: "Usuario registrado con éxito",
      usuarioId: usuarioNuevo.insertId,
    });
  } catch (error) {
    handleError(res, 500, ERROR_MESSAGES.REGISTER_ERROR, error);
  }
};

const login = async (req, res) => {
  const fields = {
    correoUsuario: req.body.correoUsuario,
    contraseñaUsuario: req.body.contraseñaUsuario,
  };

  if (!validateFields(fields)) {
    return res.status(400).json({ message: ERROR_MESSAGES.REQUIRED_FIELDS });
  }

  try {
    const usuario = await Usuario.obtenerPorCorreo(fields.correoUsuario);

    if (!usuario) {
      return res.status(404).json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
    }

    // Comparar la contraseña ingresada con la contraseña encriptada almacenada
    const contraseñaCorrecta = await bcrypt.compare(
      fields.contraseñaUsuario,
      usuario.contraseñaUsuario
    );

    if (!contraseñaCorrecta) {
      return res.status(401).json({ message: "Contraseña incorrecta." });
    }

    // Generar el token JWT si la autenticación fue exitosa
    const token = crearToken({
      id: usuario.idUsuario,
      nombre: usuario.nombreUsuario,
    });

    // Configurar la cookie del token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: process.env.TOKEN_EXPIRATION,
      sameSite: "Strict",
    });

    res.status(200).json({ message: "Usuario logeado con éxito" });
  } catch (error) {
    handleError(res, 500, ERROR_MESSAGES.LOGIN_ERROR, error);
  }
};


const logout = (req, res) => {
  res.clearCookie("token"); // Esto eliminará la cookie
  res.status(200).json({ message: "Usuario desconectado con éxito." });
};

module.exports = {
  register,
  login,
  logout
};

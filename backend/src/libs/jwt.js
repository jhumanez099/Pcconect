const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;

const crearToken = (payload) =>
  jwt.sign(payload, jwtSecret, { expiresIn: "1h" });

module.exports = crearToken;

const express = require("express");
const {
  crearUsuario,
  consultarUsuarios,
  actualizarUsuario,
  eliminarUsuario,
} = require("../controllers/user.controller.js");

const router = express.Router();

router.post("/usuarios", crearUsuario);
router.get("/usuarios", consultarUsuarios);
router.put("/usuarios/:id", actualizarUsuario);
router.delete("/usuarios/:id", eliminarUsuario);

module.exports = router;

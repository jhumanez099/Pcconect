const pool = require("../config/db.js");

const TipoEquipo = {
  // Crear un tipo de equipo
  async crear(nombreTipoEquipo) {
    const query = "INSERT INTO tipo_equipo(nombre_tipo_equipo) VALUES (?)";
    const [result] = await pool.query(query, [nombreTipoEquipo]);
    return result;
  },

  // Obtener todos los tipos de equipo
  async obtenerTodos() {
    const query = "SELECT * FROM tipo_equipo";
    const [tiposEquipos] = await pool.query(query);
    return tiposEquipos;
  },

  // Obtener un tipo de equipo por ID
  async obtenerPorId(id) {
    const query = "SELECT * FROM tipo_equipo WHERE id_tipo_equipo = ? LIMIT 1";
    const [tipoEquipo] = await pool.query(query, [id]);
    return tipoEquipo;
  },

  // Actualizar un tipo de equipo
  async actualizar(id, nombreTipoEquipo) {
    const query =
      "UPDATE tipo_equipo SET nombre_tipo_equipo = ? WHERE id_tipo_equipo = ?";
    const [result] = await pool.query(query, [nombreTipoEquipo, id]);
    return result;
  },

  // Eliminar un tipo de equipo
  async eliminar(id) {
    const query = "DELETE FROM tipo_equipo WHERE id_tipo_equipo = ? LIMIT 1";
    const [result] = await pool.query(query, [id]);
    return result;
  },
};

module.exports = TipoEquipo;

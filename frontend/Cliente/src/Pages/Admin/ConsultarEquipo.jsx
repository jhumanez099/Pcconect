import Axios from "axios";
import NavBar from "../../components/Navbar";
import Modal from "react-modal";
import PropTypes from "prop-types";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function EquipoRow({ equipo, onEditar, onEliminar }) {
  return (
    <tr>
      <td>{equipo.nombre_tipo_equipo}</td>
      <td>{equipo.modelo_equipo}</td>
      <td>{equipo.marca_equipo}</td>
      <td>{equipo.especificaciones_equipo}</td>
      <td>{equipo.estado_equipo}</td>
      <td>{new Date(equipo.fecha_compra_equipo).toLocaleDateString("es-CO")}</td>
      <td>
        <div className="d-flex flex-column gap-2">
          <button className="btn btn-primary btn-sm" onClick={() => onEditar(equipo)}>Editar</button>
          <button className="btn btn-danger btn-sm" onClick={() => onEliminar(equipo.id_equipo)}>Eliminar</button>
        </div>
      </td>
    </tr>
  );
}

EquipoRow.propTypes = {
  equipo: PropTypes.object.isRequired,
  onEditar: PropTypes.func.isRequired,
  onEliminar: PropTypes.func.isRequired,
};

export default function ConsultarEquipo() {
  const [equipo, setEquipo] = useState([]);
  const [tipoEquipo, setTipoEquipo] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [editingEquipo, setEditingEquipo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const obtenerEquipos = () => {
    Axios.get("http://localhost:3000/api/equipos", { withCredentials: true })
      .then((res) => setEquipo(res.data))
      .catch(() => alert("Error al cargar los equipos."));
  };

  const obtenerTiposEquipo = () => {
    Axios.get("http://localhost:3000/api/tiposEquipos", { withCredentials: true })
      .then((res) => setTipoEquipo(res.data))
      .catch(() => console.error("Error al cargar tipos de equipo."));
  };

  const eliminarEquipo = (id) => {
    const confirmar = window.confirm("¿Estás seguro de eliminar este equipo?");
    if (!confirmar) return;
    Axios.delete(`http://localhost:3000/api/equipos/${id}`, { withCredentials: true })
      .then(() => {
        setEquipo((prev) => prev.filter((e) => e.id_equipo !== id));
        alert("Equipo eliminado correctamente.");
      })
      .catch((err) => console.error(err));
  };

  const openModal = (equipo) => {
    setEditingEquipo(equipo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingEquipo(null);
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingEquipo((prev) => ({ ...prev, [name]: value }));
  };

  const editarEquipo = () => {
    const equipoActualizado = {
      ...editingEquipo,
      fecha_compra_equipo: new Date(editingEquipo.fecha_compra_equipo).toISOString().split("T")[0],
    };

    Axios.put(`http://localhost:3000/api/equipos/${editingEquipo.id_equipo}`, equipoActualizado, {
      withCredentials: true,
    })
      .then(() => {
        obtenerEquipos();
        alert("Equipo actualizado con éxito.");
        closeModal();
      })
      .catch((err) => console.error(err));
  };

  const equiposFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase();
    return equipo.filter((e) =>
      [
        e.nombre_tipo_equipo,
        e.modelo_equipo,
        e.marca_equipo,
        e.estado_equipo,
        new Date(e.fecha_compra_equipo).toLocaleDateString("es-CO"),
      ].join(" ").toLowerCase().includes(texto)
    );
  }, [busqueda, equipo]);

  useEffect(() => {
    obtenerEquipos();
    obtenerTiposEquipo();
  }, []);

  return (
    <div className="min-vh-100 d-flex flex-column bg-secondary">
      <NavBar />
      <div className="d-flex justify-content-center align-items-center flex-grow-1 px-2">
        <div className="w-100 bg-white rounded card shadow p-4 m-4" style={{ maxWidth: "1000px" }}>
          <div className="mb-4 position-relative">
            <button className="btn btn-outline-primary position-absolute start-0" onClick={() => navigate('/MenuPrincipal')}>← Menú principal</button>
            <h1 className="text-center">Consultar Equipos</h1>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text">🔍︎</span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por modelo, tipo, etc."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="table-responsive">
            <table className="table table-bordered text-center">
              <thead className="table-light">
                <tr>
                  <th>Tipo</th>
                  <th>Modelo</th>
                  <th>Marca</th>
                  <th>Especificaciones</th>
                  <th>Estado</th>
                  <th>Fecha compra</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {equiposFiltrados.length > 0 ? (
                  equiposFiltrados.map((e) => (
                    <EquipoRow
                      key={e.id_equipo}
                      equipo={e}
                      onEditar={openModal}
                      onEliminar={eliminarEquipo}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No hay equipos registrados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Editar equipo"
        className="custom-modal"
        overlayClassName="custom-overlay"
        ariaHideApp={false}
      >
        <div className="modal-content">
          <div className="modal-header justify-content-center mb-3">
            <h5 className="modal-title text-center w-100">Editar Equipo</h5>
            <button className="btn-close position-absolute end-0 me-3" onClick={closeModal}></button>
          </div>
          <div className="modal-body">
            {editingEquipo && (
              <form>
                <div className="mb-3 row align-items-center">
                  <label htmlFor="id_tipo_equipo" className="col-sm-4 col-form-label text-end">Tipo:</label>
                  <div className="col-sm-8">
                    <select
                      className="form-select"
                      id="id_tipo_equipo"
                      name="id_tipo_equipo"
                      value={editingEquipo.id_tipo_equipo}
                      onChange={handleChange}
                    >
                      <option value="">Seleccione...</option>
                      {tipoEquipo.map((tipo) => (
                        <option key={tipo.id_tipo_equipo} value={tipo.id_tipo_equipo}>
                          {tipo.nombre_tipo_equipo}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {["modelo_equipo", "marca_equipo", "especificaciones_equipo"].map((field, index) => (
                  <div className="mb-3 row align-items-center" key={index}>
                    <label htmlFor={field} className="col-sm-4 col-form-label text-end">{field.replace("_equipo", "").replace("_", " ").toUpperCase()}:</label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        id={field}
                        name={field}
                        value={editingEquipo[field] || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                ))}

                <div className="mb-3 row align-items-center">
                  <label htmlFor="fecha_compra_equipo" className="col-sm-4 col-form-label text-end">Fecha compra:</label>
                  <div className="col-sm-8">
                    <input
                      type="date"
                      className="form-control"
                      id="fecha_compra_equipo"
                      name="fecha_compra_equipo"
                      value={editingEquipo.fecha_compra_equipo || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mb-3 row align-items-center">
                  <label htmlFor="estado_equipo" className="col-sm-4 col-form-label text-end">Estado:</label>
                  <div className="col-sm-8">
                    <select
                      className="form-select"
                      id="estado_equipo"
                      name="estado_equipo"
                      value={editingEquipo.estado_equipo}
                      onChange={handleChange}
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>
              </form>
            )}
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <button className="btn btn-success w-50" onClick={editarEquipo}>Guardar Cambios</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

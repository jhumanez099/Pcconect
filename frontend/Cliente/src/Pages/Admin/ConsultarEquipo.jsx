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
        <div className="d-flex flex-column align-items-center gap-2">
          <button className="btn btn-primary btn-sm w-100" onClick={() => onEditar(equipo)}>Editar</button>
          <button className="btn btn-danger btn-sm w-100" onClick={() => onEliminar(equipo.id_equipo)}>Eliminar</button>
        </div>
      </td>
    </tr>
  );
}

EquipoRow.propTypes = {
  equipo: PropTypes.shape({
    id_equipo: PropTypes.number.isRequired,
    nombre_tipo_equipo: PropTypes.string.isRequired,
    nombre_equipo: PropTypes.string.isRequired,
    modelo_equipo: PropTypes.string.isRequired,
    marca_equipo: PropTypes.string.isRequired,
    especificaciones_equipo: PropTypes.string.isRequired,
    estado_equipo: PropTypes.string.isRequired,
    fecha_compra_equipo: PropTypes.string.isRequired,
  }).isRequired,
  onEliminar: PropTypes.func.isRequired,
  onEditar: PropTypes.func.isRequired,
};


export default function ConsultarEquipo() {
  const [equipo, setEquipo] = useState([]);
  const [consultar, setConsultar] = useState("");
  const [editingEquipo, setEditingEquipo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipoEquipo, setTipoEquipo] = useState([]);
  const [error, setError] = useState(null);

  const obtenerEquipos = () => {
    Axios.get("http://localhost:3000/api/equipos")
      .then(res => {
        setEquipo(res.data);
        setError(null);
      })
      .catch(() => {
        setError("Error al cargar los equipos.");
      });
  };

  const obtenerTipoEquipo = () => {
    Axios.get("http://localhost:3000/api/tiposEquipos")
      .then(res => setTipoEquipo(res.data))
      .catch(err => console.error(err));
  };

  const eliminarEquipo = (id) => {
    Axios.delete(`http://localhost:3000/api/equipos/${id}`)
      .then(() => {
        setEquipo(prev => prev.filter(u => u.id_equipo !== id));
      })
      .catch(err => console.error(err));
  };

  const openModal = (equipo) => {
    if (equipo) {
      setEditingEquipo(equipo);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingEquipo((prev) => ({ ...prev, [name]: value }));
  };

  const actualizarEquipo = () => {
    Axios.put(`http://localhost:3000/api/equipos/${editingEquipo.id_equipo}`, {
      idTipoEquipo: editingEquipo.idTipoEquipo,
      nombreEquipo: editingEquipo.nombreEquipo,
      modeloEquipo: editingEquipo.modeloEquipo,
      marcaEquipo: editingEquipo.marcaEquipo,
      especificacionesEquipo: editingEquipo.especificacionesEquipo,
      estadoEquipo: editingEquipo.estadoEquipo,
      fechaCompraEquipo: editingEquipo.fechaCompraEquipo,
    })
      .then(() => {
        obtenerEquipos();
        closeModal();
      })
      .catch(err => console.error(err));
  };

  const resultadoFiltrado = useMemo(() => {
    const texto = consultar.toLowerCase();
    return equipo.filter((item) =>
      [
        item.nombre_tipo_equipo,
        item.modelo_equipo,
        item.marca_equipo,
        item.especificaciones_equipo,
        item.estado_equipo,
        new Date(item.fecha_compra_equipo).toLocaleDateString("es-CO"),
      ]
        .join(" ")
        .toLowerCase()
        .includes(texto)
    );
  }, [consultar, equipo]);
  

  useEffect(() => {
    obtenerEquipos();
    obtenerTipoEquipo();
  }, []);

  const navigate = useNavigate();

  return (
    <div className="min-vh-100 d-flex flex-column bg-secondary">
      <NavBar />
      <div className="d-flex justify-content-center align-items-center flex-grow-1 px-3">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 bg-white rounded card shadow p-4 m-4">
          <div className="row gx-5">
            <div className="col-12 d-flex justify-content-between align-items-center mb-3">
              <button onClick={() => navigate("/MenuPrincipal")} className="btn btn-primary btn-sm">← Regresar</button>
              <h1 className="text-center w-100 mb-0">Consultar equipos</h1>
            </div>
          </div>
          <div className="input-group mb-1">
            <span className="input-group-text">🔍︎</span>
            <input
              type="text"
              className="form-control"
              placeholder=""
              value={consultar}
              onChange={(e) => setConsultar(e.target.value)}
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
        </div>
      </div>

      <div className="container-fluid px-3">
        <div className="table-responsive">
          <table className="table table-striped table-hover mt-5 shadow-lg text-center">
            <thead className="bg-white text-dark">
              <tr>
                <th>Tipo de equipo</th>
                <th>Modelo</th>
                <th>Marca</th>
                <th>Especificaciones</th>
                <th>Estado</th>
                <th>fecha de compra</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {resultadoFiltrado.length > 0 ? (
                resultadoFiltrado.map((equipo) => (
                  <EquipoRow
                    key={equipo.id_equipo}
                    equipo={equipo}
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

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Editar Equipo"
        className="custom-modal modal-dialog modal-dialog-centered"
        overlayClassName="custom-overlay modal-backdrop"
        ariaHideApp={false}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Usuario</h5>
            <button type="button" className="btn-close" onClick={closeModal}></button>
          </div>
          <div className="modal-body">
            {editingEquipo && (
              <form>
                <div className="mb-3">
                  <label htmlFor="id_tipo_equipo" className="form-label">Tipo de equipo:</label>
                  <select
                    className="form-select"
                    id="idTipoEquipo"
                    name="idTipoEquipo"
                    value={editingEquipo.idTipoEquipo || ""}
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
                {[
                  { label: "Modelo", id: "modeloEquipo", type: "text" },
                  { label: "Marca", id: "marcaEquipo", type: "email" },
                  { label: "Especificaciones", id: "especificacionesEquipo", type: "text" },
                  { label: "Fecha de compra", id: "fechaCompraEquipo", type: "date" },
                ].map((field, idx) => (
                  <div className="mb-3" key={idx}>
                    <label htmlFor={field.id} className="form-label">{field.label}:</label>
                    <input
                      type={field.type}
                      className="form-control"
                      id={field.id}
                      name={field.id}
                      value={editingEquipo[field.id] || ""}
                      onChange={handleChange}
                    />
                  </div>
                ))}

                <div className="mb-3">
                  <label htmlFor="estado_equipo" className="form-label">Estado:</label>
                  <select
                    className="form-select"
                    id="estadoEquipo"
                    name="estadoEquipo"
                    value={editingEquipo.estado_equipo || ""}
                    onChange={handleChange}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>

              </form>
            )}
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <button className="btn btn-success w-50" onClick={actualizarEquipo}>
              Guardar Cambios
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


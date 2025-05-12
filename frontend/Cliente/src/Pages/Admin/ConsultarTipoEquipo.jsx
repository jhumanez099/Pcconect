import Axios from "axios";
import NavBar from "../../components/Navbar";
import Modal from "react-modal";
import PropTypes from "prop-types";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function TipoEquipoRow({ tipoEquipo, onEditar, onEliminar }) {
  return (
    <tr>
      <td>{tipoEquipo.nombre_tipo_equipo}</td>
      <td>
        <div className="d-flex flex-column align-items-center gap-2">
          <button className="btn btn-primary btn-sm w-100" onClick={() => onEditar(tipoEquipo)}>Editar</button>
          <button className="btn btn-danger btn-sm w-100" onClick={() => onEliminar(tipoEquipo.id_tipo_equipo)}>Eliminar</button>
        </div>
      </td>
    </tr>
  );
}

TipoEquipoRow.propTypes = {
  tipoEquipo: PropTypes.shape({
    id_tipo_equipo: PropTypes.number.isRequired,
    nombre_tipo_equipo: PropTypes.string.isRequired,
  }).isRequired,
  onEliminar: PropTypes.func.isRequired,
  onEditar: PropTypes.func.isRequired,
};

export default function ConsultarTipoEquipo() {
  const [tipos, setTipos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [editingTipo, setEditingTipo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const obtenerTipos = () => {
    Axios.get("http://localhost:3000/api/tiposEquipos")
      .then((response) => {
        setTipos(response.data);
        setError(null);
      })
      .catch(() => {
        setError("Error al cargar los tipos de equipo.");
      });
  };

  const eliminarTipo = (id) => {
    Axios.delete(`http://localhost:3000/api/tiposEquipos/${id}`)
      .then(() => {
        setTipos((prev) => prev.filter((t) => t.id_tipo_equipo !== id));
      })
      .catch((err) => {
        console.error(err);
        alert("Error al eliminar el tipo.");
      });
  };

  const openModal = (tipo) => {
    setEditingTipo(tipo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTipo(null);
  };

  const handleChange = (e) => {
    setEditingTipo({ ...editingTipo, nombre_tipo_equipo: e.target.value });
  };

  const editarTipo = () => {
    if (!editingTipo.nombre_tipo_equipo.trim()) {
      alert("El nombre no puede estar vacío.");
      return;
    }

    Axios.put(`http://localhost:3000/api/tiposEquipos/${editingTipo.id_tipo_equipo}`, {
      nombre_tipo_equipo: editingTipo.nombre_tipo_equipo,
    })
      .then(() => {
        obtenerTipos();
        closeModal();
      })
      .catch((err) => {
        console.error(err);
        alert("Error al actualizar.");
      });
  };

  const tiposFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase();
    return tipos.filter((t) =>
      t.nombre_tipo_equipo.toLowerCase().includes(texto)
    );
  }, [busqueda, tipos]);

  useEffect(() => {
    obtenerTipos();
  }, []);

  return (
    <div className="min-vh-100 d-flex flex-column bg-secondary">
      <NavBar />
      <div className="d-flex justify-content-center align-items-center flex-grow-1 px-3">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 bg-white rounded card shadow p-4 m-4">
          <div className="row gx-5">
            <div className="col-12 d-flex justify-content-between align-items-center mb-3">
              <button onClick={() => navigate("/MenuPrincipal")} className="btn btn-primary btn-sm">← Regresar</button>
              <h1 className="text-center w-100 mb-0">Consultar Tipos de Equipo</h1>
            </div>
          </div>
          <div className="input-group mb-1">
            <span className="input-group-text">🔍︎</span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar tipo de equipo"
              aria-label="Buscar tipo de equipo"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
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
                <th>Nombre</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {tiposFiltrados.length > 0 ? (
                tiposFiltrados.map((tipo) => (
                  <TipoEquipoRow
                    key={tipo.id_tipo_equipo}
                    tipoEquipo={tipo}
                    onEditar={openModal}
                    onEliminar={eliminarTipo}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="2">No hay tipos de equipo registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Editar Tipo de Equipo"
        className="custom-modal modal-dialog modal-dialog-centered"
        overlayClassName="custom-overlay modal-backdrop"
        ariaHideApp={false}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Tipo de Equipo</h5>
            <button type="button" className="btn-close" onClick={closeModal}></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="nombre_tipo_equipo" className="form-label">Nombre:</label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre_tipo_equipo"
                  value={editingTipo?.nombre_tipo_equipo || ""}
                  onChange={handleChange}
                />
              </div>
            </form>
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <button className="btn btn-success w-50" onClick={editarTipo}>
              Guardar Cambios
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

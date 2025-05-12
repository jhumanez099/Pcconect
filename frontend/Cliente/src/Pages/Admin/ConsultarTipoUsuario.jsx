import Axios from "axios";
import NavBar from "../../components/Navbar";
import Modal from "react-modal";
import PropTypes from "prop-types";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function TipoUsuarioRow({ tipoUsuario, onEliminar, onEditar }) {
  return (
    <tr>
      <td className="text-truncate">{tipoUsuario.nombre_tipo_usuario}</td>
      <td>
        <div className="d-flex flex-column align-items-center gap-2">
          <button
            className="btn btn-primary btn-sm w-100"
            onClick={() => onEditar(tipoUsuario)}
          >
            Editar
          </button>
          <button
            className="btn btn-danger btn-sm w-100"
            onClick={() => onEliminar(tipoUsuario.id_tipo_usuario)}
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}

TipoUsuarioRow.propTypes = {
  tipoUsuario: PropTypes.object.isRequired,
  onEliminar: PropTypes.func.isRequired,
  onEditar: PropTypes.func.isRequired,
};

export default function ConsultarTipoUsuario() {
  const [tiposUsuario, setTiposUsuario] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [editingTipo, setEditingTipo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const obtenerTiposUsuario = () => {
    Axios.get("http://localhost:3000/api/tiposUsuarios")
      .then((res) => {
        setTiposUsuario(res.data);
        setError(null);
      })
      .catch(() => {
        setError("Error al cargar los tipos de usuario.");
      });
  };

  const eliminarTipoUsuario = (id) => {
    Axios.delete(`http://localhost:3000/api/tiposUsuarios/${id}`)
      .then(() => {
        setTiposUsuario((prev) =>
          prev.filter((t) => t.id_tipo_usuario !== id)
        );
      })
      .catch((err) => console.error(err));
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
    const { name, value } = e.target;
    setEditingTipo((prev) => ({ ...prev, [name]: value }));
  };

  const editarTipoUsuario = () => {
    if (!editingTipo.nombre_tipo_usuario.trim()) {
      alert("El nombre no puede estar vacío.");
      return;
    }

    Axios.put(`http://localhost:3000/api/tiposUsuarios/${editingTipo.id_tipo_usuario}`, {
      nombre_tipo_usuario: editingTipo.nombre_tipo_usuario,
    })
      .then(() => {
        obtenerTiposUsuario();
        closeModal();
      })
      .catch((err) => console.error(err));
  };

  const tiposFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase();
    return tiposUsuario.filter((t) =>
      t.nombre_tipo_usuario.toLowerCase().includes(texto)
    );
  }, [busqueda, tiposUsuario]);

  useEffect(() => {
    obtenerTiposUsuario();
  }, []);

  return (
    <div className="min-vh-100 d-flex flex-column bg-secondary">
      <NavBar />
      <div className="d-flex justify-content-center align-items-center flex-grow-1 px-3">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 bg-white rounded card shadow p-4 m-4">
          <div className="row gx-5">
            <div className="col-12 d-flex justify-content-between align-items-center mb-3">
              <button
                onClick={() => navigate("/MenuPrincipal")}
                className="btn btn-primary btn-sm"
              >
                ← Regresar
              </button>
              <h1 className="text-center w-100 mb-0">Consultar tipos de usuario</h1>
            </div>
          </div>
          <div className="input-group mb-1">
            <span className="input-group-text">🔍︎</span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar tipo de usuario"
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
                  <TipoUsuarioRow
                    key={tipo.id_tipo_usuario}
                    tipoUsuario={tipo}
                    onEditar={openModal}
                    onEliminar={eliminarTipoUsuario}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="2">No hay tipos de usuario registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Editar Tipo de Usuario"
        className="custom-modal modal-dialog modal-dialog-centered"
        overlayClassName="custom-overlay modal-backdrop"
        ariaHideApp={false}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Tipo de Usuario</h5>
            <button className="btn-close" onClick={closeModal}></button>
          </div>
          <div className="modal-body">
            {editingTipo && (
              <form>
                <div className="mb-3">
                  <label htmlFor="nombre_tipo_usuario" className="form-label">
                    Nombre:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombre_tipo_usuario"
                    name="nombre_tipo_usuario"
                    value={editingTipo.nombre_tipo_usuario || ""}
                    onChange={handleChange}
                  />
                </div>
              </form>
            )}
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <button className="btn btn-success w-50" onClick={editarTipoUsuario}>
              Guardar Cambios
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

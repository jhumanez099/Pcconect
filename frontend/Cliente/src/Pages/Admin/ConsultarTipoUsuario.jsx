import Axios from "axios";
import NavBar from "../../components/Navbar";
import Modal from "react-modal";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";

function TipoUsuarioRow({ tipoUsuario, onEliminar, onEditar }) {
  return (
    <tr>
      <td>{tipoUsuario.nombre_tipo_usuario}</td>
      <td>
        <div className="d-flex flex-column gap-2">
          <button className="btn btn-primary btn-sm" onClick={() => onEditar(tipoUsuario)}>Editar</button>
          <button className="btn btn-danger btn-sm" onClick={() => onEliminar(tipoUsuario.id_tipo_usuario)}>Eliminar</button>
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
    Axios.get("http://localhost:3000/api/tiposUsuarios", { withCredentials: true })
      .then((res) => {
        setTiposUsuario(res.data);
        setError(null);
      })
      .catch(() => {
        setError("Error al cargar los tipos de usuario.");
      });
  };

  const eliminarTipoUsuario = (id) => {
    const confirmar = window.confirm("¿Estás seguro de eliminar este tipo de usuario?");
    if (!confirmar) return;
    Axios.delete(`http://localhost:3000/api/tiposUsuarios/${id}`, { withCredentials: true })
      .then(() => {
        setTiposUsuario((prev) => prev.filter((t) => t.id_tipo_usuario !== id));
        alert("Tipo de usuario eliminado correctamente.");
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
    Axios.put(`http://localhost:3000/api/tiposUsuarios/${editingTipo.id_tipo_usuario}`, editingTipo, {
      withCredentials: true,
    })
      .then(() => {
        obtenerTiposUsuario();
        alert("Tipo de usuario actualizado con éxito.");
        closeModal();
      })
      .catch((err) => console.error(err));
  };

  const tiposFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase();
    return tiposUsuario.filter((t) => t.nombre_tipo_usuario.toLowerCase().includes(texto));
  }, [busqueda, tiposUsuario]);

  useEffect(() => {
    obtenerTiposUsuario();
  }, []);

  return (
    <div className="min-vh-100 d-flex flex-column bg-secondary">
      <NavBar />
      <div className="d-flex justify-content-center align-items-center flex-grow-1 px-2">
        <div className="w-100 bg-white rounded card shadow p-4 m-4" style={{ maxWidth: "1000px" }}>
          <div className="mb-4 position-relative">
            <button className="btn btn-outline-primary position-absolute start-0" onClick={() => navigate('/MenuPrincipal')}>← Menú principal</button>
            <h1 className="text-center">Consultar Tipos de Usuario</h1>
          </div>

          <div className="input-group mb-3">
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

          <div className="table-responsive">
            <table className="table table-bordered text-center">
              <thead className="table-light">
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
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Editar Tipo de Usuario"
        className="custom-modal"
        overlayClassName="custom-overlay"
        ariaHideApp={false}
      >
        <div className="modal-content">
          <div className="modal-header justify-content-center mb-3">
            <h5 className="modal-title text-center w-100">Editar Tipo de Usuario</h5>
            <button className="btn-close position-absolute end-0 me-3" onClick={closeModal}></button>
          </div>
          <div className="modal-body">
            {editingTipo && (
              <form>
                <div className="mb-3 row align-items-center">
                  <label htmlFor="nombre_tipo_usuario" className="col-sm-4 col-form-label text-end">
                    Nombre:
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      id="nombre_tipo_usuario"
                      name="nombre_tipo_usuario"
                      value={editingTipo.nombre_tipo_usuario || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </form>
            )}
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <button className="btn btn-success" onClick={editarTipoUsuario}>Guardar Cambios</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

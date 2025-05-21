import Axios from "axios";
import NavBar from "../../components/Navbar";
import Modal from "react-modal";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";

function UsuarioRow({ usuario, onEliminar, onEditar }) {
  return (
    <tr>
      <td>{usuario.nombre_usuario}</td>
      <td>{usuario.correo_usuario}</td>
      <td>{usuario.telefono_usuario}</td>
      <td>{usuario.cargo_usuario}</td>
      <td>{usuario.estado_usuario}</td>
      <td>{usuario.nombre_tipo_usuario}</td>
      <td>
        <div className="d-flex flex-column gap-2">
          <button className="btn btn-primary btn-sm" onClick={() => onEditar(usuario)}>Editar</button>
          <button className="btn btn-danger btn-sm" onClick={() => onEliminar(usuario.id_usuario)}>Eliminar</button>
        </div>
      </td>
    </tr>
  );
}

UsuarioRow.propTypes = {
  usuario: PropTypes.object.isRequired,
  onEliminar: PropTypes.func.isRequired,
  onEditar: PropTypes.func.isRequired,
};

export default function ConsultarUsuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tiposUsuario, setTiposUsuario] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const obtenerUsuarios = () => {
    Axios.get("http://localhost:3000/api/usuarios", { withCredentials: true })
      .then(res => setUsuarios(res.data))
      .catch(() => setError("Error al cargar los usuarios."));
  };

  const obtenerTiposUsuario = () => {
    Axios.get("http://localhost:3000/api/tiposUsuarios", { withCredentials: true })
      .then(res => setTiposUsuario(res.data))
      .catch(() => console.error("Error al obtener tipos de usuario."));
  };

  const eliminarUsuario = (id) => {
    const confirmar = window.confirm("¿Estás seguro de eliminar este usuario?");
    if (!confirmar) return;
    Axios.delete(`http://localhost:3000/api/usuarios/${id}`, { withCredentials: true })
      .then(() => {
        setUsuarios(prev => prev.filter(u => u.id_usuario !== id));
        alert("Usuario eliminado correctamente.");
      })
      .catch(err => console.error(err));
  };

  const openModal = (usuario) => {
    setEditingUsuario(usuario);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUsuario(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingUsuario(prev => ({ ...prev, [name]: value }));
  };

  const editarUsuario = () => {
    Axios.put(`http://localhost:3000/api/usuarios/${editingUsuario.id_usuario}`, editingUsuario, {
      withCredentials: true,
    })
      .then(() => {
        obtenerUsuarios();
        alert("Usuario actualizado con éxito.");
        closeModal();
      })
      .catch(err => console.error(err));
  };

  const usuariosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase();
    return usuarios.filter((u) => u.nombre_usuario.toLowerCase().includes(texto));
  }, [busqueda, usuarios]);

  useEffect(() => {
    obtenerUsuarios();
    obtenerTiposUsuario();
  }, []);

  return (
    <div className="min-vh-100 d-flex flex-column bg-secondary">
      <NavBar />
      <div className="d-flex justify-content-center align-items-center flex-grow-1 px-2">
        <div className="w-100 bg-white rounded card shadow p-4 m-4" style={{ maxWidth: "1000px" }}>
          <div className="mb-4 position-relative">
            <button className="btn btn-outline-primary position-absolute start-0" onClick={() => navigate('/MenuPrincipal')}>← Menú principal</button>
            <h1 className="text-center">Consultar Usuarios</h1>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text">🔍︎</span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre"
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
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Cargo</th>
                  <th>Estado</th>
                  <th>Tipo</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.length > 0 ? (
                  usuariosFiltrados.map((usuario) => (
                    <UsuarioRow
                      key={usuario.id_usuario}
                      usuario={usuario}
                      onEditar={openModal}
                      onEliminar={eliminarUsuario}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No hay usuarios registrados.</td>
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
        contentLabel="Editar Usuario"
        className="custom-modal"
        overlayClassName="custom-overlay"
        ariaHideApp={false}
      >
        <div className="modal-content">
          <div className="modal-header justify-content-center mb-3">
            <h5 className="modal-title text-center w-100">Editar Usuario</h5>
            <button className="btn-close position-absolute end-0 me-3" onClick={closeModal}></button>
          </div>
          <div className="modal-body">
            {editingUsuario && (
              <form>
                {["nombre_usuario", "correo_usuario", "telefono_usuario", "cargo_usuario"].map((field, i) => (
                  <div className="mb-3 row align-items-center" key={i}>
                    <label htmlFor={field} className="col-sm-4 col-form-label text-end">{field.replace("_usuario", "").replace("_", " ").toUpperCase()}:</label>
                    <div className="col-sm-8">
                      <input
                        type={field === "correo_usuario" ? "email" : "text"}
                        className="form-control"
                        id={field}
                        name={field}
                        value={editingUsuario?.[field] || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                ))}

                <div className="mb-3 row align-items-center">
                  <label htmlFor="estado_usuario" className="col-sm-4 col-form-label text-end">Estado:</label>
                  <div className="col-sm-8">
                    <select
                      className="form-select"
                      id="estado_usuario"
                      name="estado_usuario"
                      value={editingUsuario?.estado_usuario || ""}
                      onChange={handleChange}
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3 row align-items-center">
                  <label htmlFor="id_tipo_usuario" className="col-sm-4 col-form-label text-end">Tipo:</label>
                  <div className="col-sm-8">
                    <select
                      className="form-select"
                      id="id_tipo_usuario"
                      name="id_tipo_usuario"
                      value={editingUsuario?.id_tipo_usuario || ""}
                      onChange={handleChange}
                    >
                      <option value="">Seleccione...</option>
                      {tiposUsuario.map((tipo) => (
                        <option key={tipo.id_tipo_usuario} value={tipo.id_tipo_usuario}>
                          {tipo.nombre_tipo_usuario}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </form>
            )}
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <button className="btn btn-success w-50" onClick={editarUsuario}>
              Guardar Cambios
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

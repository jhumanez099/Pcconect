import Axios from "axios";
import NavBar from "../../components/Navbar";
import Modal from "react-modal";
import PropTypes from "prop-types";
import { useEffect, useState, useMemo } from "react";

function UsuarioRow({ usuario, onEditar, onEliminar }) {
  return (
    <tr>
      <td>{usuario.nombre_usuario}</td>
      <td>{usuario.correo_usuario}</td>
      <td>{usuario.telefono_usuario}</td>
      <td>{usuario.cargo_usuario}</td>
      <td>{usuario.estado_usuario}</td>
      <td>{usuario.nombre_tipo_usuario}</td>
      <td>
        <div className="d-flex flex-column align-items-center gap-2">
          <button className="btn btn-primary btn-sm w-100" onClick={() => onEditar(usuario)}>Editar</button>
          <button className="btn btn-danger btn-sm w-100" onClick={() => onEliminar(usuario.id_usuario)}>Eliminar</button>
        </div>
      </td>
    </tr>
  );
}

UsuarioRow.propTypes = {
  usuario: PropTypes.shape({
    id_usuario: PropTypes.number.isRequired,
    nombre_tipo_usuario: PropTypes.string.isRequired,
    nombre_usuario: PropTypes.string.isRequired,
    correo_usuario: PropTypes.string.isRequired,
    contraseña_usuario: PropTypes.string.isRequired,
    telefono_usuario: PropTypes.string.isRequired,
    cargo_usuario: PropTypes.string.isRequired,
    estado_usuario: PropTypes.string.isRequired,
  }).isRequired,
  onEliminar: PropTypes.func.isRequired,
  onEditar: PropTypes.func.isRequired,
};


export default function ConsultarUsuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [consultar, setConsultar] = useState("");
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tiposUsuario, setTiposUsuario] = useState([]);
  const [error, setError] = useState(null);

  const obtenerUsuarios = () => {
    Axios.get("http://localhost:3000/api/usuarios")
      .then(res => {
        setUsuarios(res.data);
        setError(null);
      })
      .catch(() => {
        setError("Error al cargar los usuarios.");
      });
  };

  const obtenerTiposUsuario = () => {
    Axios.get("http://localhost:3000/api/tiposUsuarios")
      .then(res => setTiposUsuario(res.data))
      .catch(err => console.error(err));
  };

  const eliminarUsuario = (id) => {
    Axios.delete(`http://localhost:3000/api/usuarios/${id}`)
      .then(() => {
        setUsuarios(prev => prev.filter(u => u.id_usuario !== id));
      })
      .catch(err => console.error(err));
  };

  const openModal = (usuario) => {
    if (usuario) {
      setEditingUsuario(usuario);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const actualizarUsuario = () => {
    Axios.put(`http://localhost:3000/api/usuarios/${editingUsuario.id_usuario}`, {
      nombre_usuario: editingUsuario.nombre_usuario,
      correo_usuario: editingUsuario.correo_usuario,
      contraseña_usuario: editingUsuario.contraseña_usuario || "123456",
      telefono_usuario: editingUsuario.telefono_usuario,
      cargo_usuario: editingUsuario.cargo_usuario,
      estado_usuario: editingUsuario.estado_usuario,
      id_tipo_usuario: editingUsuario.id_tipo_usuario,
    })
      .then(() => {
        obtenerUsuarios();
        closeModal();
      })
      .catch(err => console.error(err));
  };

  const resultadoFiltrado = useMemo(() => {
    return consultar
      ? usuarios.filter(u =>
        u.nombre_usuario.toLowerCase().includes(consultar.toLowerCase())
      )
      : usuarios;
  }, [consultar, usuarios]);

  useEffect(() => {
    obtenerUsuarios();
    obtenerTiposUsuario();
  }, []);

  return (
    <div className="min-vh-100 d-flex flex-column bg-secondary">
      <NavBar />
      <div className="d-flex justify-content-center align-items-center flex-grow-1 px-3">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 bg-white rounded card shadow p-4 m-4">
          <div className="row gx-5">
            <div className="col-12 d-flex justify-content-between align-items-center mb-3">
              <button className="btn btn-primary btn-sm">← Regresar</button>
              <h1 className="text-center w-100 mb-0">Consultar usuarios</h1>
            </div>
          </div>
          <div className="input-group mb-1">
            <span className="input-group-text">🔍︎</span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre"
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
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Cargo</th>
                <th>Estado</th>
                <th>Tipo de usuario</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {resultadoFiltrado.length > 0 ? (
                resultadoFiltrado.map((usuario) => (
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

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Editar Usuario"
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
            {editingUsuario && (
              <form>
                {[
                  { label: "Nombre", id: "nombre_usuario", type: "text" },
                  { label: "Correo", id: "correo_usuario", type: "email" },
                  { label: "Teléfono", id: "telefono_usuario", type: "text" },
                  { label: "Cargo", id: "cargo_usuario", type: "text" },
                ].map((field, idx) => (
                  <div className="mb-3" key={idx}>
                    <label htmlFor={field.id} className="form-label">{field.label}:</label>
                    <input
                      type={field.type}
                      className="form-control"
                      id={field.id}
                      name={field.id}
                      value={editingUsuario[field.id] || ""}
                      onChange={handleChange}
                    />
                  </div>
                ))}

                <div className="mb-3">
                  <label htmlFor="estado_usuario" className="form-label">Estado:</label>
                  <select
                    className="form-select"
                    id="estado_usuario"
                    name="estado_usuario"
                    value={editingUsuario.estado_usuario || ""}
                    onChange={handleChange}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="id_tipo_usuario" className="form-label">Tipo de usuario:</label>
                  <select
                    className="form-select"
                    id="id_tipo_usuario"
                    name="id_tipo_usuario"
                    value={editingUsuario.id_tipo_usuario || ""}
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
              </form>
            )}
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <button className="btn btn-success w-50" onClick={actualizarUsuario}>
              Guardar Cambios
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


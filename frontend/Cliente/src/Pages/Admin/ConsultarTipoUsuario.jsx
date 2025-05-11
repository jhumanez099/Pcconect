import Axios from "axios";
import NavBar from "../../components/Navbar";
import Modal from "react-modal";
import PropTypes from "prop-types";
import { useEffect, useState, useMemo } from "react";

function TipoUsuarioRow({ tipoUsuario, onEliminar, onEditar }) {
  return (
    <tr>
      <td className="text-truncate">{tipoUsuario.nombre_tipo_usuario}</td>
      <td>
        <div className="d-flex flex-column align-items-center">
          <button
            className="btn btn-primary btn-sm mb-2 w-100"
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
  tipoUsuario: PropTypes.shape({
    id_tipo_usuario: PropTypes.number.isRequired,
    nombre_tipo_usuario: PropTypes.string.isRequired,
  }).isRequired,
  onEliminar: PropTypes.func.isRequired,
  onEditar: PropTypes.func.isRequired,
};

export default function ConsultarTipoUsuario() {
  const [tipoUsuario, setTipoUsuario] = useState([]);
  const [consultar, setConsultar] = useState("");
  const [editingTipoUsuario, setEditingTipoUsuario] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const consultarTipoUsuario = () => {
    Axios.get("http://localhost:3000/api/tiposUsuarios")
      .then((response) => {
        setTipoUsuario(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error("Error en la consulta los tipos de usuario:", error);
        setError(
          "Hubo un error al cargar los tipos de usuario. Por favor, intenta nuevamente."
        );
      });
  };

  const eliminarTipoUsuario = (id) => {
    Axios.delete(`http://localhost:3000/api/tiposUsuarios/${id}`)
      .then(() => {
        setTipoUsuario((prevTipoUsuario) =>
          prevTipoUsuario.filter((tipoUsuario) => tipoUsuario.id_tipo_usuario !== id)
        );

      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleNombreChange = (e) => {
    const updated = {
      ...editingTipoUsuario,
      nombre_tipo_usuario: e.target.value,
    };
    setEditingTipoUsuario(updated);
  };

  //ESTAAS FUNCIONES SON PARA ABRIR Y CERRAR LA VENTANA EMERGENTE(MODAL)
  const openModal = (tipoUsuario) => {
    if (tipoUsuario) {
      setEditingTipoUsuario(tipoUsuario);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const editarTipoUsuario = () => {
    Axios.put(`http://localhost:3000/api/tiposUsuarios/${editingTipoUsuario.id_tipo_usuario}`, {
      nombre_tipo_usuario: editingTipoUsuario.nombre_tipo_usuario,
    })    
      .then(() => {
        consultarTipoUsuario();  // Llama a la función que actualiza la lista de clientes
        closeModal();  // Cierra el modal después de guardar los cambios
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const resultadoFiltrado = useMemo(() => {
    return consultar
      ? tipoUsuario.filter((dato) =>
        dato.nombre_tipo_usuario.toLowerCase().includes(consultar.toLowerCase())
      )
      : tipoUsuario;
  }, [consultar, tipoUsuario]);

  useEffect(() => {
    consultarTipoUsuario();
  }, []);

  return (
    <div className="min-vh-100 d-flex flex-column bg-secondary">
      <NavBar />
      <div className="d-flex justify-content-center align-items-center flex-grow-1 px-3">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 bg-white rounded card shadow p-4 m-4">
          <div className="row gx-5">
            <div className="col-12 d-flex justify-content-between align-items-center mb-3">
              <button className="btn btn-primary btn-sm">← Regresar</button>
              <h1 className="text-center w-100 mb-0">Consultar tipos de usuario</h1>
            </div>
          </div>
          <div className="text-center d-flex justify-content-center input-group mb-1">
            <span className="input-group-text" id="icon-input">
              🔍︎
            </span>
            <input
              value={consultar}
              onChange={(e) => setConsultar(e.target.value)}
              type="text"
              placeholder="Consulta los tipos de usuario"
              className="form-control"
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
        </div>
      </div>
      <div className="container px-3">
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle text-center">
            <thead className="table-light">
              <tr>
                <th style={{ width: '60%' }}>Nombre</th>
                <th style={{ width: '40%' }}>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {resultadoFiltrado.length > 0 ? (
                resultadoFiltrado.map((tipoUsuario) => (
                  <TipoUsuarioRow
                    key={tipoUsuario.id_tipo_usuario}
                    tipoUsuario={tipoUsuario}
                    onEliminar={eliminarTipoUsuario}
                    onEditar={openModal}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="2">No hay tipos de usuario creados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Editar el tipo de usuario"
        className="custom-modal modal-dialog modal-dialog-scrollable modal-dialog-centered"
        overlayClassName="custom-overlay modal-backdrop"
        ariaHideApp={false}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Tipo de usuario</h5>
            <button
              type="button"
              className="btn-close"
              onClick={closeModal}
              aria-label="Cerrar"
            ></button>
          </div>
          <div className="modal-body">
            <form>
              {/* Formulario de cliente */}
              <div className="mb-3">
                <label htmlFor="nombreCliente" className="form-label">
                  Nombre:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nombreCliente"
                  value={editingTipoUsuario?.nombre_tipo_usuario || ""}
                  onChange={handleNombreChange}
                />
              </div>
            </form>
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <button
              type="button"
              className="btn btn-success w-50"
              onClick={editarTipoUsuario}
            >
              <i className="bi bi-save"></i> Guardar Cambios
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

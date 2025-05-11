import Axios from "axios";
import NavBar from "../../components/Navbar";
import Modal from "react-modal";
import PropTypes from "prop-types";
import { useEffect, useState, useMemo } from "react";

function ClienteRow({ cliente, onEliminar, onEditar }) {
  return (
    <tr>
      <td className="text-truncate">{cliente.nombre_cliente}</td>
      <td className="text-truncate">{cliente.direccion_cliente}</td>
      <td>{cliente.telefono_cliente}</td>
      <td className="text-truncate">{cliente.correo_cliente}</td>
      <td>{cliente.encargado_cliente}</td>
      <td>{cliente.estado_cliente}</td>
      <td>
        <div className="d-flex flex-column align-items-center">
          <button
            className="btn btn-primary btn-sm mb-2 w-100"
            onClick={() => onEditar(cliente)}
          >
            Editar
          </button>
          <button
            className="btn btn-danger btn-sm w-100"
            onClick={() => onEliminar(cliente.id_cliente)}
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}

ClienteRow.propTypes = {
  cliente: PropTypes.shape({
    id_cliente: PropTypes.number.isRequired,
    nombre_cliente: PropTypes.string.isRequired,
    direccion_cliente: PropTypes.string.isRequired,
    telefono_cliente: PropTypes.string.isRequired,
    correo_cliente: PropTypes.string.isRequired,
    encargado_cliente: PropTypes.string.isRequired,
    estado_cliente: PropTypes.string.isRequired,
  }).isRequired,
  onEliminar: PropTypes.func.isRequired,
  onEditar: PropTypes.func.isRequired,
};

export default function ConsultarCliente() {
  const [clientes, setClientes] = useState([]);
  const [consultar, setConsultar] = useState("");
  const [editingCliente, setEditingCliente] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const consultarClientes = () => {
    Axios.get("http://localhost:3000/api/clientes")
      .then((response) => {
        setClientes(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error("Error en la consulta de clientes:", error);
        setError(
          "Hubo un error al cargar los clientes. Por favor, intenta nuevamente."
        );
      });
  };

  const eliminarCliente = (id) => {
    Axios.delete(`http://localhost:3000/api/clientes/${id}`)
      .then(() => {
        setClientes((prevClientes) =>
          prevClientes.filter((cliente) => cliente.id_cliente !== id)
        );

      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleNombreChange = (e) => {
    const updated = {
      ...editingCliente,
      nombre_cliente: e.target.value,
    };
    setEditingCliente(updated);
  };

  const handleDireccionChange = (e) => {
    const updated = {
      ...editingCliente,
      direccion_cliente: e.target.value,
    };
    setEditingCliente(updated);
  };

  const handleTelefonoChange = (e) => {
    const updated = {
      ...editingCliente,
      telefono_cliente: e.target.value,
    };
    setEditingCliente(updated);
  };

  const handleCorreoChange = (e) => {
    const updated = {
      ...editingCliente,
      correo_cliente: e.target.value,
    };
    setEditingCliente(updated);
  };

  const handleEstadoChange = (e) => {
    const updated = {
      ...editingCliente,
      estado_cliente: e.target.value,
    };
    setEditingCliente(updated);
  };

  const handleEncargadoChange = (e) => {
    const updated = {
      ...editingCliente,
      encargado_cliente: e.target.value,
    };
    setEditingCliente(updated);
  };

  //ESTAAS FUNCIONES SON PARA ABRIR Y CERRAR LA VENTANA EMERGENTE(MODAL)
  const openModal = (cliente) => {
    if (cliente) {
      setEditingCliente(cliente);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const editarCliente = () => {
    Axios.put(`http://localhost:3000/api/clientes/${editingCliente.id_cliente}`, {
      nombreCliente: editingCliente.nombre_cliente,
      direccionCliente: editingCliente.direccion_cliente,
      telefonoCliente: editingCliente.telefono_cliente,
      correoCliente: editingCliente.correo_cliente,
      encargadoCliente: editingCliente.encargado_cliente,
      estadoCliente: editingCliente.estado_cliente,
    })
      .then(() => {
        consultarClientes();  // Llama a la función que actualiza la lista de clientes
        closeModal();  // Cierra el modal después de guardar los cambios
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const resultadoFiltrado = useMemo(() => {
    return consultar
      ? clientes.filter((dato) =>
        dato.nombre_cliente.toLowerCase().includes(consultar.toLowerCase())
      )
      : clientes;
  }, [consultar, clientes]);

  useEffect(() => {
    consultarClientes();
  }, []);

  return (
    <div className="min-vh-100 d-flex flex-column bg-secondary">
      <NavBar />
      <div className="d-flex justify-content-center align-items-center flex-grow-1 px-3">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 bg-white rounded card shadow p-4 m-4">
          <div className="row gx-5">
            <div className="col-12 d-flex justify-content-between align-items-center mb-3">
              <button className="btn btn-primary btn-sm">← Regresar</button>
              <h1 className="text-center w-100 mb-0">Consultar cliente</h1>
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
              placeholder="Consulta los clientes"
              className="form-control"
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
        </div>
      </div>
      <div className="container-fluid px-3">
        <div className="table-responsive">
          <table className="table table-striped table-hover mt-5 shadow-lg align-items-center text-center">
            <thead>
              <tr className="bg-white text-dark">
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Teléfono</th>
                <th>Correo Electrónico</th>
                <th>Responsable</th>
                <th>Estado</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {resultadoFiltrado.length > 0 ? (
                resultadoFiltrado.map((cliente) => (
                  <ClienteRow
                    key={cliente.id_cliente}
                    cliente={cliente}
                    onEliminar={eliminarCliente}
                    onEditar={openModal}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="7">No hay clientes creados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Editar Cliente"
        className="custom-modal modal-dialog modal-dialog-scrollable modal-dialog-centered"
        overlayClassName="custom-overlay modal-backdrop"
        ariaHideApp={false}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Cliente</h5>
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
                  value={editingCliente?.nombre_cliente || ""}
                  onChange={handleNombreChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="direccionCliente" className="form-label">
                  Dirección:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="direccionCliente"
                  value={editingCliente?.direccion_cliente || ""}
                  onChange={handleDireccionChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="telefonoCliente" className="form-label">
                  Teléfono:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="telefonoCliente"
                  value={editingCliente?.telefono_cliente || ""}
                  onChange={handleTelefonoChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="correoCliente" className="form-label">
                  Correo Electrónico:
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="correoCliente"
                  value={editingCliente?.correo_cliente || ""}
                  onChange={handleCorreoChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="encargadoCliente" className="form-label">
                  Responsable:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="encargadoCliente"
                  value={editingCliente?.encargado_cliente || ""}
                  onChange={handleEncargadoChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="estadoCliente" className="form-label">
                  Estado:
                </label>
                <select
                  className="form-select"
                  id="estadoCliente"
                  value={editingCliente?.estado_cliente || ""}
                  onChange={handleEstadoChange}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </form>
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <button
              type="button"
              className="btn btn-success w-50"
              onClick={editarCliente}
            >
              <i className="bi bi-save"></i> Guardar Cambios
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

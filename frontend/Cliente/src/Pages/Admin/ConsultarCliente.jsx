import Axios from "axios";
import NavBar from "../../components/Navbar";
import Modal from "react-modal";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";

function ClienteRow({ cliente, onEliminar, onEditar }) {
  return (
    <tr>
      <td>{cliente.nombre_cliente}</td>
      <td>{cliente.direccion_cliente}</td>
      <td>{cliente.telefono_cliente}</td>
      <td>{cliente.correo_cliente}</td>
      <td>{cliente.encargado_cliente}</td>
      <td>{cliente.estado_cliente}</td>
      <td>
        <div className="d-flex flex-column gap-2">
          <button className="btn btn-primary btn-sm" onClick={() => onEditar(cliente)}>Editar</button>
          <button className="btn btn-danger btn-sm" onClick={() => onEliminar(cliente.id_cliente)}>Eliminar</button>
        </div>
      </td>
    </tr>
  );
}

ClienteRow.propTypes = {
  cliente: PropTypes.object.isRequired,
  onEliminar: PropTypes.func.isRequired,
  onEditar: PropTypes.func.isRequired,
};

export default function ConsultarCliente() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [editingCliente, setEditingCliente] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const obtenerClientes = () => {
    Axios.get("http://localhost:3000/api/clientes", { withCredentials: true })
      .then((res) => setClientes(res.data))
      .catch(() => setError("Error al cargar los clientes."));
  };

  const eliminarCliente = (id) => {
    const confirmar = window.confirm("¿Estás seguro de eliminar este cliente?");
    if (!confirmar) return;
    Axios.delete(`http://localhost:3000/api/clientes/${id}`, { withCredentials: true })
      .then(() => {
        setClientes((prev) => prev.filter((c) => c.id_cliente !== id));
        alert("Cliente eliminado correctamente.");
      })
      .catch((err) => console.error(err));
  };

  const openModal = (cliente) => {
    setEditingCliente(cliente);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCliente(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingCliente((prev) => ({ ...prev, [name]: value }));
  };

  const editarCliente = () => {
    Axios.put(`http://localhost:3000/api/clientes/${editingCliente.id_cliente}`, editingCliente, {
      withCredentials: true,
    })
      .then(() => {
        obtenerClientes();
        alert("Cliente actualizado con éxito.");
        closeModal();
      })
      .catch((err) => console.error(err));
  };

  const clientesFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase();
    return clientes.filter((c) => c.nombre_cliente.toLowerCase().includes(texto));
  }, [busqueda, clientes]);

  useEffect(() => {
    obtenerClientes();
  }, []);

  return (
    <div className="min-vh-100 d-flex flex-column">
      <NavBar />
      <div className="d-flex justify-content-center align-items-center flex-grow-1 px-2">
        <div className="w-100 bg-white rounded card shadow p-4 m-4" style={{ maxWidth: "1000px" }}>
          <div className="mb-4 position-relative">
            <button className="btn btn-outline-primary position-absolute start-0" onClick={() => navigate('/MenuPrincipal')}>← Menú principal</button>
            <h1 className="text-center">Consultar Clientes</h1>
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
                  <th>Dirección</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                  <th>Responsable</th>
                  <th>Estado</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.length > 0 ? (
                  clientesFiltrados.map((cliente) => (
                    <ClienteRow
                      key={cliente.id_cliente}
                      cliente={cliente}
                      onEditar={openModal}
                      onEliminar={eliminarCliente}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No hay clientes registrados.</td>
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
        contentLabel="Editar Cliente"
        className="custom-modal"
        overlayClassName="custom-overlay"
        ariaHideApp={false}
      >
        <div className="modal-content">
          <div className="modal-header justify-content-center mb-3">
            <h5 className="modal-title text-center w-100">Editar Cliente</h5>
            <button
              type="button"
              className="btn-close position-absolute end-0 me-3"
              onClick={closeModal}
              aria-label="Cerrar"
            ></button>
          </div>

          <div className="modal-body">
            <form>
              {["nombre_cliente", "direccion_cliente", "telefono_cliente", "correo_cliente", "encargado_cliente"].map((field, index) => (
                <div className="mb-3 row align-items-center" key={index}>
                  <label htmlFor={field} className="col-sm-4 col-form-label text-end">
                    {field.replace("_cliente", "").replace("_", " ").toUpperCase()}:
                  </label>
                  <div className="col-sm-8">
                    <input
                      type={field === "correo_cliente" ? "email" : "text"}
                      className="form-control"
                      id={field}
                      name={field}
                      value={editingCliente?.[field] || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              ))}
              <div className="mb-3 row align-items-center">
                <label htmlFor="estado_cliente" className="col-sm-4 col-form-label text-end">Estado:</label>
                <div className="col-sm-8">
                  <select
                    className="form-select"
                    id="estado_cliente"
                    name="estado_cliente"
                    value={editingCliente?.estado_cliente || ""}
                    onChange={handleChange}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
            </form>
          </div>

          <div className="modal-footer d-flex justify-content-center">
            <button type="button" className="btn btn-success" onClick={editarCliente}>Guardar Cambios</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

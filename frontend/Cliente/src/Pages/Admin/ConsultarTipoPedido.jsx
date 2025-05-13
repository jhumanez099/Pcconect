import Axios from "axios";
import NavBar from "../../components/Navbar";
import Modal from "react-modal";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";

function TipoPedidoRow({ tipoPedido, onEliminar, onEditar }) {
  return (
    <tr>
      <td>{tipoPedido.nombre_tipo_pedido}</td>
      <td>
        <div className="d-flex flex-column align-items-center gap-2">
          <button className="btn btn-primary btn-sm w-100" onClick={() => onEditar(tipoPedido)}>Editar</button>
          <button className="btn btn-danger btn-sm w-100" onClick={() => onEliminar(tipoPedido.id_tipo_pedido)}>Eliminar</button>
        </div>
      </td>
    </tr>
  );
}

TipoPedidoRow.propTypes = {
  tipoPedido: PropTypes.object.isRequired,
  onEliminar: PropTypes.func.isRequired,
  onEditar: PropTypes.func.isRequired,
};

export default function ConsultarTipoPedido() {
  const [tiposPedido, setTiposPedido] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [editingTipo, setEditingTipo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const obtenerTiposPedido = () => {
    Axios.get("http://localhost:3000/api/tiposPedidos", { withCredentials: true })
      .then(res => {
        setTiposPedido(res.data);
        setError(null);
      })
      .catch(() => setError("Error al cargar los tipos de pedido."));
  };

  const eliminarTipoPedido = (id) => {
    Axios.delete(`http://localhost:3000/api/tiposPedidos/${id}`, { withCredentials: true })
      .then(() => {
        setTiposPedido(prev => prev.filter(t => t.id_tipo_pedido !== id));
        alert("Tipo de pedido eliminado correctamente.");
      })
      .catch(err => console.error(err));
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
    setEditingTipo(prev => ({ ...prev, [name]: value }));
  };

  const editarTipoPedido = () => {
    Axios.put(
      `http://localhost:3000/api/tiposPedidos/${editingTipo.id_tipo_pedido}`,
      { nombre_tipo_pedido: editingTipo.nombre_tipo_pedido },
      { withCredentials: true }
    )
      .then(() => {
        obtenerTiposPedido();
        alert("Tipo de pedido actualizado con éxito.");
        closeModal();
      })
      .catch(err => console.error(err));
  };

  const tiposFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase();
    return tiposPedido.filter(t => t.nombre_tipo_pedido.toLowerCase().includes(texto));
  }, [busqueda, tiposPedido]);

  useEffect(() => {
    obtenerTiposPedido();
  }, []);

  return (
    <div className="min-vh-100 d-flex flex-column bg-secondary">
      <NavBar />
      <div className="d-flex justify-content-center align-items-center flex-grow-1 px-3">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 bg-white rounded card shadow p-4 m-4">
          <div className="row gx-5">
            <div className="col-12 d-flex justify-content-between align-items-center mb-3">
              <button onClick={() => navigate("/MenuPrincipal")} className="btn btn-primary btn-sm">← Regresar</button>
              <h1 className="text-center w-100 mb-0">Consultar tipos de pedido</h1>
            </div>
          </div>
          <div className="input-group mb-1">
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
                  <TipoPedidoRow
                    key={tipo.id_tipo_pedido}
                    tipoPedido={tipo}
                    onEditar={openModal}
                    onEliminar={eliminarTipoPedido}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="2">No hay tipos de pedido registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Editar Tipo de Pedido"
        className="custom-modal"
        overlayClassName="custom-overlay"
        ariaHideApp={false}
      >
        <div className="modal-content">
          <div className="modal-header justify-content-center mb-3">
            <h5 className="modal-title text-center w-100">Editar Tipo de Pedido</h5>
            <button className="btn-close position-absolute end-0 me-3" onClick={closeModal}></button>
          </div>
          <div className="modal-body">
            {editingTipo && (
              <form>
                <div className="mb-3 row align-items-center">
                  <label htmlFor="nombre_tipo_pedido" className="col-sm-4 col-form-label text-end">
                    Nombre:
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      id="nombre_tipo_pedido"
                      name="nombre_tipo_pedido"
                      value={editingTipo.nombre_tipo_pedido || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </form>
            )}
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <button className="btn btn-success w-50" onClick={editarTipoPedido}>
              Guardar Cambios
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

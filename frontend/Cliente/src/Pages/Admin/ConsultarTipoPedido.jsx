import Axios from "axios";
import NavBar from "../../components/Navbar";
import Modal from "react-modal";
import PropTypes from "prop-types";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function TipoPedidoRow({ tipoPedido, onEliminar, onEditar }) {
  return (
    <tr>
      <td className="text-truncate">{tipoPedido.nombre_tipo_pedido}</td>
      <td>
        <div className="d-flex flex-column align-items-center">
          <button
            className="btn btn-primary btn-sm mb-2 w-100"
            onClick={() => onEditar(tipoPedido)}
          >
            Editar
          </button>
          <button
            className="btn btn-danger btn-sm w-100"
            onClick={() => onEliminar(tipoPedido.id_tipo_pedido)}
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}

TipoPedidoRow.propTypes = {
  tipoPedido: PropTypes.shape({
    id_tipo_pedido: PropTypes.number.isRequired,
    nombre_tipo_pedido: PropTypes.string.isRequired,
  }).isRequired,
  onEliminar: PropTypes.func.isRequired,
  onEditar: PropTypes.func.isRequired,
};

export default function ConsultarTipoPedido() {
  const [tipoPedido, setTipoPedido] = useState([]);
  const [consultar, setConsultar] = useState("");
  const [editingTipoPedido, setEditingTipoPedido] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const consultarTipoPedido = () => {
    Axios.get("http://localhost:3000/api/tiposPedidos")
      .then((response) => {
        setTipoPedido(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error("Error en la consulta los tipos de pedidos:", error);
        setError(
          "Hubo un error al cargar los tipos de pedidos. Por favor, intenta nuevamente."
        );
      });
  };

  const eliminarTipoPedido = (id) => {
    Axios.delete(`http://localhost:3000/api/tiposPedidos/${id}`)
      .then(() => {
        setTipoPedido((prevTipoPedido) =>
          prevTipoPedido.filter((tipoPedido) => tipoPedido.id_tipo_pedido !== id)
        );

      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleNombreChange = (e) => {
    const updated = {
      ...editingTipoPedido,
      nombre_tipo_pedido: e.target.value,
    };
    setEditingTipoPedido(updated);
  };

  //ESTAAS FUNCIONES SON PARA ABRIR Y CERRAR LA VENTANA EMERGENTE(MODAL)
  const openModal = (tipoPedido) => {
    if (tipoPedido) {
      setEditingTipoPedido(tipoPedido);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const editarTipoPedido = () => {
    Axios.put(`http://localhost:3000/api/tiposPedidos/${editingTipoPedido.id_tipo_pedido}`, {
      nombre_tipo_pedido: editingTipoPedido.nombre_tipo_pedido,
    })
      .then(() => {
        consultarTipoPedido();  // Llama a la función que actualiza la lista de clientes
        closeModal();  // Cierra el modal después de guardar los cambios
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const resultadoFiltrado = useMemo(() => {
    return consultar
      ? tipoPedido.filter((dato) =>
        dato.nombre_tipo_pedido.toLowerCase().includes(consultar.toLowerCase())
      )
      : tipoPedido;
  }, [consultar, tipoPedido]);

  useEffect(() => {
    consultarTipoPedido();
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
              <h1 className="text-center w-100 mb-0">Consultar tipos de pedidos</h1>
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
              placeholder="Consulta los tipos de pedidos"
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
                <th style={{ width: '60%' }}>Tipos de pedidos</th>
                <th style={{ width: '40%' }}>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {resultadoFiltrado.length > 0 ? (
                resultadoFiltrado.map((tipoPedido) => (
                  <TipoPedidoRow
                    key={tipoPedido.id_tipo_pedido}
                    tipoPedido={tipoPedido}
                    onEliminar={eliminarTipoPedido}
                    onEditar={openModal}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="2">No hay tipos de pedidos creados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Editar el tipo de pedido"
        className="custom-modal modal-dialog modal-dialog-scrollable modal-dialog-centered"
        overlayClassName="custom-overlay modal-backdrop"
        ariaHideApp={false}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Tipo de pedido</h5>
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
                <label htmlFor="nombreTipoPedido" className="form-label">
                  Tipo de pedido:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre_tipo_pedido"
                  value={editingTipoPedido?.nombre_tipo_pedido || ""}
                  onChange={handleNombreChange}
                />
              </div>
            </form>
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <button
              type="button"
              className="btn btn-success w-50"
              onClick={editarTipoPedido}
            >
              <i className="bi bi-save"></i> Guardar Cambios
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

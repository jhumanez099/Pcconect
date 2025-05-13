import Axios from "axios";
import NavBar from "../../components/Navbar";
import Modal from "react-modal";
import PropTypes from "prop-types";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function PedidoRow({ pedido, onEditar, onEliminar }) {
  return (
    <tr>
      <td>{pedido.fecha_inicio_pedido ? new Date(pedido.fecha_inicio_pedido).toLocaleDateString("es-CO") : "Sin fecha"}</td>
      <td>{pedido.fecha_fin_pedido ? new Date(pedido.fecha_fin_pedido).toLocaleDateString("es-CO") : "Sin fecha"}</td>
      <td>{pedido.nombre_cliente}</td>
      <td>{pedido.nombre_usuario}</td>
      <td>{pedido.nombre_tipo_pedido}</td>
      <td>{pedido.precio_total_pedido}</td>
      <td>{pedido.estado_pedido}</td>
      <td>{pedido.motivo_pedido}</td>
      <td>
        <div className="d-flex flex-column align-items-center gap-2">
          <button className="btn btn-primary btn-sm w-100" onClick={() => onEditar(pedido)}>Editar</button>
          <button className="btn btn-danger btn-sm w-100" onClick={() => onEliminar(pedido.id_pedido)}>Eliminar</button>
        </div>
      </td>
    </tr>
  );
}

PedidoRow.propTypes = {
  pedido: PropTypes.object.isRequired,
  onEditar: PropTypes.func.isRequired,
  onEliminar: PropTypes.func.isRequired,
};

export default function ConsultarPedido() {
  const [pedidos, setPedidos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [editingPedido, setEditingPedido] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [tiposPedido, setTiposPedido] = useState([]);
  const navigate = useNavigate();

  const obtenerPedidos = () => {
    Axios.get("http://localhost:3000/api/pedidos", { withCredentials: true })
      .then((res) => setPedidos(res.data))
      .catch(() => alert("Error al cargar los pedidos."));
  };

  const obtenerDatos = () => {
    Axios.get("http://localhost:3000/api/clientes", { withCredentials: true }).then((res) => setClientes(res.data));
    Axios.get("http://localhost:3000/api/usuarios", { withCredentials: true }).then((res) => setUsuarios(res.data));
    Axios.get("http://localhost:3000/api/tiposPedidos", { withCredentials: true }).then((res) => setTiposPedido(res.data));
  };

  const eliminarPedido = (id) => {
    Axios.delete(`http://localhost:3000/api/pedidos/${id}`, { withCredentials: true })
      .then(() => {
        setPedidos((prev) => prev.filter((p) => p.id_pedido !== id));
        alert("Pedido eliminado correctamente.");
      })
      .catch((err) => console.error(err));
  };

  const openModal = (pedido) => {
    const tipo = tiposPedido.find(t => t.nombre_tipo_pedido === pedido.nombre_tipo_pedido);
    setEditingPedido({
      ...pedido,
      id_tipo_pedido: tipo?.id_tipo_pedido || "",
      fecha_inicio_pedido: pedido.fecha_inicio_pedido?.split("T")[0] || "",
      fecha_fin_pedido: pedido.fecha_fin_pedido?.split("T")[0] || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingPedido(null);
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingPedido((prev) => ({ ...prev, [name]: value }));
  };

  const editarPedido = () => {
    Axios.put(`http://localhost:3000/api/pedidos/${editingPedido.id_pedido}`, editingPedido, {
      withCredentials: true,
    })
      .then(() => {
        obtenerPedidos();
        alert("Pedido actualizado con éxito.");
        closeModal();
      })
      .catch((err) => console.error(err));
  };

  const pedidosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase();
    return pedidos.filter((p) =>
      [
        p.fecha_inicio_pedido,
        p.fecha_fin_pedido,
        p.nombre_cliente,
        p.nombre_usuario,
        p.nombre_tipo_pedido,
        p.estado_pedido,
        p.motivo_pedido,
      ].join(" ").toLowerCase().includes(texto)
    );
  }, [busqueda, pedidos]);

  useEffect(() => {
    obtenerPedidos();
    obtenerDatos();
  }, []);

  return (
    <div className="min-vh-100 d-flex flex-column bg-secondary">
      <NavBar />
      <div className="d-flex justify-content-center align-items-center flex-grow-1 px-3">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-6 bg-white rounded card shadow p-4 m-4">
          <div className="row gx-5">
            <div className="col-12 d-flex justify-content-between align-items-center mb-3">
              <button onClick={() => navigate("/MenuPrincipal")} className="btn btn-primary btn-sm">← Regresar</button>
              <h1 className="text-center w-100 mb-0">Consultar pedidos</h1>
            </div>
          </div>
          <div className="input-group mb-1">
            <span className="input-group-text">🔍︎</span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar pedidos"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container-fluid px-3">
        <div className="table-responsive">
          <table className="table table-striped table-hover mt-5 shadow-lg text-center">
            <thead className="bg-white text-dark">
              <tr>
                <th>Fecha inicio</th>
                <th>Fecha fin</th>
                <th>Cliente</th>
                <th>Usuario</th>
                <th>Tipo</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Motivo</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.length > 0 ? (
                pedidosFiltrados.map((p) => (
                  <PedidoRow
                    key={p.id_pedido}
                    pedido={p}
                    onEditar={openModal}
                    onEliminar={eliminarPedido}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="9">No hay pedidos registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Editar pedido"
        className="custom-modal"
        overlayClassName="custom-overlay"
        ariaHideApp={false}
      >
        <div className="modal-content">
          <div className="modal-header justify-content-center mb-3">
            <h5 className="modal-title text-center w-100">Editar Pedido</h5>
            <button className="btn-close position-absolute end-0 me-3" onClick={closeModal}></button>
          </div>
          <div className="modal-body">
            {editingPedido && (
              <form>
                {[
                  { label: "Fecha inicio", id: "fecha_inicio_pedido", type: "date" },
                  { label: "Fecha fin", id: "fecha_fin_pedido", type: "date" },
                  { label: "Precio total", id: "precio_total_pedido", type: "number" },
                  { label: "Motivo", id: "motivo_pedido", type: "text" },
                ].map((field, idx) => (
                  <div className="mb-3 row align-items-center" key={idx}>
                    <label htmlFor={field.id} className="col-sm-4 col-form-label text-end">{field.label}:</label>
                    <div className="col-sm-8">
                      <input
                        type={field.type}
                        className="form-control"
                        id={field.id}
                        name={field.id}
                        value={editingPedido[field.id] || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                ))}

                <div className="mb-3 row align-items-center">
                  <label htmlFor="estado_pedido" className="col-sm-4 col-form-label text-end">Estado:</label>
                  <div className="col-sm-8">
                    <select className="form-select" id="estado_pedido" name="estado_pedido" value={editingPedido.estado_pedido} onChange={handleChange}>
                      <option value="Activo">Activo</option>
                      <option value="Finalizado">Finalizado</option>
                      <option value="Anulado">Anulado</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3 row align-items-center">
                  <label htmlFor="id_cliente" className="col-sm-4 col-form-label text-end">Cliente:</label>
                  <div className="col-sm-8">
                    <select className="form-select" id="id_cliente" name="id_cliente" value={editingPedido.id_cliente} onChange={handleChange}>
                      <option value="">Seleccione...</option>
                      {clientes.map((c) => (
                        <option key={c.id_cliente} value={c.id_cliente}>{c.nombre_cliente}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3 row align-items-center">
                  <label htmlFor="id_usuario" className="col-sm-4 col-form-label text-end">Usuario:</label>
                  <div className="col-sm-8">
                    <select className="form-select" id="id_usuario" name="id_usuario" value={editingPedido.id_usuario} onChange={handleChange}>
                      <option value="">Seleccione...</option>
                      {usuarios.map((u) => (
                        <option key={u.id_usuario} value={u.id_usuario}>{u.nombre_usuario}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3 row align-items-center">
                  <label htmlFor="id_tipo_pedido" className="col-sm-4 col-form-label text-end">Tipo pedido:</label>
                  <div className="col-sm-8">
                    <select className="form-select" id="id_tipo_pedido" name="id_tipo_pedido" value={editingPedido.id_tipo_pedido} onChange={handleChange}>
                      <option value="">Seleccione...</option>
                      {tiposPedido.map((t) => (
                        <option key={t.id_tipo_pedido} value={t.id_tipo_pedido}>{t.nombre_tipo_pedido}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </form>
            )}
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <button className="btn btn-success w-50" onClick={editarPedido}>Guardar Cambios</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


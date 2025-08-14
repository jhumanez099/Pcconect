// ConsultarPedido.jsx - MODAL EDITAR CON TODOS LOS CAMPOS INCLUIDOS
import Axios from "axios";
import NavBar from "../../components/Navbar";
import Modal from "react-modal";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function ConsultarPedido() {
  const [pedidos, setPedidos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [editingPedido, setEditingPedido] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [tiposPedido, setTiposPedido] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [eliminados, setEliminados] = useState([]);
  const [verDetalles, setVerDetalles] = useState([]);
  const [isVerModalOpen, setIsVerModalOpen] = useState(false);

  
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
    Axios.get("http://localhost:3000/api/equipos", { withCredentials: true }).then((res) => setEquipos(res.data));
  };
  
  const openVerModal = (pedido) => {
    Axios.get(`http://localhost:3000/api/pedidos/${pedido.id_pedido}/detalle`, { withCredentials: true })
      .then(res => setVerDetalles(res.data))
      .catch(() => alert("Error al cargar detalles del pedido"));
    setIsVerModalOpen(true);
  };

  const openModal = (pedido) => {
    const tipo = tiposPedido.find(t => t.nombre_tipo_pedido === pedido.nombre_tipo_pedido);
    setEditingPedido({
      ...pedido,
      id_tipo_pedido: tipo?.id_tipo_pedido || "",
      fecha_inicio_pedido: pedido.fecha_inicio_pedido?.split("T")[0] || "",
      fecha_fin_pedido: pedido.fecha_fin_pedido?.split("T")[0] || "",
    });
    Axios.get(`http://localhost:3000/api/pedidos/${pedido.id_pedido}/detalle`, { withCredentials: true })
      .then(res => setDetalles(res.data.map(d => ({
        ...d,
        cantidad: d.cantidad_detalle_pedido,
        precio_unitario: d.precio_unitario_detalle_pedido,
        subtotal: d.subtotal_detalle_pedido,
        fecha_inicio: d.fecha_inicio_detalle_pedido.split("T")[0],
        fecha_fin: d.fecha_fin_detalle_pedido.split("T")[0]
      }))))
      .catch(() => alert("Error al cargar detalles del pedido"));
    setIsModalOpen(true);
    setEliminados([]);
  };

  const eliminarDetalle = (id_detalle) => {
    const confirmar = window.confirm("¿Estás seguro de eliminar este detalle?");
    if (!confirmar) return;
    setDetalles((prev) => prev.filter((d) => d.id_detalle_pedido !== id_detalle));
    setEliminados((prev) => [...prev, id_detalle]);
  };

  const eliminarPedido = (id) => {
    const confirmar = window.confirm("¿Estás seguro de eliminar este pedido?");
    if (!confirmar) return;
    Axios.delete(`http://localhost:3000/api/pedidos/${id}`, { withCredentials: true })
      .then(() => {
        setPedidos((prev) => prev.filter((p) => p.id_pedido !== id));
        alert("Pedido eliminado correctamente.");
      })
      .catch((err) => console.error(err));
      alert("Hubo un problema al eliminar el pedido!!")
  };
  

  const handleDetalleChange = (index, field, value) => {
    const nuevos = [...detalles];
    nuevos[index][field] = field === "cantidad" || field === "precio_unitario" ? parseFloat(value) : value;
    nuevos[index].subtotal = nuevos[index].cantidad * nuevos[index].precio_unitario;
    setDetalles(nuevos);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditingPedido(prev => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPedido(null);
    setDetalles([]);
    setEliminados([]);
  };

  const editarPedido = () => {
    const total = detalles.reduce((acc, d) => acc + d.subtotal, 0);
    const datos = {
      ...editingPedido,
      precio_total_pedido: total,
      eliminados,
      detalles
    };
    
    Axios.put(`http://localhost:3000/api/pedidos/${editingPedido.id_pedido}`, datos, { withCredentials: true })
      .then(() => {
        alert("Pedido actualizado con éxito.");
        obtenerPedidos();
        closeModal();
      })
      .catch((err) => console.error(err));
      alert("Hubo un problema al editar el pedido!!")
  };

  useEffect(() => {
    obtenerPedidos();
    obtenerDatos();
  }, []);

  const pedidosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase();
    return pedidos.filter((p) => [
      p.fecha_inicio_pedido,
      p.fecha_fin_pedido,
      p.nombre_cliente,
      p.nombre_usuario,
      p.nombre_tipo_pedido,
      p.estado_pedido,
      p.motivo_pedido
    ].join(" ").toLowerCase().includes(texto));
  }, [busqueda, pedidos]);

  return (
    <div className="min-vh-100 d-flex flex-column">
      <NavBar />
      <div className="d-flex justify-content-center align-items-center flex-grow-1 px-2">
        <div className="w-100 bg-white rounded card shadow p-4 m-4" style={{ maxWidth: "1000px" }}>
          <div className="mb-4 position-relative">
            <button className="btn btn-outline-primary position-absolute start-0" onClick={() => navigate('/MenuPrincipal')}>← Menú principal</button>
            <h1 className="text-center">Consultar pedidos</h1>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text">🔍︎</span>
            <input type="text" className="form-control" placeholder="Buscar pedidos" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          </div>

          <div className="table-responsive">
            <table className="table table-bordered text-center">
              <thead className="table-light">
                <tr>
                  <th>Fecha inicio</th>
                  <th>Fecha fin</th>
                  <th>Cliente</th>
                  <th>Usuario</th>
                  <th>Tipo</th>
                  <th>Precio Total</th>
                  <th>Estado</th>
                  <th>Motivo</th>
                  <th>Detalle</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidosFiltrados.map((p) => (
                  <tr key={p.id_pedido}>
                    <td>{new Date(p.fecha_inicio_pedido).toLocaleDateString("es-CO")}</td>
                    <td>{new Date(p.fecha_fin_pedido).toLocaleDateString("es-CO")}</td>
                    <td>{p.nombre_cliente}</td>
                    <td>{p.nombre_usuario}</td>
                    <td>{p.nombre_tipo_pedido}</td>
                    <td>{Number(p.precio_total_pedido).toLocaleString("es-CO", { style: "currency", currency: "COP" })}</td>
                    <td>{p.estado_pedido}</td>
                    <td>{p.motivo_pedido}</td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => openVerModal(p)}>
                        📦 Ver
                      </button>
                    </td>
                    <td>
                      <button className="btn btn-primary btn-sm mb-1" onClick={() => openModal(p)}>
                        Editar
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => eliminarPedido(p.id_pedido)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} ariaHideApp={false}>
        <div className="modal-content">
          <div className="modal-header justify-content-center mb-3">
            <h5 className="modal-title text-center w-100">Editar Pedido</h5>
            <button className="btn-close position-absolute end-0 me-3" onClick={closeModal}></button>
          </div>
          <div className="modal-body">
            {editingPedido && (
              <form>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Fecha inicio</label>
                    <input type="date" className="form-control" name="fecha_inicio_pedido" value={editingPedido.fecha_inicio_pedido} onChange={handleFieldChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Fecha fin</label>
                    <input type="date" className="form-control" name="fecha_fin_pedido" value={editingPedido.fecha_fin_pedido} onChange={handleFieldChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Cliente</label>
                    <select className="form-select" name="id_cliente" value={editingPedido.id_cliente} onChange={handleFieldChange}>
                      <option value="">Seleccione...</option>
                      {clientes.map(c => <option key={c.id_cliente} value={c.id_cliente}>{c.nombre_cliente}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Usuario</label>
                    <select className="form-select" name="id_usuario" value={editingPedido.id_usuario} onChange={handleFieldChange}>
                      <option value="">Seleccione...</option>
                      {usuarios.map(u => <option key={u.id_usuario} value={u.id_usuario}>{u.nombre_usuario}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Tipo</label>
                    <select className="form-select" name="id_tipo_pedido" value={editingPedido.id_tipo_pedido} onChange={handleFieldChange}>
                      <option value="">Seleccione...</option>
                      {tiposPedido.map(t => <option key={t.id_tipo_pedido} value={t.id_tipo_pedido}>{t.nombre_tipo_pedido}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Estado</label>
                    <select className="form-select" name="estado_pedido" value={editingPedido.estado_pedido} onChange={handleFieldChange}>
                      <option value="Activo">Activo</option>
                      <option value="Finalizado">Finalizado</option>
                      <option value="Anulado">Anulado</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Motivo</label>
                    <input type="text" className="form-control" name="motivo_pedido" value={editingPedido.motivo_pedido} onChange={handleFieldChange} />
                  </div>
                </div>

                <h5 className="mt-4">Detalles del pedido</h5>
                <div className="table-responsive">
                  <table className="table table-bordered text-center">
                    <thead><tr><th>Equipo</th><th>Cant</th><th>Precio</th><th>Subtotal</th><th>Desde</th><th>Hasta</th><th>Acción</th></tr></thead>
                    <tbody>
                      {detalles.map((d, i) => (
                        <tr key={i}>
                          <td>{equipos.find(eq => eq.id_equipo === d.id_equipo)?.modelo_equipo || "Equipo"}</td>
                          <td><input type="number" className="form-control" value={d.cantidad} onChange={e => handleDetalleChange(i, 'cantidad', e.target.value)} /></td>
                          <td><input type="number" className="form-control" value={d.precio_unitario} onChange={e => handleDetalleChange(i, 'precio_unitario', e.target.value)} /></td>
                          <td>{(d.cantidad * d.precio_unitario).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                          <td><input type="date" className="form-control" value={d.fecha_inicio} onChange={e => handleDetalleChange(i, 'fecha_inicio', e.target.value)} /></td>
                          <td><input type="date" className="form-control" value={d.fecha_fin} onChange={e => handleDetalleChange(i, 'fecha_fin', e.target.value)} /></td>
                          <td><button className="btn btn-danger btn-sm" onClick={() => eliminarDetalle(d.id_detalle_pedido)}>Eliminar</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </form>
            )}
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <button className="btn btn-success px-4" onClick={editarPedido}>Guardar Cambios</button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={isVerModalOpen} onRequestClose={() => setIsVerModalOpen(false)} ariaHideApp={false}>
        <div className="bg-white rounded card shadow p-4" style={{ maxWidth: "800px", margin: "auto" }}>
          <h3 className="text-center mb-3">Detalle del pedido</h3>
          <table className="table table-bordered text-center">
            <thead><tr><th>Equipo</th><th>Cant</th><th>Precio</th><th>Subtotal</th><th>Desde</th><th>Hasta</th></tr></thead>
            <tbody>
              {verDetalles.map((d, i) => (
                <tr key={i}>
                  <td>{d.marca_equipo} - {d.modelo_equipo}</td>
                  <td>{d.cantidad_detalle_pedido}</td>
                  <td>{Number(d.precio_unitario_detalle_pedido).toLocaleString("es-CO", { style: "currency", currency: "COP" })}</td>
                  <td>{Number(d.subtotal_detalle_pedido).toLocaleString("es-CO", { style: "currency", currency: "COP" })}</td>
                  <td>{d.fecha_inicio_detalle_pedido?.split("T")[0]}</td>
                  <td>{d.fecha_fin_detalle_pedido?.split("T")[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-center">
            <button className="btn btn-danger" onClick={() => setIsVerModalOpen(false)}>Cerrar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

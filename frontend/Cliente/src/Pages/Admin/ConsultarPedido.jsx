// ConsultarPedido.jsx — edición completa con UX mejorada
import Axios from "axios";
import NavBar from "../../components/Navbar";
import Modal from "react-modal";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ConsultarPedido() {
  const navigate = useNavigate();

  // Catálogos
  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [tiposPedido, setTiposPedido] = useState([]);
  const [equipos, setEquipos] = useState([]);

  // Pedidos
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Búsqueda
  const [busqueda, setBusqueda] = useState("");
  const [debounced, setDebounced] = useState("");

  // Edición
  const [editingPedido, setEditingPedido] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [eliminados, setEliminados] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Ver detalles
  const [isVerModalOpen, setIsVerModalOpen] = useState(false);
  const [verDetalles, setVerDetalles] = useState([]);

  // Confirmaciones
  const [confirmDeleteDetalleId, setConfirmDeleteDetalleId] = useState(null);
  const [confirmDeletePedidoId, setConfirmDeletePedidoId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const mounted = useRef(true);

  const styles = `
    .liftable{transition:transform .15s ease,box-shadow .15s ease}
    .liftable:hover{transform:translateY(-2px);box-shadow:0 .5rem 1rem rgba(0,0,0,.08)}
    .custom-overlay{background:rgba(0,0,0,.5)}
    .custom-modal{position:relative;margin:auto;max-width:980px;outline:none}
    .table thead th{position:sticky;top:0;z-index:1}
  `;

  const fmtCOP = (n) => new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP"}).format(Number(n||0));
  const ymd = (d) => (d ? new Date(d).toISOString().slice(0,10) : "");

  const fetchCatalogos = async () => {
    const [c, u, t, e] = await Promise.all([
      Axios.get("http://localhost:3000/api/clientes", { withCredentials: true }),
      Axios.get("http://localhost:3000/api/usuarios", { withCredentials: true }),
      Axios.get("http://localhost:3000/api/tiposPedidos", { withCredentials: true }),
      Axios.get("http://localhost:3000/api/equipos", { withCredentials: true }),
    ]);
    setClientes(c.data || []);
    setUsuarios(u.data || []);
    setTiposPedido(t.data || []);
    setEquipos(e.data || []);
  };

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const res = await Axios.get("http://localhost:3000/api/pedidos", { withCredentials: true });
      if (!mounted.current) return;
      setPedidos(res.data || []);
      setLoadError(null);
    } catch {
      setLoadError("Error al cargar los pedidos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    mounted.current = true;
    (async () => {
      await Promise.allSettled([fetchCatalogos(), fetchPedidos()]);
    })();
    return () => { mounted.current = false; };
  }, []);

  // debounce búsqueda
  useEffect(() => {
    const t = setTimeout(() => setDebounced(busqueda.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [busqueda]);

  const pedidosFiltrados = useMemo(() => {
    if (!debounced) return pedidos;
    return pedidos.filter((p) =>
      [
        p.fecha_inicio_pedido,
        p.fecha_fin_pedido,
        p.nombre_cliente,
        p.nombre_usuario,
        p.nombre_tipo_pedido,
        p.estado_pedido,
        p.motivo_pedido
      ].join(" ").toLowerCase().includes(debounced)
    );
  }, [debounced, pedidos]);

  // Ver detalles (solo lectura)
  const openVerModal = async (pedido) => {
    try {
      const res = await Axios.get(`http://localhost:3000/api/pedidos/${pedido.id_pedido}/detalle`, { withCredentials: true });
      setVerDetalles(res.data || []);
      setIsVerModalOpen(true);
    } catch {
      alert("Error al cargar detalles del pedido");
    }
  };

  // Abrir modal de edición (pre-cargar IDs + mapa de detalles)
  const openModal = async (pedido) => {
    // Intentar usar IDs si vienen del backend; si no, mapear por nombre
    const id_cliente = pedido.id_cliente ?? (clientes.find(c => c.nombre_cliente === pedido.nombre_cliente)?.id_cliente || "");
    const id_usuario = pedido.id_usuario ?? (usuarios.find(u => u.nombre_usuario === pedido.nombre_usuario)?.id_usuario || "");
    const id_tipo_pedido = pedido.id_tipo_pedido ?? (tiposPedido.find(t => t.nombre_tipo_pedido === pedido.nombre_tipo_pedido)?.id_tipo_pedido || "");

    setEditingPedido({
      ...pedido,
      id_cliente,
      id_usuario,
      id_tipo_pedido,
      fecha_inicio_pedido: ymd(pedido.fecha_inicio_pedido),
      fecha_fin_pedido: ymd(pedido.fecha_fin_pedido),
    });

    try {
      const res = await Axios.get(`http://localhost:3000/api/pedidos/${pedido.id_pedido}/detalle`, { withCredentials: true });
      const dets = (res.data || []).map(d => ({
        ...d,
        // normaliza campos de edición
        id_detalle_pedido: d.id_detalle_pedido,
        id_equipo: d.id_equipo,
        cantidad: Number(d.cantidad_detalle_pedido),
        precio_unitario: Number(d.precio_unitario_detalle_pedido),
        fecha_inicio: ymd(d.fecha_inicio_detalle_pedido),
        fecha_fin: ymd(d.fecha_fin_detalle_pedido),
      }));
      setDetalles(dets);
      setEliminados([]);
      setIsModalOpen(true);
    } catch {
      alert("Error al cargar detalles del pedido");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPedido(null);
    setDetalles([]);
    setEliminados([]);
  };

  // Edición de campos del pedido
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditingPedido(prev => ({ ...prev, [name]: value }));
  };

  // Edición de un detalle
  const handleDetalleChange = (index, field, value) => {
    setDetalles(prev => {
      const next = [...prev];
      if (field === "cantidad" || field === "precio_unitario") {
        next[index][field] = Math.max(0, Number(value || 0));
      } else {
        next[index][field] = value;
      }
      return next;
    });
  };

  // Confirmar eliminación de un detalle
  const eliminarDetalleAsk = (id_detalle) => setConfirmDeleteDetalleId(id_detalle);
  const eliminarDetalleConfirm = () => {
    setDetalles(prev => prev.filter(d => d.id_detalle_pedido !== confirmDeleteDetalleId));
    setEliminados(prev => [...prev, confirmDeleteDetalleId]);
    setConfirmDeleteDetalleId(null);
  };

  // Confirmar eliminación de pedido
  const eliminarPedidoAsk = (id) => setConfirmDeletePedidoId(id);
  const eliminarPedidoConfirm = async () => {
    try {
      setDeleting(true);
      await Axios.delete(`http://localhost:3000/api/pedidos/${confirmDeletePedidoId}`, { withCredentials: true });
      setPedidos(prev => prev.filter(p => p.id_pedido !== confirmDeletePedidoId));
    } catch (e) {
      console.error(e);
      alert("No se pudo eliminar el pedido.");
    } finally {
      setDeleting(false);
      setConfirmDeletePedidoId(null);
    }
  };

  // Total en vivo dentro del modal
  const totalEdit = useMemo(() => {
    return detalles.reduce((acc, d) => acc + Number(d.cantidad || 0) * Number(d.precio_unitario || 0), 0);
  }, [detalles]);

  // Guardar cambios del pedido
  const editarPedido = async () => {
    try {
      setSaving(true);
      const datos = {
        ...editingPedido,
        // asegurar formato fecha
        fecha_inicio_pedido: editingPedido.fecha_inicio_pedido,
        fecha_fin_pedido: editingPedido.fecha_fin_pedido,
        precio_total_pedido: totalEdit,
        eliminados,
        detalles: detalles.map(d => ({
          id_detalle_pedido: d.id_detalle_pedido,
          id_equipo: d.id_equipo,
          cantidad: Number(d.cantidad),
          precio_unitario: Number(d.precio_unitario),
          fecha_inicio: d.fecha_inicio,
          fecha_fin: d.fecha_fin,
        })),
      };

      await Axios.put(`http://localhost:3000/api/pedidos/${editingPedido.id_pedido}`, datos, { withCredentials: true });
      alert("Pedido actualizado con éxito.");
      await fetchPedidos();
      closeModal();
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar el pedido.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <style>{styles}</style>
      <NavBar />

      <div className="d-flex justify-content-center align-items-center flex-grow-1 px-2">
        <div className="w-100 bg-white rounded card shadow p-4 m-4 liftable" style={{ maxWidth: "1100px" }}>
          <div className="mb-4 position-relative">
            <button className="btn btn-outline-primary position-absolute start-0" onClick={() => navigate('/MenuPedido')}>
              ← Menú Pedido
            </button>
            <h1 className="text-center h4">Consultar pedidos</h1>
          </div>

          <div className="input-group mb-3" style={{ maxWidth: 480 }}>
            <span className="input-group-text"><i className="bi bi-search" /></span>
            <input
              type="search"
              className="form-control"
              placeholder="Buscar pedidos"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {busqueda && (
              <button className="btn btn-outline-secondary" onClick={() => setBusqueda("")} title="Limpiar">
                <i className="bi bi-x-lg" />
              </button>
            )}
          </div>

          {loadError && (
            <div className="alert alert-danger d-flex align-items-center justify-content-between">
              <span>{loadError}</span>
              <button className="btn btn-sm btn-outline-danger" onClick={fetchPedidos}>Reintentar</button>
            </div>
          )}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status" />
              <p className="text-body-secondary mt-2">Cargando…</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle text-center">
                <thead className="table-light">
                  <tr>
                    <th>Fecha inicio</th>
                    <th>Fecha fin</th>
                    <th>Cliente</th>
                    <th>Usuario</th>
                    <th>Tipo</th>
                    <th>Precio</th>
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
                      <td>{fmtCOP(p.precio_total_pedido)}</td>
                      <td>
                        <span className={`badge ${p.estado_pedido === "Activo" ? "bg-success" : p.estado_pedido === "Finalizado" ? "bg-primary" : "bg-secondary"}`}>
                          {p.estado_pedido}
                        </span>
                      </td>
                      <td className="text-start">{p.motivo_pedido}</td>
                      <td>
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => openVerModal(p)}>
                          📦 Ver
                        </button>
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm" role="group">
                          <button className="btn btn-outline-primary" onClick={() => openModal(p)}>Editar</button>
                          <button className="btn btn-outline-danger" onClick={() => eliminarPedidoAsk(p.id_pedido)}>Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pedidosFiltrados.length === 0 && (
                    <tr>
                      <td colSpan="10" className="text-center text-body-secondary py-4">Sin resultados.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal editar */}
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} className="custom-modal" overlayClassName="custom-overlay" ariaHideApp={false}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Pedido</h5>
            <button className="btn-close" onClick={closeModal} />
          </div>

          <div className="modal-body">
            {editingPedido && (
              <>
                <form>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Fecha inicio</label>
                      <input
                        type="date"
                        name="fecha_inicio_pedido"
                        className="form-control"
                        value={editingPedido.fecha_inicio_pedido || ""}
                        onChange={handleFieldChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Fecha fin</label>
                      <input
                        type="date"
                        name="fecha_fin_pedido"
                        className="form-control"
                        value={editingPedido.fecha_fin_pedido || ""}
                        onChange={handleFieldChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Cliente</label>
                      <select name="id_cliente" className="form-select" value={editingPedido.id_cliente || ""} onChange={handleFieldChange}>
                        <option value="">Seleccione…</option>
                        {clientes.map(c => <option key={c.id_cliente} value={c.id_cliente}>{c.nombre_cliente}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Usuario</label>
                      <select name="id_usuario" className="form-select" value={editingPedido.id_usuario || ""} onChange={handleFieldChange}>
                        <option value="">Seleccione…</option>
                        {usuarios.map(u => <option key={u.id_usuario} value={u.id_usuario}>{u.nombre_usuario}</option>)}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Tipo</label>
                      <select name="id_tipo_pedido" className="form-select" value={editingPedido.id_tipo_pedido || ""} onChange={handleFieldChange}>
                        <option value="">Seleccione…</option>
                        {tiposPedido.map(t => <option key={t.id_tipo_pedido} value={t.id_tipo_pedido}>{t.nombre_tipo_pedido}</option>)}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Estado</label>
                      <select name="estado_pedido" className="form-select" value={editingPedido.estado_pedido || ""} onChange={handleFieldChange}>
                        <option value="Activo">Activo</option>
                        <option value="Finalizado">Finalizado</option>
                        <option value="Anulado">Anulado</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label">Motivo</label>
                      <input
                        type="text"
                        name="motivo_pedido"
                        className="form-control"
                        value={editingPedido.motivo_pedido || ""}
                        onChange={handleFieldChange}
                      />
                    </div>
                  </div>
                </form>

                <div className="d-flex align-items-center justify-content-between mt-4">
                  <h5 className="mb-0">Detalles del pedido</h5>
                  <div className="text-end">
                    <span className="fw-semibold">Total: {fmtCOP(totalEdit)}</span>
                  </div>
                </div>

                <div className="table-responsive mt-2">
                  <table className="table table-hover align-middle text-center">
                    <thead className="table-light">
                      <tr>
                        <th>Equipo</th>
                        <th style={{width:110}}>Cant</th>
                        <th style={{width:150}}>Precio</th>
                        <th style={{width:150}}>Subtotal</th>
                        <th style={{width:160}}>Desde</th>
                        <th style={{width:160}}>Hasta</th>
                        <th className="text-end" style={{width:140}}>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detalles.map((d, i) => {
                        const subtotal = Number(d.cantidad || 0) * Number(d.precio_unitario || 0);
                        return (
                          <tr key={d.id_detalle_pedido || i}>
                            <td className="text-start">
                              <select
                                className="form-select"
                                value={d.id_equipo || ""}
                                onChange={(e) => handleDetalleChange(i, "id_equipo", e.target.value)}
                              >
                                <option value="">Seleccione…</option>
                                {equipos.map(eq => (
                                  <option key={eq.id_equipo} value={eq.id_equipo}>
                                    {eq.marca_equipo} - {eq.modelo_equipo}
                                  </option>
                                ))}
                              </select>
                            </td>

                            <td>
                              <input
                                type="number"
                                min="0"
                                step="1"
                                className="form-control"
                                value={d.cantidad}
                                onChange={(e) => handleDetalleChange(i, "cantidad", e.target.value)}
                              />
                            </td>

                            <td>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                className="form-control"
                                value={d.precio_unitario}
                                onChange={(e) => handleDetalleChange(i, "precio_unitario", e.target.value)}
                              />
                            </td>

                            <td className="text-nowrap">{fmtCOP(subtotal)}</td>

                            <td>
                              <input
                                type="date"
                                className="form-control"
                                value={d.fecha_inicio || ""}
                                onChange={(e) => handleDetalleChange(i, "fecha_inicio", e.target.value)}
                                max={editingPedido.fecha_fin_pedido || undefined}
                              />
                            </td>
                            <td>
                              <input
                                type="date"
                                className="form-control"
                                value={d.fecha_fin || ""}
                                onChange={(e) => handleDetalleChange(i, "fecha_fin", e.target.value)}
                                min={d.fecha_inicio || editingPedido.fecha_inicio_pedido || undefined}
                                max={editingPedido.fecha_fin_pedido || undefined}
                              />
                            </td>

                            <td className="text-end">
                              <button className="btn btn-outline-danger btn-sm" onClick={() => eliminarDetalleAsk(d.id_detalle_pedido)}>
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {detalles.length === 0 && (
                        <tr>
                          <td colSpan="7" className="text-center text-body-secondary">Este pedido no tiene detalles.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={closeModal} disabled={saving}>Cancelar</button>
            <button className="btn btn-success px-4" onClick={editarPedido} disabled={saving}>
              {saving ? (<><span className="spinner-border spinner-border-sm me-2" />Guardando…</>) : "Guardar Cambios"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal ver detalle (solo lectura) */}
      <Modal isOpen={isVerModalOpen} onRequestClose={() => setIsVerModalOpen(false)} className="custom-modal" overlayClassName="custom-overlay" ariaHideApp={false}>
        <div className="modal-content ">
          <div className="modal-header">
            <h5 className="modal-title">Detalle del pedido</h5>
            <button className="btn-close" onClick={() => setIsVerModalOpen(false)} />
          </div>
          <div className="modal-body">
            <div className="table-responsive">
              <table className="table table-hover text-center align-middle">
                <thead className="table-light">
                  <tr><th>Equipo</th><th>Cant</th><th>Precio</th><th>Subtotal</th><th>Desde</th><th>Hasta</th></tr>
                </thead>
                <tbody>
                  {verDetalles.map((d, i) => (
                    <tr key={i}>
                      <td>{d.marca_equipo} - {d.modelo_equipo}</td>
                      <td>{d.cantidad_detalle_pedido}</td>
                      <td>{fmtCOP(d.precio_unitario_detalle_pedido)}</td>
                      <td>{fmtCOP(d.subtotal_detalle_pedido)}</td>
                      <td>{ymd(d.fecha_inicio_detalle_pedido)}</td>
                      <td>{ymd(d.fecha_fin_detalle_pedido)}</td>
                    </tr>
                  ))}
                  {verDetalles.length === 0 && (
                    <tr><td colSpan="6" className="text-body-secondary">Sin información</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={() => setIsVerModalOpen(false)}>Cerrar</button>
          </div>
        </div>
      </Modal>

      {/* Modal confirmar eliminación de detalle */}
      <Modal isOpen={!!confirmDeleteDetalleId} onRequestClose={() => setConfirmDeleteDetalleId(null)} className="custom-modal" overlayClassName="custom-overlay" ariaHideApp={false}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Eliminar detalle</h5>
            <button className="btn-close" onClick={() => setConfirmDeleteDetalleId(null)} />
          </div>
          <div className="modal-body">¿Seguro que deseas eliminar este detalle?</div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={() => setConfirmDeleteDetalleId(null)}>Cancelar</button>
            <button className="btn btn-danger" onClick={eliminarDetalleConfirm}>Eliminar</button>
          </div>
        </div>
      </Modal>

      {/* Modal confirmar eliminación de pedido */}
      <Modal isOpen={!!confirmDeletePedidoId} onRequestClose={() => setConfirmDeletePedidoId(null)} className="custom-modal" overlayClassName="custom-overlay" ariaHideApp={false}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Eliminar pedido</h5>
            <button className="btn-close" onClick={() => setConfirmDeletePedidoId(null)} />
          </div>
          <div className="modal-body">¿Seguro que deseas eliminar este pedido?</div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={() => setConfirmDeletePedidoId(null)} disabled={deleting}>Cancelar</button>
            <button className="btn btn-danger" onClick={eliminarPedidoConfirm} disabled={deleting}>
              {deleting ? (<><span className="spinner-border spinner-border-sm me-2" />Eliminando…</>) : "Eliminar"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

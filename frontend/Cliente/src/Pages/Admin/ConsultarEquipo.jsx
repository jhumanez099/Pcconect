import Axios from "axios";
import NavBar from "../../components/Navbar";
import Modal from "react-modal";
import PropTypes from "prop-types";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function EquipoRow({ equipo, onEditar, onEliminar }) {
  return (
    <tr>
      <td>{equipo.nombre_tipo_equipo}</td>
      <td>{equipo.modelo_equipo}</td>
      <td>{equipo.marca_equipo}</td>
      <td>{equipo.especificaciones_equipo}</td>
      <td>
        <span className={`badge ${equipo.estado_equipo === "Activo" ? "bg-success" : "bg-secondary"}`}>
          {equipo.estado_equipo}
        </span>
      </td>
      <td>{new Date(equipo.fecha_compra_equipo).toLocaleDateString("es-CO")}</td>
      <td className="text-end">
        <div className="btn-group btn-group-sm" role="group">
          <button className="btn btn-outline-primary" onClick={() => onEditar(equipo)}>
            <i className="bi bi-pencil-square me-1" /> Editar
          </button>
          <button className="btn btn-outline-danger" onClick={() => onEliminar(equipo)}>
            <i className="bi bi-trash me-1" /> Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}
EquipoRow.propTypes = {
  equipo: PropTypes.object.isRequired,
  onEditar: PropTypes.func.isRequired,
  onEliminar: PropTypes.func.isRequired,
};

export default function ConsultarEquipo() {
  const navigate = useNavigate();

  const [equipos, setEquipos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [debounced, setDebounced] = useState("");

  const [editing, setEditing] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [toDelete, setToDelete] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const mounted = useRef(true);

  const styles = `
    .liftable{transition:transform .15s ease,box-shadow .15s ease}
    .liftable:hover{transform:translateY(-2px);box-shadow:0 .5rem 1rem rgba(0,0,0,.08)}
    .custom-overlay{background:rgba(0,0,0,.5)}
    .custom-modal{position:relative;margin:auto;max-width:720px;outline:none}
    .table thead th{position:sticky;top:0;z-index:1}
  `;

  const obtenerEquipos = async () => {
    try {
      setLoading(true);
      const res = await Axios.get("http://localhost:3000/api/equipos", { withCredentials: true });
      if (!mounted.current) return;
      setEquipos(res.data || []);
      setError(null);
    } catch {
      setError("Error al cargar los equipos.");
    } finally {
      setLoading(false);
    }
  };

  const obtenerTipos = async () => {
    try {
      const res = await Axios.get("http://localhost:3000/api/tiposEquipos", { withCredentials: true });
      setTipos(res.data || []);
    } catch (e) {
      console.error("Error al cargar tipos de equipo", e);
    }
  };

  useEffect(() => {
    mounted.current = true;
    obtenerEquipos();
    obtenerTipos();
    return () => { mounted.current = false; };
  }, []);

  // debounce búsqueda
  useEffect(() => {
    const t = setTimeout(() => setDebounced(busqueda.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [busqueda]);

  const equiposFiltrados = useMemo(() => {
    if (!debounced) return equipos;
    return equipos.filter((e) =>
      [
        e.nombre_tipo_equipo,
        e.modelo_equipo,
        e.marca_equipo,
        e.especificaciones_equipo,
        e.estado_equipo,
        new Date(e.fecha_compra_equipo).toLocaleDateString("es-CO"),
      ]
        .join(" ")
        .toLowerCase()
        .includes(debounced)
    );
  }, [debounced, equipos]);

  // Editar
  const openEdit = (e) => { setEditing({ ...e }); setIsEditOpen(true); };
  const closeEdit = () => { setEditing(null); setIsEditOpen(false); };
  const onEditChange = (e) => setEditing((p) => ({ ...p, [e.target.name]: e.target.value }));
  const guardarEdicion = async () => {
    try {
      setSaving(true);
      await Axios.put(`http://localhost:3000/api/equipos/${editing.id_equipo}`, {
        ...editing,
        // Asegura formato yyyy-mm-dd para el backend
        fecha_compra_equipo: editing.fecha_compra_equipo
          ? new Date(editing.fecha_compra_equipo).toISOString().slice(0, 10)
          : null,
      }, { withCredentials: true });
      await obtenerEquipos();
      closeEdit();
    } catch (e) {
      console.error(e);
      alert("No se pudo actualizar el equipo.");
    } finally {
      setSaving(false);
    }
  };

  // Eliminar
  const askDelete = (e) => { setToDelete(e); setIsConfirmOpen(true); };
  const closeConfirm = () => { setToDelete(null); setIsConfirmOpen(false); };
  const eliminarEquipo = async () => {
    if (!toDelete) return;
    try {
      setDeleting(true);
      await Axios.delete(`http://localhost:3000/api/equipos/${toDelete.id_equipo}`, { withCredentials: true });
      setEquipos((prev) => prev.filter((x) => x.id_equipo !== toDelete.id_equipo));
      closeConfirm();
    } catch (e) {
      console.error(e);
      alert("No se pudo eliminar el equipo.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <style>{styles}</style>
      <NavBar />

      <div className="container flex-grow-1 py-4">
        <div className="card shadow border-0 liftable">
          <div className="card-body p-4">
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
              <div className="d-flex align-items-center gap-2">
                <button className="btn btn-outline-secondary" onClick={() => navigate("/MenuEquipo")}>
                  ← Menú Equipo
                </button>
                <h1 className="h4 mb-0">Consultar Equipos</h1>
              </div>

              <div className="input-group" style={{ maxWidth: 420 }}>
                <span className="input-group-text"><i className="bi bi-search" /></span>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Buscar por modelo, tipo, marca…"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
                {busqueda && (
                  <button className="btn btn-outline-secondary" onClick={() => setBusqueda("")} title="Limpiar">
                    <i className="bi bi-x-lg" />
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center justify-content-between">
                <span>{error}</span>
                <button className="btn btn-sm btn-outline-danger" onClick={obtenerEquipos}>Reintentar</button>
              </div>
            )}

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" role="status" />
                <p className="text-body-secondary mt-2">Cargando equipos…</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Tipo</th>
                      <th>Modelo</th>
                      <th>Marca</th>
                      <th>Especificaciones</th>
                      <th>Estado</th>
                      <th>Fecha compra</th>
                      <th className="text-end">Opciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equiposFiltrados.length > 0 ? (
                      equiposFiltrados.map((e) => (
                        <EquipoRow key={e.id_equipo} equipo={e} onEditar={openEdit} onEliminar={askDelete} />
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center text-body-secondary py-4">Sin resultados.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal editar */}
      <Modal isOpen={isEditOpen} onRequestClose={closeEdit} className="custom-modal" overlayClassName="custom-overlay" ariaHideApp={false}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Equipo</h5>
            <button type="button" className="btn-close" onClick={closeEdit} />
          </div>
          <div className="modal-body">
            {editing && (
              <form>
                <div className="mb-3">
                  <label htmlFor="id_tipo_equipo" className="form-label">Tipo</label>
                  <select
                    id="id_tipo_equipo"
                    name="id_tipo_equipo"
                    className="form-select"
                    value={editing.id_tipo_equipo || ""}
                    onChange={onEditChange}
                  >
                    <option value="">Seleccione…</option>
                    {tipos.map((t) => (
                      <option key={t.id_tipo_equipo} value={t.id_tipo_equipo}>{t.nombre_tipo_equipo}</option>
                    ))}
                  </select>
                </div>

                {[
                  ["modelo_equipo", "Modelo"],
                  ["marca_equipo", "Marca"],
                  ["especificaciones_equipo", "Especificaciones"],
                ].map(([id, label]) => (
                  <div className="mb-3" key={id}>
                    <label htmlFor={id} className="form-label">{label}</label>
                    <input
                      id={id}
                      name={id}
                      type="text"
                      className="form-control"
                      value={editing[id] || ""}
                      onChange={onEditChange}
                    />
                  </div>
                ))}

                <div className="mb-3">
                  <label htmlFor="fecha_compra_equipo" className="form-label">Fecha compra</label>
                  <input
                    id="fecha_compra_equipo"
                    name="fecha_compra_equipo"
                    type="date"
                    className="form-control"
                    value={
                      editing.fecha_compra_equipo
                        ? new Date(editing.fecha_compra_equipo).toISOString().slice(0, 10)
                        : ""
                    }
                    onChange={onEditChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="estado_equipo" className="form-label">Estado</label>
                  <select
                    id="estado_equipo"
                    name="estado_equipo"
                    className="form-select"
                    value={editing.estado_equipo || ""}
                    onChange={onEditChange}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </form>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={closeEdit} disabled={saving}>Cancelar</button>
            <button className="btn btn-success" onClick={guardarEdicion} disabled={saving}>
              {saving ? (<><span className="spinner-border spinner-border-sm me-2" />Guardando…</>) : "Guardar cambios"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal confirmar borrado */}
      <Modal isOpen={isConfirmOpen} onRequestClose={closeConfirm} className="custom-modal" overlayClassName="custom-overlay" ariaHideApp={false}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Eliminar equipo</h5>
            <button type="button" className="btn-close" onClick={closeConfirm} />
          </div>
          <div className="modal-body">
            ¿Seguro que deseas eliminar <strong>{toDelete?.modelo_equipo}</strong>?
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={closeConfirm} disabled={deleting}>Cancelar</button>
            <button className="btn btn-danger" onClick={eliminarEquipo} disabled={deleting}>
              {deleting ? (<><span className="spinner-border spinner-border-sm me-2" />Eliminando…</>) : "Eliminar"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

import Axios from "axios";
import NavBar from "../../components/Navbar";
import Modal from "react-modal";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";

function TipoEquipoRow({ tipoEquipo, onEliminar, onEditar }) {
  return (
    <tr>
      <td>{tipoEquipo.nombre_tipo_equipo}</td>
      <td className="text-end">
        <div className="btn-group btn-group-sm" role="group">
          <button className="btn btn-outline-primary" onClick={() => onEditar(tipoEquipo)}>
            <i className="bi bi-pencil-square me-1" /> Editar
          </button>
          <button className="btn btn-outline-danger" onClick={() => onEliminar(tipoEquipo)}>
            <i className="bi bi-trash me-1" /> Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}
TipoEquipoRow.propTypes = {
  tipoEquipo: PropTypes.object.isRequired,
  onEliminar: PropTypes.func.isRequired,
  onEditar: PropTypes.func.isRequired,
};

export default function ConsultarTipoEquipo() {
  const navigate = useNavigate();
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
    .custom-modal{position:relative;margin:auto;max-width:600px;outline:none}
  `;

  const obtener = async () => {
    try {
      setLoading(true);
      const res = await Axios.get("http://localhost:3000/api/tiposEquipos", { withCredentials: true });
      if (!mounted.current) return;
      setTipos(res.data || []);
      setError(null);
    } catch {
      setError("Error al cargar los tipos de equipo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    mounted.current = true;
    obtener();
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(busqueda.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [busqueda]);

  const filtrados = useMemo(() => {
    if (!debounced) return tipos;
    return tipos.filter(t => (t.nombre_tipo_equipo || "").toLowerCase().includes(debounced));
  }, [debounced, tipos]);

  // editar
  const openEdit = (t) => { setEditing({ ...t }); setIsEditOpen(true); };
  const closeEdit = () => { setIsEditOpen(false); setEditing(null); };
  const onEditChange = (e) => setEditing((p) => ({ ...p, [e.target.name]: e.target.value }));
  const guardarEdicion = async () => {
    try {
      setSaving(true);
      await Axios.put(`http://localhost:3000/api/tiposEquipos/${editing.id_tipo_equipo}`, editing, { withCredentials: true });
      await obtener();
      closeEdit();
    } catch (e) {
      console.error(e);
      alert("No se pudo actualizar el tipo de equipo.");
    } finally {
      setSaving(false);
    }
  };

  // eliminar
  const askDelete = (t) => { setToDelete(t); setIsConfirmOpen(true); };
  const closeConfirm = () => { setToDelete(null); setIsConfirmOpen(false); };
  const eliminar = async () => {
    if (!toDelete) return;
    try {
      setDeleting(true);
      await Axios.delete(`http://localhost:3000/api/tiposEquipos/${toDelete.id_tipo_equipo}`, { withCredentials: true });
      setTipos((prev) => prev.filter((x) => x.id_tipo_equipo !== toDelete.id_tipo_equipo));
      closeConfirm();
    } catch (e) {
      console.error(e);
      alert("No se pudo eliminar.");
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
                <button className="btn btn-outline-secondary" onClick={() => navigate("/MenuTipoEquipo")}>
                  ← Menú Tipo Equipo
                </button>
                <h1 className="h4 mb-0">Consultar Tipos de Equipo</h1>
              </div>

              <div className="input-group" style={{ maxWidth: 420 }}>
                <span className="input-group-text"><i className="bi bi-search" /></span>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Buscar por nombre"
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
                <button className="btn btn-sm btn-outline-danger" onClick={obtener}>Reintentar</button>
              </div>
            )}

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" role="status" />
                <p className="text-body-secondary mt-2">Cargando…</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Nombre</th>
                      <th className="text-end">Opciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtrados.length > 0 ? (
                      filtrados.map((t) => (
                        <TipoEquipoRow key={t.id_tipo_equipo} tipoEquipo={t} onEditar={openEdit} onEliminar={askDelete} />
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="text-center text-body-secondary py-4">Sin resultados.</td>
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
            <h5 className="modal-title">Editar Tipo de Equipo</h5>
            <button type="button" className="btn-close" onClick={closeEdit} />
          </div>
        <div className="modal-body">
          {editing && (
            <form>
              <div className="mb-3">
                <label htmlFor="nombre_tipo_equipo" className="form-label">Nombre</label>
                <input
                  id="nombre_tipo_equipo"
                  name="nombre_tipo_equipo"
                  type="text"
                  className="form-control"
                  value={editing.nombre_tipo_equipo || ""}
                  onChange={onEditChange}
                />
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
            <h5 className="modal-title">Eliminar tipo de equipo</h5>
            <button type="button" className="btn-close" onClick={closeConfirm} />
          </div>
          <div className="modal-body">¿Eliminar <strong>{toDelete?.nombre_tipo_equipo}</strong>?</div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={closeConfirm} disabled={deleting}>Cancelar</button>
            <button className="btn btn-danger" onClick={eliminar} disabled={deleting}>
              {deleting ? (<><span className="spinner-border spinner-border-sm me-2" />Eliminando…</>) : "Eliminar"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

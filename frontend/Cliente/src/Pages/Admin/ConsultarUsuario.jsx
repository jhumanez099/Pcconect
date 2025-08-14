import Axios from "axios";
import NavBar from "../../components/Navbar";
import Modal from "react-modal";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";

function UsuarioRow({ usuario, onEliminar, onEditar }) {
  return (
    <tr>
      <td>{usuario.nombre_usuario}</td>
      <td>{usuario.correo_usuario}</td>
      <td>{usuario.telefono_usuario}</td>
      <td>{usuario.cargo_usuario}</td>
      <td>
        <span className={`badge ${usuario.estado_usuario === "Activo" ? "bg-success" : "bg-secondary"}`}>
          {usuario.estado_usuario}
        </span>
      </td>
      <td>{usuario.nombre_tipo_usuario}</td>
      <td className="text-end">
        <div className="btn-group btn-group-sm" role="group">
          <button className="btn btn-outline-primary" onClick={() => onEditar(usuario)}>
            <i className="bi bi-pencil-square me-1" /> Editar
          </button>
          <button className="btn btn-outline-danger" onClick={() => onEliminar(usuario)}>
            <i className="bi bi-trash me-1" /> Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}
UsuarioRow.propTypes = {
  usuario: PropTypes.object.isRequired,
  onEliminar: PropTypes.func.isRequired,
  onEditar: PropTypes.func.isRequired,
};

export default function ConsultarUsuario() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [tiposUsuario, setTiposUsuario] = useState([]);
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
    .liftable { transition: transform .15s ease, box-shadow .15s ease; }
    .liftable:hover { transform: translateY(-2px); box-shadow: 0 .5rem 1rem rgba(0,0,0,.08); }
    .custom-overlay { background: rgba(0,0,0,.5); }
    .custom-modal { position: relative; margin: auto; max-width: 720px; outline: none; }
  `;

  const obtenerUsuarios = async () => {
    try {
      setLoading(true);
      const res = await Axios.get("http://localhost:3000/api/usuarios", { withCredentials: true });
      if (!mounted.current) return;
      setUsuarios(res.data || []);
      setError(null);
    } catch {
      setError("Error al cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  };

  const obtenerTiposUsuario = async () => {
    try {
      const res = await Axios.get("http://localhost:3000/api/tiposUsuarios", { withCredentials: true });
      setTiposUsuario(res.data || []);
    } catch (e) {
      // no bloquea la vista; solo evita el select en edición
      console.error("Error al obtener tipos de usuario.", e);
    }
  };

  useEffect(() => {
    mounted.current = true;
    obtenerUsuarios();
    obtenerTiposUsuario();
    return () => { mounted.current = false; };
  }, []);

  // debounce de búsqueda
  useEffect(() => {
    const t = setTimeout(() => setDebounced(busqueda.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [busqueda]);

  const usuariosFiltrados = useMemo(() => {
    if (!debounced) return usuarios;
    return usuarios.filter((u) =>
      (u.nombre_usuario || "").toLowerCase().includes(debounced) ||
      (u.correo_usuario || "").toLowerCase().includes(debounced) ||
      (u.cargo_usuario || "").toLowerCase().includes(debounced) ||
      (u.telefono_usuario || "").toLowerCase().includes(debounced) ||
      (u.nombre_tipo_usuario || "").toLowerCase().includes(debounced)
    );
  }, [debounced, usuarios]);

  // edición
  const openEdit = (u) => { setEditing({ ...u }); setIsEditOpen(true); };
  const closeEdit = () => { setIsEditOpen(false); setEditing(null); };
  const onEditChange = (e) => setEditing((p) => ({ ...p, [e.target.name]: e.target.value }));
  const editarUsuario = async () => {
    try {
      setSaving(true);
      await Axios.put(`http://localhost:3000/api/usuarios/${editing.id_usuario}`, editing, { withCredentials: true });
      await obtenerUsuarios();
      closeEdit();
    } catch (e) {
      console.error(e);
      alert("No se pudo actualizar el usuario.");
    } finally {
      setSaving(false);
    }
  };

  // eliminar
  const askDelete = (u) => { setToDelete(u); setIsConfirmOpen(true); };
  const closeConfirm = () => { setToDelete(null); setIsConfirmOpen(false); };
  const eliminarUsuario = async () => {
    if (!toDelete) return;
    try {
      setDeleting(true);
      await Axios.delete(`http://localhost:3000/api/usuarios/${toDelete.id_usuario}`, { withCredentials: true });
      setUsuarios((prev) => prev.filter((x) => x.id_usuario !== toDelete.id_usuario));
      closeConfirm();
    } catch (e) {
      console.error(e);
      alert("No se pudo eliminar el usuario.");
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
                <button className="btn btn-outline-secondary" onClick={() => navigate("/MenuUsuario")}>
                  ← Menú Usuario
                </button>
                <h1 className="h4 mb-0">Consultar Usuarios</h1>
              </div>

              <div className="input-group" style={{ maxWidth: 420 }}>
                <span className="input-group-text"><i className="bi bi-search" /></span>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Buscar por nombre, correo, cargo, teléfono o tipo"
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
                <button className="btn btn-sm btn-outline-danger" onClick={obtenerUsuarios}>Reintentar</button>
              </div>
            )}

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" role="status" />
                <p className="text-body-secondary mt-2">Cargando usuarios…</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Teléfono</th>
                      <th>Cargo</th>
                      <th>Estado</th>
                      <th>Tipo</th>
                      <th className="text-end">Opciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosFiltrados.length > 0 ? (
                      usuariosFiltrados.map((u) => (
                        <UsuarioRow key={u.id_usuario} usuario={u} onEditar={openEdit} onEliminar={askDelete} />
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
            <h5 className="modal-title">Editar Usuario</h5>
            <button type="button" className="btn-close" onClick={closeEdit} />
          </div>
          <div className="modal-body">
            {editing && (
              <form>
                {[
                  ["nombre_usuario", "Nombre", "text"],
                  ["correo_usuario", "Correo", "email"],
                  ["telefono_usuario", "Teléfono", "tel"],
                  ["cargo_usuario", "Cargo", "text"],
                ].map(([id, label, type]) => (
                  <div className="mb-3" key={id}>
                    <label htmlFor={id} className="form-label">{label}</label>
                    <input
                      id={id}
                      name={id}
                      type={type}
                      className="form-control"
                      value={editing[id] || ""}
                      onChange={onEditChange}
                    />
                  </div>
                ))}
                <div className="mb-3">
                  <label htmlFor="estado_usuario" className="form-label">Estado</label>
                  <select
                    id="estado_usuario"
                    name="estado_usuario"
                    className="form-select"
                    value={editing.estado_usuario || ""}
                    onChange={onEditChange}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="id_tipo_usuario" className="form-label">Tipo</label>
                  <select
                    id="id_tipo_usuario"
                    name="id_tipo_usuario"
                    className="form-select"
                    value={editing.id_tipo_usuario || ""}
                    onChange={onEditChange}
                  >
                    <option value="">Seleccione…</option>
                    {tiposUsuario.map((t) => (
                      <option key={t.id_tipo_usuario} value={t.id_tipo_usuario}>
                        {t.nombre_tipo_usuario}
                      </option>
                    ))}
                  </select>
                </div>
              </form>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={closeEdit} disabled={saving}>Cancelar</button>
            <button className="btn btn-success" onClick={editarUsuario} disabled={saving}>
              {saving ? (<><span className="spinner-border spinner-border-sm me-2" />Guardando…</>) : "Guardar cambios"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal confirmar borrado */}
      <Modal isOpen={isConfirmOpen} onRequestClose={closeConfirm} className="custom-modal" overlayClassName="custom-overlay" ariaHideApp={false}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Eliminar usuario</h5>
            <button type="button" className="btn-close" onClick={closeConfirm} />
          </div>
          <div className="modal-body">
            ¿Seguro que deseas eliminar a <strong>{toDelete?.nombre_usuario}</strong>?
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={closeConfirm} disabled={deleting}>Cancelar</button>
            <button className="btn btn-danger" onClick={eliminarUsuario} disabled={deleting}>
              {deleting ? (<><span className="spinner-border spinner-border-sm me-2" />Eliminando…</>) : "Eliminar"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

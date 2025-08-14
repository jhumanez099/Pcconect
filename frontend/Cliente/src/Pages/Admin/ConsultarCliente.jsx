import Axios from "axios";
import NavBar from "../../components/Navbar";
import Modal from "react-modal";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";

function ClienteRow({ cliente, onEliminar, onEditar }) {
  return (
    <tr>
      <td>{cliente.nombre_cliente}</td>
      <td>{cliente.direccion_cliente}</td>
      <td>{cliente.telefono_cliente}</td>
      <td>{cliente.correo_cliente}</td>
      <td>{cliente.encargado_cliente}</td>
      <td>
        <span
          className={`badge ${
            cliente.estado_cliente === "Activo" ? "bg-success" : "bg-secondary"
          }`}
        >
          {cliente.estado_cliente}
        </span>
      </td>
      <td className="text-end">
        <div
          className="btn-group btn-group-sm"
          role="group"
          aria-label="Acciones"
        >
          <button
            className="btn btn-outline-primary"
            onClick={() => onEditar(cliente)}
          >
            <i className="bi bi-pencil-square me-1" /> Editar
          </button>
          <button
            className="btn btn-outline-danger"
            onClick={() => onEliminar(cliente)}
          >
            <i className="bi bi-trash me-1" /> Eliminar
          </button>
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
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
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

  // --- estilos locales
  const styles = `
    .liftable { transition: transform .15s ease, box-shadow .15s ease; }
    .liftable:hover, .liftable:focus { transform: translateY(-2px); box-shadow: 0 .5rem 1rem rgba(0,0,0,.08); outline: none; }
    .custom-overlay { background: rgba(0,0,0,.5); }
    .custom-modal { position: relative; margin: auto; max-width: 720px; outline: none; }
    .table thead th { position: sticky; top: 0; z-index: 1; }
  `;

  const obtenerClientes = async () => {
    try {
      setLoading(true);
      const res = await Axios.get("http://localhost:3000/api/clientes", {
        withCredentials: true,
      });
      if (!mounted.current) return;
      setClientes(res.data || []);
      setError(null);
    } catch {
      setError("Error al cargar los clientes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    mounted.current = true;
    obtenerClientes();
    return () => {
      mounted.current = false;
    };
  }, []);

  // debounce búsqueda
  useEffect(() => {
    const t = setTimeout(
      () => setDebounced(busqueda.trim().toLowerCase()),
      250
    );
    return () => clearTimeout(t);
  }, [busqueda]);

  const clientesFiltrados = useMemo(() => {
    if (!debounced) return clientes;
    return clientes.filter(
      (c) =>
        (c.nombre_cliente || "").toLowerCase().includes(debounced) ||
        (c.correo_cliente || "").toLowerCase().includes(debounced) ||
        (c.telefono_cliente || "").toLowerCase().includes(debounced)
    );
  }, [debounced, clientes]);

  // editar
  const openEdit = (cliente) => {
    setEditing({ ...cliente });
    setIsEditOpen(true);
  };
  const closeEdit = () => {
    setIsEditOpen(false);
    setEditing(null);
  };
  const onEditChange = (e) => {
    const { name, value } = e.target;
    setEditing((prev) => ({ ...prev, [name]: value }));
  };
  const guardarEdicion = async () => {
    try {
      setSaving(true);
      await Axios.put(
        `http://localhost:3000/api/clientes/${editing.id_cliente}`,
        editing,
        { withCredentials: true }
      );
      await obtenerClientes();
      closeEdit();
    } catch (e) {
      console.error(e);
      alert("No se pudo actualizar el cliente.");
    } finally {
      setSaving(false);
    }
  };

  // eliminar
  const askDelete = (cliente) => {
    setToDelete(cliente);
    setIsConfirmOpen(true);
  };
  const closeConfirm = () => {
    setIsConfirmOpen(false);
    setToDelete(null);
  };
  const eliminarCliente = async () => {
    if (!toDelete) return;
    try {
      setDeleting(true);
      await Axios.delete(
        `http://localhost:3000/api/clientes/${toDelete.id_cliente}`,
        { withCredentials: true }
      );
      setClientes((prev) =>
        prev.filter((c) => c.id_cliente !== toDelete.id_cliente)
      );
      closeConfirm();
    } catch (e) {
      console.error(e);
      alert("No se pudo eliminar el cliente.");
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
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => navigate("/MenuCliente")}
                >
                  ← Volver a Menú Cliente
                </button>
                <h1 className="h4 mb-0">Consultar Clientes</h1>
              </div>
              <div className="input-group" style={{ maxWidth: 420 }}>
                <span className="input-group-text">
                  <i className="bi bi-search" />
                </span>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Buscar por nombre, correo o teléfono"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
                {busqueda && (
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setBusqueda("")}
                    title="Limpiar"
                  >
                    <i className="bi bi-x-lg" />
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center justify-content-between">
                <span>{error}</span>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={obtenerClientes}
                >
                  Reintentar
                </button>
              </div>
            )}

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" role="status" />
                <p className="text-body-secondary mt-2">Cargando clientes…</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Nombre</th>
                      <th>Dirección</th>
                      <th>Teléfono</th>
                      <th>Correo</th>
                      <th>Responsable</th>
                      <th>Estado</th>
                      <th className="text-end">Opciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientesFiltrados.length > 0 ? (
                      clientesFiltrados.map((c) => (
                        <ClienteRow
                          key={c.id_cliente}
                          cliente={c}
                          onEditar={openEdit}
                          onEliminar={askDelete}
                        />
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="text-center text-body-secondary py-4"
                        >
                          Sin resultados.
                        </td>
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
      <Modal
        isOpen={isEditOpen}
        onRequestClose={closeEdit}
        className="custom-modal"
        overlayClassName="custom-overlay"
        ariaHideApp={false}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Cliente</h5>
            <button type="button" className="btn-close" onClick={closeEdit} />
          </div>
          <div className="modal-body">
            {editing && (
              <form>
                {[
                  ["nombre_cliente", "Nombre", "text"],
                  ["direccion_cliente", "Dirección", "text"],
                  ["telefono_cliente", "Teléfono", "tel"],
                  ["correo_cliente", "Correo", "email"],
                  ["encargado_cliente", "Responsable", "text"],
                ].map(([id, label, type]) => (
                  <div className="mb-3" key={id}>
                    <label htmlFor={id} className="form-label">
                      {label}
                    </label>
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
                  <label htmlFor="estado_cliente" className="form-label">
                    Estado
                  </label>
                  <select
                    id="estado_cliente"
                    name="estado_cliente"
                    className="form-select"
                    value={editing.estado_cliente || ""}
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
            <button
              className="btn btn-outline-secondary"
              onClick={closeEdit}
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              className="btn btn-success"
              onClick={guardarEdicion}
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Guardando…
                </>
              ) : (
                "Guardar cambios"
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal confirmar borrado */}
      <Modal
        isOpen={isConfirmOpen}
        onRequestClose={closeConfirm}
        className="custom-modal"
        overlayClassName="custom-overlay"
        ariaHideApp={false}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Eliminar cliente</h5>
            <button
              type="button"
              className="btn-close"
              onClick={closeConfirm}
            />
          </div>
          <div className="modal-body">
            ¿Seguro que deseas eliminar a{" "}
            <strong>{toDelete?.nombre_cliente}</strong>?
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-outline-secondary"
              onClick={closeConfirm}
              disabled={deleting}
            >
              Cancelar
            </button>
            <button
              className="btn btn-danger"
              onClick={eliminarCliente}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Eliminando…
                </>
              ) : (
                "Eliminar"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

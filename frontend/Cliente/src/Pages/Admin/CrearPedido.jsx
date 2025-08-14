import { useForm } from "react-hook-form";
import Axios from "axios";
import NavBar from "../../components/Navbar";
import Modal from "react-modal";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function CrearPedido() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm({ mode: "onTouched" });

  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [equipos, setEquipos] = useState([]);

  const [loadingCats, setLoadingCats] = useState(true);
  const [catsError, setCatsError] = useState(null);

  const [globalErr, setGlobalErr] = useState(null);
  const [globalOk, setGlobalOk] = useState(null);

  const [detalles, setDetalles] = useState([]);
  const [nuevoDetalle, setNuevoDetalle] = useState({
    id_equipo: "",
    cantidad: 1,
    precio_unitario: 0,
    fecha_inicio: "",
    fecha_fin: "",
  });
  const [detalleError, setDetalleError] = useState("");

  // modal de confirmación para eliminar detalle
  const [confirmIndex, setConfirmIndex] = useState(null);

  const navigate = useNavigate();
  const mounted = useRef(true);

  const styles = `
    .liftable{transition:transform .15s ease,box-shadow .15s ease}
    .liftable:hover{transform:translateY(-2px);box-shadow:0 .5rem 1rem rgba(0,0,0,.08)}
    .req-asterisk::after{content:" *";color:#dc3545;font-weight:600}
    .custom-overlay{background:rgba(0,0,0,.5)}
    .custom-modal{position:relative;margin:auto;max-width:720px;outline:none}
    .table thead th{position:sticky;top:0;z-index:1}
  `;

  const fmtCOP = (n) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(Number(n || 0));

  // Cargar catálogos en paralelo
  useEffect(() => {
    mounted.current = true;
    (async () => {
      try {
        setLoadingCats(true);
        const [c, u, t, e] = await Promise.all([
          Axios.get("http://localhost:3000/api/clientes", { withCredentials: true }),
          Axios.get("http://localhost:3000/api/usuarios", { withCredentials: true }),
          Axios.get("http://localhost:3000/api/tiposPedidos", { withCredentials: true }),
          Axios.get("http://localhost:3000/api/equipos", { withCredentials: true }),
        ]);
        if (!mounted.current) return;
        setClientes(c.data || []);
        setUsuarios(u.data || []);
        setTipos(t.data || []);
        setEquipos(e.data || []);
        setCatsError(null);
      } catch {
        setCatsError("No se pudieron cargar los catálogos. Reintenta.");
      } finally {
        setLoadingCats(false);
      }
    })();
    return () => { mounted.current = false; };
  }, []);

  // Total del pedido
  const total = useMemo(() => detalles.reduce((acc, d) => acc + (Number(d.cantidad) * Number(d.precio_unitario)), 0), [detalles]);
  useEffect(() => { setValue("precio_total_pedido", total); }, [total, setValue]);

  // Validaciones de fechas del pedido
  const fechaInicioPedido = watch("fecha_inicio_pedido");
  const fechaFinPedido = watch("fecha_fin_pedido");

  const onChangeDetalle = (patch) => {
    setNuevoDetalle((prev) => {
      const next = { ...prev, ...patch };
      // coerción numérica básica
      if ("cantidad" in patch) next.cantidad = Math.max(0, parseInt(next.cantidad || 0, 10));
      if ("precio_unitario" in patch) next.precio_unitario = Math.max(0, parseFloat(next.precio_unitario || 0));
      return next;
    });
    setDetalleError("");
  };

  const validarDetalle = () => {
    const { id_equipo, cantidad, precio_unitario, fecha_inicio, fecha_fin } = nuevoDetalle;
    const inicio = fecha_inicio;
    const fin = fecha_fin;

    if (!id_equipo || !inicio || !fin || cantidad <= 0 || precio_unitario <= 0) {
      return "Todos los campos del detalle son obligatorios y deben ser válidos.";
    }
    if (fechaInicioPedido && inicio < fechaInicioPedido) {
      return "La fecha de inicio del detalle no puede ser anterior a la del pedido.";
    }
    if (fechaFinPedido && fin > fechaFinPedido) {
      return "La fecha de fin del detalle no puede ser posterior a la del pedido.";
    }
    if (inicio > fin) {
      return "La fecha de inicio del detalle no puede ser posterior a la fecha de fin.";
    }
    const existe = detalles.some((d) => String(d.id_equipo) === String(id_equipo));
    if (existe) {
      return "Este equipo ya ha sido agregado al pedido.";
    }
    return "";
  };

  const agregarDetalle = () => {
    const err = validarDetalle();
    if (err) {
      setDetalleError(err);
      return;
    }
    setDetalles((prev) => [...prev, { ...nuevoDetalle }]);
    setNuevoDetalle({ id_equipo: "", cantidad: 1, precio_unitario: 0, fecha_inicio: "", fecha_fin: "" });
    setDetalleError("");
  };

  const eliminarDetalle = (index) => setConfirmIndex(index);

  const confirmarEliminar = () => {
    setDetalles((prev) => prev.filter((_, i) => i !== confirmIndex));
    setConfirmIndex(null);
  };

  const onSubmit = async (data) => {
    setGlobalErr(null);
    setGlobalOk(null);

    // validaciones cruzadas del pedido
    if (fechaInicioPedido && fechaFinPedido && fechaInicioPedido > fechaFinPedido) {
      setGlobalErr("La fecha de inicio del pedido no puede ser posterior a la fecha fin.");
      return;
    }
    if (detalles.length === 0) {
      setGlobalErr("Debes agregar al menos un detalle al pedido.");
      return;
    }

    // cuerpo final
    const payload = {
      ...data,
      precio_total_pedido: total, // número plano
      detalles: detalles.map((d) => ({
        ...d,
        cantidad: Number(d.cantidad),
        precio_unitario: Number(d.precio_unitario),
        subtotal: Number(d.cantidad) * Number(d.precio_unitario)
      })),
    };

    try {
      await Axios.post("http://localhost:3000/api/pedidos", payload, { withCredentials: true });
      setGlobalOk("Pedido creado con éxito.");
      reset();
      setDetalles([]);
      setTimeout(() => navigate("/ConsultarPedido"), 700);
    } catch (error) {
      const msg = error?.response?.data?.message || "Error al crear el pedido.";
      setGlobalErr(msg);
    }
  };

  const subtotalDetalleActual = Number(nuevoDetalle.cantidad || 0) * Number(nuevoDetalle.precio_unitario || 0);

  return (
    <div className="min-vh-100 d-flex flex-column">
      <style>{styles}</style>
      <NavBar />

      <div className="container flex-grow-1 py-4">
        <div className="card shadow border-0 liftable">
          <div className="card-body p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <Link to="/MenuPedido" className="btn btn-outline-secondary">← Menú Pedido</Link>
              <h1 className="h4 mb-0">Crear Pedido</h1>
              <span />
            </div>

            {catsError && (
              <div className="alert alert-warning d-flex align-items-center justify-content-between">
                <span>{catsError}</span>
                <button className="btn btn-sm btn-outline-warning" onClick={() => window.location.reload()}>
                  Recargar
                </button>
              </div>
            )}
            {globalErr && <div className="alert alert-danger">{globalErr}</div>}
            {globalOk && <div className="alert alert-success">{globalOk}</div>}

            <form noValidate onSubmit={handleSubmit(onSubmit)}>
              {/* Datos del pedido */}
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label req-asterisk" htmlFor="fecha_inicio_pedido">Fecha Inicio</label>
                  <input
                    id="fecha_inicio_pedido"
                    type="date"
                    className={`form-control ${errors.fecha_inicio_pedido ? "is-invalid" : ""}`}
                    disabled={loadingCats}
                    {...register("fecha_inicio_pedido", { required: "Fecha inicio es obligatoria" })}
                  />
                  {errors.fecha_inicio_pedido && <div className="invalid-feedback">{errors.fecha_inicio_pedido.message}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label req-asterisk" htmlFor="fecha_fin_pedido">Fecha Fin</label>
                  <input
                    id="fecha_fin_pedido"
                    type="date"
                    className={`form-control ${errors.fecha_fin_pedido ? "is-invalid" : ""}`}
                    disabled={loadingCats}
                    {...register("fecha_fin_pedido", {
                      required: "Fecha fin es obligatoria",
                      validate: (v) => {
                        const ini = getValues("fecha_inicio_pedido");
                        return !ini || v >= ini || "La fecha fin no puede ser anterior a la de inicio";
                      },
                    })}
                  />
                  {errors.fecha_fin_pedido && <div className="invalid-feedback">{errors.fecha_fin_pedido.message}</div>}
                </div>

                <div className="col-12">
                  <label className="form-label req-asterisk" htmlFor="motivo_pedido">Motivo</label>
                  <input
                    id="motivo_pedido"
                    type="text"
                    className={`form-control ${errors.motivo_pedido ? "is-invalid" : ""}`}
                    placeholder="Describe el motivo del pedido"
                    disabled={loadingCats}
                    {...register("motivo_pedido", {
                      required: "Motivo es obligatorio",
                      minLength: { value: 3, message: "Debe tener al menos 3 caracteres" },
                      maxLength: { value: 200, message: "Máximo 200 caracteres" },
                    })}
                  />
                  {errors.motivo_pedido && <div className="invalid-feedback">{errors.motivo_pedido.message}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label req-asterisk" htmlFor="estado_pedido">Estado</label>
                  <select
                    id="estado_pedido"
                    className={`form-select ${errors.estado_pedido ? "is-invalid" : ""}`}
                    defaultValue=""
                    disabled={loadingCats}
                    {...register("estado_pedido", { required: "Estado es obligatorio" })}
                  >
                    <option value="" disabled>Seleccione…</option>
                    <option value="Activo">Activo</option>
                    <option value="Finalizado">Finalizado</option>
                    <option value="Anulado">Anulado</option>
                  </select>
                  {errors.estado_pedido && <div className="invalid-feedback">{errors.estado_pedido.message}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label req-asterisk" htmlFor="id_cliente">Cliente</label>
                  <select
                    id="id_cliente"
                    className={`form-select ${errors.id_cliente ? "is-invalid" : ""}`}
                    defaultValue=""
                    disabled={loadingCats}
                    {...register("id_cliente", { required: "Cliente es obligatorio" })}
                  >
                    <option value="" disabled>{loadingCats ? "Cargando…" : "Seleccione…"}</option>
                    {clientes.map((c) => <option key={c.id_cliente} value={c.id_cliente}>{c.nombre_cliente}</option>)}
                  </select>
                  {errors.id_cliente && <div className="invalid-feedback">{errors.id_cliente.message}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label req-asterisk" htmlFor="id_usuario">Usuario</label>
                  <select
                    id="id_usuario"
                    className={`form-select ${errors.id_usuario ? "is-invalid" : ""}`}
                    defaultValue=""
                    disabled={loadingCats}
                    {...register("id_usuario", { required: "Usuario es obligatorio" })}
                  >
                    <option value="" disabled>{loadingCats ? "Cargando…" : "Seleccione…"}</option>
                    {usuarios.map((u) => <option key={u.id_usuario} value={u.id_usuario}>{u.nombre_usuario}</option>)}
                  </select>
                  {errors.id_usuario && <div className="invalid-feedback">{errors.id_usuario.message}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label req-asterisk" htmlFor="id_tipo_pedido">Tipo de pedido</label>
                  <select
                    id="id_tipo_pedido"
                    className={`form-select ${errors.id_tipo_pedido ? "is-invalid" : ""}`}
                    defaultValue=""
                    disabled={loadingCats}
                    {...register("id_tipo_pedido", { required: "Tipo de pedido es obligatorio" })}
                  >
                    <option value="" disabled>{loadingCats ? "Cargando…" : "Seleccione…"}</option>
                    {tipos.map((t) => <option key={t.id_tipo_pedido} value={t.id_tipo_pedido}>{t.nombre_tipo_pedido}</option>)}
                  </select>
                  {errors.id_tipo_pedido && <div className="invalid-feedback">{errors.id_tipo_pedido.message}</div>}
                </div>

                <div className="col-12">
                  <label className="form-label" htmlFor="precio_total_pedido">Precio total</label>
                  <input
                    id="precio_total_pedido"
                    type="text"
                    className="form-control"
                    value={fmtCOP(total)}
                    readOnly
                  />
                </div>
              </div>

              {/* Detalles */}
              <h5 className="mt-4">Detalles del pedido</h5>
              {detalleError && <div className="alert alert-warning">{detalleError}</div>}

              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th style={{minWidth: 220}}>Equipo</th>
                      <th style={{width: 90}}>Cant</th>
                      <th style={{width: 140}}>Precio</th>
                      <th style={{width: 140}}>Subtotal</th>
                      <th style={{width: 160}}>Desde</th>
                      <th style={{width: 160}}>Hasta</th>
                      <th className="text-end" style={{width: 120}}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Fila de entrada */}
                    <tr>
                      <td>
                        <select
                          className="form-select"
                          value={nuevoDetalle.id_equipo}
                          onChange={(e) => onChangeDetalle({ id_equipo: e.target.value })}
                          disabled={loadingCats}
                        >
                          <option value="">{loadingCats ? "Cargando…" : "Seleccione"}</option>
                          {equipos.map((eq) => (
                            <option key={eq.id_equipo} value={eq.id_equipo}>
                              {eq.marca_equipo} - {eq.modelo_equipo}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          className="form-control"
                          value={nuevoDetalle.cantidad}
                          onChange={(e) => onChangeDetalle({ cantidad: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="form-control"
                          value={nuevoDetalle.precio_unitario}
                          onChange={(e) => onChangeDetalle({ precio_unitario: e.target.value })}
                        />
                      </td>
                      <td className="text-nowrap">{fmtCOP(subtotalDetalleActual)}</td>
                      <td>
                        <input
                          type="date"
                          className="form-control"
                          value={nuevoDetalle.fecha_inicio}
                          onChange={(e) => onChangeDetalle({ fecha_inicio: e.target.value })}
                          min={fechaInicioPedido || undefined}
                          max={fechaFinPedido || undefined}
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          className="form-control"
                          value={nuevoDetalle.fecha_fin}
                          onChange={(e) => onChangeDetalle({ fecha_fin: e.target.value })}
                          min={nuevoDetalle.fecha_inicio || fechaInicioPedido || undefined}
                          max={fechaFinPedido || undefined}
                        />
                      </td>
                      <td className="text-end">
                        <button type="button" className="btn btn-success btn-sm" onClick={agregarDetalle}>
                          Agregar
                        </button>
                      </td>
                    </tr>

                    {/* Detalles agregados */}
                    {detalles.map((d, i) => {
                      const eq = equipos.find((x) => String(x.id_equipo) === String(d.id_equipo));
                      const label = eq ? `${eq.marca_equipo} - ${eq.modelo_equipo}` : "Equipo no encontrado";
                      const subtotal = Number(d.cantidad) * Number(d.precio_unitario);
                      return (
                        <tr key={i}>
                          <td>{label}</td>
                          <td>{d.cantidad}</td>
                          <td className="text-nowrap">{fmtCOP(d.precio_unitario)}</td>
                          <td className="text-nowrap">{fmtCOP(subtotal)}</td>
                          <td>{d.fecha_inicio}</td>
                          <td>{d.fecha_fin}</td>
                          <td className="text-end">
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => eliminarDetalle(i)}
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {detalles.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center text-body-secondary">
                          No has agregado detalles todavía.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-center mt-3">
                <button type="submit" className="btn btn-success px-4" disabled={isSubmitting || loadingCats}>
                  {isSubmitting ? (<><span className="spinner-border spinner-border-sm me-2" />Creando…</>) : "Crear pedido"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal confirmar eliminación de detalle */}
      <Modal
        isOpen={confirmIndex !== null}
        onRequestClose={() => setConfirmIndex(null)}
        className="custom-modal"
        overlayClassName="custom-overlay"
        ariaHideApp={false}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Eliminar detalle</h5>
            <button type="button" className="btn-close" onClick={() => setConfirmIndex(null)} />
          </div>
          <div className="modal-body">
            ¿Seguro que deseas eliminar este detalle?
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={() => setConfirmIndex(null)}>Cancelar</button>
            <button className="btn btn-danger" onClick={confirmarEliminar}>Eliminar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

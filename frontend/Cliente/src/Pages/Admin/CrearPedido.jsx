import { useForm } from "react-hook-form";
import Axios from "axios";
import NavBar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CrearPedido() {
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [, setGlobalError] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [nuevoDetalle, setNuevoDetalle] = useState({
    id_equipo: "",
    cantidad: 1,
    precio_unitario: 0,
    subtotal: 0,
    fecha_inicio: "",
    fecha_fin: "",
  });
  const [detalleError, setDetalleError] = useState("");

  const navigate = useNavigate();

  const obtenerDatos = () => {
    Axios.get("http://localhost:3000/api/clientes", { withCredentials: true }).then(res => setClientes(res.data));
    Axios.get("http://localhost:3000/api/usuarios", { withCredentials: true }).then(res => setUsuarios(res.data));
    Axios.get("http://localhost:3000/api/tiposPedidos", { withCredentials: true }).then(res => setTipos(res.data));
    Axios.get("http://localhost:3000/api/equipos", { withCredentials: true }).then(res => setEquipos(res.data));
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  useEffect(() => {
    const total = detalles.reduce((acc, item) => acc + item.subtotal, 0);
    setValue("precio_total_pedido", total);
  }, [detalles, setValue]);

  const agregarDetalle = () => {
    const { id_equipo, cantidad, precio_unitario, fecha_inicio, fecha_fin } = nuevoDetalle;
    const pedidoInicio = watch("fecha_inicio_pedido");
    const pedidoFin = watch("fecha_fin_pedido");

    if (!id_equipo || !fecha_inicio || !fecha_fin || cantidad <= 0 || precio_unitario <= 0) {
      setDetalleError("Todos los campos del detalle son obligatorios y deben ser válidos.");
      return;
    }

    if (pedidoInicio && fecha_inicio < pedidoInicio) {
      setDetalleError("La fecha de inicio del detalle no puede ser anterior a la del pedido.");
      return;
    }

    if (pedidoFin && fecha_fin > pedidoFin) {
      setDetalleError("La fecha de fin del detalle no puede ser posterior a la del pedido.");
      return;
    }

    if (fecha_inicio > fecha_fin) {
      setDetalleError("La fecha de inicio del detalle no puede ser posterior a la fecha de fin.");
      return;
    }

    const existeEquipo = detalles.some((d) => d.id_equipo === id_equipo);
    if (existeEquipo) {
      setDetalleError("Este equipo ya ha sido agregado al pedido.");
      return;
    }

    const subtotal = cantidad * precio_unitario;
    setDetalles(prev => [...prev, { ...nuevoDetalle, subtotal }]);
    setNuevoDetalle({ id_equipo: "", cantidad: 1, precio_unitario: 0, subtotal: 0, fecha_inicio: "", fecha_fin: "" });
    setDetalleError("");
  };

  const eliminarDetalle = (index) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este detalle?");
    if (!confirmar) return;
    setDetalles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    try {
      if (detalles.length === 0) {
        alert("Debes agregar al menos un detalle al pedido.");
        return;
      }
      await Axios.post("http://localhost:3000/api/pedidos", { ...data, detalles }, { withCredentials: true });
      alert("Pedido creado con éxito.");
      reset();
      setDetalles([]);
      navigate("/ConsultarPedido");
    } catch (error) {
      const msg = error.response?.data?.message || "Error al crear el pedido.";
      setGlobalError(msg);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <NavBar />
      <div className="d-flex justify-content-center align-items-center flex-grow-1 px-2">
        <div className="w-100 bg-white rounded card shadow p-4 m-4" style={{ maxWidth: "1000px" }}>
          <div className="mb-4 position-relative">
            <button className="btn btn-outline-primary position-absolute start-0" onClick={() => navigate('/MenuPrincipal')}>← Menú principal</button>
            <h1 className="text-center">Crear Pedido</h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Fecha Inicio</label>
                <input type="date" className="form-control" {...register("fecha_inicio_pedido", { required: true })} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Fecha Fin</label>
                <input type="date" className="form-control" {...register("fecha_fin_pedido", { required: true })} />
              </div>
              <div className="col-12">
                <label className="form-label">Motivo</label>
                <input type="text" className="form-control" {...register("motivo_pedido", { required: true })} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Estado</label>
                <select className="form-control" {...register("estado_pedido", { required: true })}>
                  <option value="">Seleccione...</option>
                  <option value="Activo">Activo</option>
                  <option value="Finalizado">Finalizado</option>
                  <option value="Anulado">Anulado</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Cliente</label>
                <select className="form-control" {...register("id_cliente", { required: true })}>
                  <option value="">Seleccione...</option>
                  {clientes.map(c => <option key={c.id_cliente} value={c.id_cliente}>{c.nombre_cliente}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Usuario</label>
                <select className="form-control" {...register("id_usuario", { required: true })}>
                  <option value="">Seleccione...</option>
                  {usuarios.map(u => <option key={u.id_usuario} value={u.id_usuario}>{u.nombre_usuario}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Tipo de pedido</label>
                <select className="form-control" {...register("id_tipo_pedido", { required: true })}>
                  <option value="">Seleccione...</option>
                  {tipos.map(t => <option key={t.id_tipo_pedido} value={t.id_tipo_pedido}>{t.nombre_tipo_pedido}</option>)}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label">Precio total</label>
                <input type="text" className="form-control" value={Number(watch("precio_total_pedido") || 0).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })} readOnly />
              </div>
            </div>

            <h5 className="mt-4">Detalles del pedido</h5>
            {detalleError && <div className="alert alert-warning">{detalleError}</div>}
            <div className="table-responsive">
              <table className="table table-bordered text-center">
                <thead>
                  <tr>
                    <th>Equipo</th>
                    <th>Cant</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                    <th>Desde</th>
                    <th>Hasta</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <select className="form-control" value={nuevoDetalle.id_equipo} onChange={e => setNuevoDetalle({ ...nuevoDetalle, id_equipo: e.target.value })}>
                        <option value="">Seleccione</option>
                        {equipos.map(eq => (
                          <option key={eq.id_equipo} value={eq.id_equipo}>{eq.marca_equipo} - {eq.modelo_equipo}</option>
                        ))}
                      </select>
                    </td>
                    <td><input type="number" className="form-control" value={nuevoDetalle.cantidad} onChange={e => setNuevoDetalle({ ...nuevoDetalle, cantidad: parseInt(e.target.value) || 0 })} /></td>
                    <td><input type="number" className="form-control" value={nuevoDetalle.precio_unitario} onChange={e => setNuevoDetalle({ ...nuevoDetalle, precio_unitario: parseFloat(e.target.value) || 0 })} /></td>
                    <td>
                      {isNaN(nuevoDetalle.cantidad * nuevoDetalle.precio_unitario)
                        ? "$ 0"
                        : (nuevoDetalle.cantidad * nuevoDetalle.precio_unitario).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                    </td>
                    <td><input type="date" className="form-control" value={nuevoDetalle.fecha_inicio} onChange={e => setNuevoDetalle({ ...nuevoDetalle, fecha_inicio: e.target.value })} /></td>
                    <td><input type="date" className="form-control" value={nuevoDetalle.fecha_fin} onChange={e => setNuevoDetalle({ ...nuevoDetalle, fecha_fin: e.target.value })} /></td>
                    <td><button type="button" className="btn btn-success btn-sm" onClick={agregarDetalle}>Agregar</button></td>
                  </tr>
                  {detalles.map((d, i) => (
                    <tr key={i}>
                      <td>{(() => {
                        const equipo = equipos.find(eq => String(eq.id_equipo) === String(d.id_equipo));
                        return equipo ? `${equipo.marca_equipo} - ${equipo.modelo_equipo}` : "Equipo no encontrado";
                      })()}</td>
                      <td>{d.cantidad}</td>
                      <td>{d.precio_unitario.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                      <td>{d.subtotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                      <td>{d.fecha_inicio}</td>
                      <td>{d.fecha_fin}</td>
                      <td><button type="button" className="btn btn-danger btn-sm" onClick={() => eliminarDetalle(i)}>Eliminar</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-success mt-3 px-4">Crear pedido</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

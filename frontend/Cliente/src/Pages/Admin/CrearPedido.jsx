import { useForm } from "react-hook-form";
import Axios from "axios";
import NavBar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CrearPedido() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [globalError, setGlobalError] = useState(null);
  const navigate = useNavigate();

  const obtenerDatos = () => {
    Axios.get("http://localhost:3000/api/clientes", { withCredentials: true }).then(res => setClientes(res.data));
    Axios.get("http://localhost:3000/api/usuarios", { withCredentials: true }).then(res => setUsuarios(res.data));
    Axios.get("http://localhost:3000/api/tiposPedidos", { withCredentials: true }).then(res => setTipos(res.data));
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  const onSubmit = async (data) => {
    try {
      await Axios.post("http://localhost:3000/api/pedidos", data, { withCredentials: true });
      alert("Pedido creado con éxito.");
      reset();
      navigate("/ConsultarPedido");
    } catch (error) {
      const msg = error.response?.data?.message || "Error al crear el pedido.";
      setGlobalError(msg);
    }
  };

  const campos = [
    { label: "Fecha inicio", id: "fechaInicioPedido", type: "date" },
    { label: "Fecha fin", id: "fechaFinPedido", type: "date" },
    { label: "Precio total", id: "precioTotalPedido", type: "number" },
    { label: "Motivo", id: "motivoPedido", type: "text" },
    {
      label: "Estado",
      id: "estadoPedido",
      type: "select",
      options: ["Activo", "Finalizado", "Anulado"],
    },
  ];

  return (
    <div className="min-vh-100 d-flex flex-column bg-secondary">
      <NavBar />
      <div className="d-flex justify-content-center align-items-center flex-grow-1">
        <div className="col-11 col-sm-10 col-md-8 col-lg-6 col-xl-6 bg-white rounded card shadow p-4 m-4">
          <div className="row mb-4">
            <div className="col-12 d-flex justify-content-between align-items-center mb-3">
              <button className="btn btn-primary btn-sm" onClick={() => navigate("/MenuPrincipal")}>← Regresar</button>
              <h1 className="text-center w-100 mb-0">Crear pedido</h1>
            </div>
          </div>

          {globalError && <div className="alert alert-danger">{globalError}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="px-3">
            {campos.map((field, index) => (
              <div className="mb-4 row align-items-center" key={index}>
                <label htmlFor={field.id} className="col-sm-4 col-form-label text-end">
                  {field.label}:
                </label>
                <div className="col-sm-8">
                  {field.type === "select" ? (
                    <select
                      className={`form-control ${errors[field.id] ? "is-invalid" : ""}`}
                      id={field.id}
                      {...register(field.id, { required: `${field.label} es obligatorio` })}
                    >
                      <option value="">Seleccione...</option>
                      {field.options.map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      className={`form-control ${errors[field.id] ? "is-invalid" : ""}`}
                      id={field.id}
                      {...register(field.id, { required: `${field.label} es obligatorio` })}
                    />
                  )}
                  {errors[field.id] && <div className="invalid-feedback">{errors[field.id].message}</div>}
                </div>
              </div>
            ))}

            {/* cliente */}
            <div className="mb-4 row align-items-center">
              <label htmlFor="cliente" className="col-sm-4 col-form-label text-end">Cliente:</label>
              <div className="col-sm-8">
                <select className="form-control" {...register("cliente", { required: "Cliente es obligatorio" })}>
                  <option value="">Seleccione...</option>
                  {clientes.map((c) => (
                    <option key={c.id_cliente} value={c.id_cliente}>{c.nombre_cliente}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* usuario */}
            <div className="mb-4 row align-items-center">
              <label htmlFor="usuario" className="col-sm-4 col-form-label text-end">Usuario:</label>
              <div className="col-sm-8">
                <select className="form-control" {...register("usuario", { required: "Usuario es obligatorio" })}>
                  <option value="">Seleccione...</option>
                  {usuarios.map((u) => (
                    <option key={u.id_usuario} value={u.id_usuario}>{u.nombre_usuario}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* tipo de pedido */}
            <div className="mb-4 row align-items-center">
              <label htmlFor="tipoPedido" className="col-sm-4 col-form-label text-end">Tipo pedido:</label>
              <div className="col-sm-8">
                <select className="form-control" {...register("tipoPedido", { required: "Tipo pedido es obligatorio" })}>
                  <option value="">Seleccione...</option>
                  {tipos.map((t) => (
                    <option key={t.id_tipo_pedido} value={t.id_tipo_pedido}>{t.nombre_tipo_pedido}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-success px-4 py-2">Crear</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

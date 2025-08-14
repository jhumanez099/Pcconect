import Axios from "axios";
import { useForm } from "react-hook-form";
import NavBar from "../../components/Navbar";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function CrearTipoPedido() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm({ mode: "onTouched" });

  const [globalOk, setGlobalOk] = useState(null);
  const [globalErr, setGlobalErr] = useState(null);
  const navigate = useNavigate();

  const styles = `
    .liftable{transition:transform .15s ease,box-shadow .15s ease}
    .liftable:hover{transform:translateY(-2px);box-shadow:0 .5rem 1rem rgba(0,0,0,.08)}
    .req-asterisk::after{content:" *";color:#dc3545;font-weight:600}
  `;

  const onSubmit = async (raw) => {
    setGlobalOk(null); setGlobalErr(null);
    const data = { ...raw, nombre_tipo_pedido: raw.nombre_tipo_pedido?.trim() };
    try {
      await Axios.post("http://localhost:3000/api/tiposPedidos", data, { withCredentials: true });
      reset();
      setGlobalOk("Tipo de pedido creado con éxito.");
      setTimeout(() => navigate("/ConsultarTipoPedido"), 600);
    } catch (error) {
      const msg = error?.response?.data?.message || "Error al crear el tipo de pedido.";
      setGlobalErr(msg);
      const fieldErrors = error?.response?.data?.errors;
      if (fieldErrors && typeof fieldErrors === "object") {
        Object.entries(fieldErrors).forEach(([field, message]) =>
          setError(field, { type: "server", message: String(message) })
        );
      }
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <style>{styles}</style>
      <NavBar />

      <div className="container flex-grow-1 py-4">
        <div className="card shadow border-0 liftable">
          <div className="card-body p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <Link to="/MenuTipoPedido" className="btn btn-outline-secondary">← Menú Tipo Pedido</Link>
              <h1 className="h4 mb-0">Crear Tipo de Pedido</h1>
              <span />
            </div>

            {globalOk && <div className="alert alert-success">{globalOk}</div>}
            {globalErr && <div className="alert alert-danger">{globalErr}</div>}

            <form noValidate onSubmit={handleSubmit(onSubmit)}>
              <div className="row g-3">
                <div className="col-12 col-md-8">
                  <label htmlFor="nombre_tipo_pedido" className="form-label req-asterisk">Nombre</label>
                  <input
                    id="nombre_tipo_pedido"
                    type="text"
                    className={`form-control ${errors.nombre_tipo_pedido ? "is-invalid" : ""}`}
                    {...register("nombre_tipo_pedido", {
                      required: "Nombre es obligatorio",
                      minLength: { value: 3, message: "Debe tener al menos 3 caracteres" },
                      maxLength: { value: 60, message: "Máximo 60 caracteres" },
                    })}
                  />
                  {errors.nombre_tipo_pedido && <div className="invalid-feedback">{errors.nombre_tipo_pedido.message}</div>}
                </div>
              </div>

              <div className="d-flex justify-content-center gap-2 mt-4">
                <button type="button" className="btn btn-outline-secondary" onClick={() => reset()} disabled={isSubmitting}>
                  Limpiar
                </button>
                <button type="submit" className="btn btn-success px-4" disabled={isSubmitting}>
                  {isSubmitting ? (<><span className="spinner-border spinner-border-sm me-2" />Guardando…</>) : "Crear"}
                </button>
              </div>

              <p className="text-center text-body-secondary small mt-3">
                Los campos marcados con <span className="text-danger">*</span> son obligatorios.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

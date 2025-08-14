import Axios from "axios";
import { useForm } from "react-hook-form";
import NavBar from "../../components/Navbar";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function CrearTipoEquipo() {
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
    const data = { ...raw, nombre_tipo_equipo: raw.nombre_tipo_equipo?.trim() };
    try {
      await Axios.post("http://localhost:3000/api/tiposEquipos", data, { withCredentials: true });
      reset();
      setGlobalOk("Tipo de equipo creado correctamente.");
      setTimeout(() => navigate("/ConsultarTipoEquipo"), 600);
    } catch (error) {
      const msg = error?.response?.data?.message || "Error al crear el tipo de equipo.";
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
              <Link to="/MenuTipoEquipo" className="btn btn-outline-secondary">← Menú Tipo Equipo</Link>
              <h1 className="h4 mb-0">Crear Tipo de Equipo</h1>
              <span />
            </div>

            {globalOk && <div className="alert alert-success">{globalOk}</div>}
            {globalErr && <div className="alert alert-danger">{globalErr}</div>}

            <form noValidate onSubmit={handleSubmit(onSubmit)}>
              <div className="row g-3">
                <div className="col-12 col-md-8">
                  <label htmlFor="nombre_tipo_equipo" className="form-label req-asterisk">Nombre</label>
                  <input
                    id="nombre_tipo_equipo"
                    type="text"
                    className={`form-control ${errors.nombre_tipo_equipo ? "is-invalid" : ""}`}
                    {...register("nombre_tipo_equipo", {
                      required: "El nombre es obligatorio",
                      minLength: { value: 3, message: "Debe tener al menos 3 caracteres" },
                      maxLength: { value: 60, message: "Máximo 60 caracteres" },
                    })}
                  />
                  {errors.nombre_tipo_equipo && <div className="invalid-feedback">{errors.nombre_tipo_equipo.message}</div>}
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

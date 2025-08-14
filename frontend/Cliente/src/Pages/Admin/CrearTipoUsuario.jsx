import Axios from "axios";
import { useForm } from "react-hook-form";
import NavBar from "../../components/Navbar";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function CrearTipoUsuario() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm({ mode: "onTouched" });
  const [globalMsg, setGlobalMsg] = useState(null);
  const [globalErr, setGlobalErr] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (raw) => {
    setGlobalMsg(null);
    setGlobalErr(null);
    const data = {
      ...raw,
      nombre_tipo_usuario: raw.nombre_tipo_usuario?.trim(),
    };
    try {
      await Axios.post("http://localhost:3000/api/tiposUsuarios", data, {
        withCredentials: true,
      });
      reset();
      setGlobalMsg("Tipo de usuario creado con éxito.");
      setTimeout(() => navigate("/ConsultarTipoUsuario"), 600);
    } catch (error) {
      const message =
        error?.response?.data?.message || "Error al crear el tipo de usuario.";
      setGlobalErr(message);
      if (error?.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([field, msg]) =>
          setError(field, { type: "server", message: String(msg) })
        );
      }
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <style>{`.liftable{transition:transform .15s,box-shadow .15s}.liftable:hover{transform:translateY(-2px);box-shadow:0 .5rem 1rem rgba(0,0,0,.08)}`}</style>
      <NavBar />

      <div className="container flex-grow-1 py-4">
        <div className="card shadow border-0 liftable">
          <div className="card-body p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <Link to="/MenuTipoUsuario" className="btn btn-outline-secondary">
                ← Menú Tipo Usuario
              </Link>
              <h1 className="h4 mb-0">Crear Tipo de Usuario</h1>
              <span />
            </div>

            {globalMsg && (
              <div className="alert alert-success" role="alert">
                {globalMsg}
              </div>
            )}
            {globalErr && (
              <div className="alert alert-danger" role="alert">
                {globalErr}
              </div>
            )}

            <form noValidate onSubmit={handleSubmit(onSubmit)}>
              <div className="row g-3">
                <div className="col-12 col-md-8">
                  <label htmlFor="nombre_tipo_usuario" className="form-label">
                    Nombre <span className="text-danger">*</span>
                  </label>
                  <input
                    id="nombre_tipo_usuario"
                    type="text"
                    className={`form-control ${
                      errors.nombre_tipo_usuario ? "is-invalid" : ""
                    }`}
                    {...register("nombre_tipo_usuario", {
                      required: "El nombre es obligatorio",
                      minLength: {
                        value: 3,
                        message: "Debe tener al menos 3 caracteres",
                      },
                      maxLength: { value: 60, message: "Máximo 60 caracteres" },
                    })}
                  />
                  {errors.nombre_tipo_usuario && (
                    <div className="invalid-feedback">
                      {errors.nombre_tipo_usuario.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="d-flex justify-content-center gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => reset()}
                  disabled={isSubmitting}
                >
                  Limpiar
                </button>
                <button
                  type="submit"
                  className="btn btn-success px-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Guardando…
                    </>
                  ) : (
                    "Crear"
                  )}
                </button>
              </div>

              <p className="text-body-secondary text-center small mt-3">
                Los campos con <span className="text-danger">*</span> son
                obligatorios.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

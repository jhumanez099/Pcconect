import Axios from "axios";
import { useForm } from "react-hook-form";
import NavBar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function CrearUsuario() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm({ mode: "onTouched" });

  const [globalErr, setGlobalErr] = useState(null);
  const [globalOk, setGlobalOk] = useState(null);
  const [tiposUsuario, setTiposUsuario] = useState([]);
  const [loadingTipos, setLoadingTipos] = useState(true);
  const [tiposErr, setTiposErr] = useState(null);
  const [showPwd, setShowPwd] = useState(false);

  const navigate = useNavigate();

  const styles = `
    .liftable { transition: transform .15s ease, box-shadow .15s ease; }
    .liftable:hover { transform: translateY(-2px); box-shadow: 0 .5rem 1rem rgba(0,0,0,.08); }
    .req-asterisk::after { content:" *"; color:#dc3545; font-weight:600; }
  `;

  useEffect(() => {
    const obtenerTiposUsuario = async () => {
      try {
        setLoadingTipos(true);
        const res = await Axios.get("http://localhost:3000/api/tiposUsuarios", { withCredentials: true });
        setTiposUsuario(res.data || []);
        setTiposErr(null);
      } catch (e) {
        setTiposErr("No se pudieron cargar los tipos de usuario.");
      } finally {
        setLoadingTipos(false);
      }
    };
    obtenerTiposUsuario();
  }, []);

  const onSubmit = async (raw) => {
    setGlobalErr(null); setGlobalOk(null);

    // Trim seguro
    const data = Object.fromEntries(
      Object.entries(raw).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v])
    );

    try {
      await Axios.post("http://localhost:3000/api/usuarios", data, { withCredentials: true });
      reset();
      setGlobalOk("Usuario creado con éxito.");
      setTimeout(() => navigate("/ConsultarUsuario"), 600);
    } catch (error) {
      const msg = error?.response?.data?.message || "Error al crear el usuario.";
      setGlobalErr(msg);
      // Mapeo de errores por campo (si tu API los envía)
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
              <Link to="/MenuUsuario" className="btn btn-outline-secondary">← Menú Usuario</Link>
              <h1 className="h4 mb-0">Crear Usuario</h1>
              <span />
            </div>

            {globalOk && <div className="alert alert-success">{globalOk}</div>}
            {globalErr && <div className="alert alert-danger">{globalErr}</div>}

            {tiposErr && (
              <div className="alert alert-warning d-flex justify-content-between align-items-center">
                <span>{tiposErr}</span>
              </div>
            )}

            <form noValidate onSubmit={handleSubmit(onSubmit)}>
              <div className="row g-3">
                {/* Nombre */}
                <div className="col-12 col-md-6">
                  <label htmlFor="nombre_usuario" className="form-label req-asterisk">Nombre</label>
                  <input
                    id="nombre_usuario"
                    type="text"
                    autoComplete="name"
                    className={`form-control ${errors.nombre_usuario ? "is-invalid" : ""}`}
                    {...register("nombre_usuario", {
                      required: "El nombre es obligatorio",
                      minLength: { value: 3, message: "Mínimo 3 caracteres" },
                      maxLength: { value: 80, message: "Máximo 80 caracteres" }
                    })}
                  />
                  {errors.nombre_usuario && <div className="invalid-feedback">{errors.nombre_usuario.message}</div>}
                </div>

                {/* Correo */}
                <div className="col-12 col-md-6">
                  <label htmlFor="correo_usuario" className="form-label req-asterisk">Correo</label>
                  <input
                    id="correo_usuario"
                    type="email"
                    autoComplete="email"
                    className={`form-control ${errors.correo_usuario ? "is-invalid" : ""}`}
                    {...register("correo_usuario", {
                      required: "El correo es obligatorio",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, message: "Correo inválido" }
                    })}
                  />
                  {errors.correo_usuario && <div className="invalid-feedback">{errors.correo_usuario.message}</div>}
                </div>

                {/* Contraseña */}
                <div className="col-12 col-md-6">
                  <label htmlFor="contraseña_usuario" className="form-label req-asterisk">Contraseña</label>
                  <div className="input-group">
                    <input
                      id="contraseña_usuario"
                      type={showPwd ? "text" : "password"}
                      className={`form-control ${errors["contraseña_usuario"] ? "is-invalid" : ""}`}
                      autoComplete="new-password"
                      {...register("contraseña_usuario", {
                        required: "La contraseña es obligatoria",
                        minLength: { value: 6, message: "Mínimo 6 caracteres" }
                      })}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPwd(v => !v)}
                      title={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      <i className={`bi ${showPwd ? "bi-eye-slash" : "bi-eye"}`} />
                    </button>
                    {errors["contraseña_usuario"] && <div className="invalid-feedback d-block">{errors["contraseña_usuario"].message}</div>}
                  </div>
                </div>

                {/* Teléfono */}
                <div className="col-12 col-md-6">
                  <label htmlFor="telefono_usuario" className="form-label req-asterisk">Teléfono</label>
                  <input
                    id="telefono_usuario"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    className={`form-control ${errors.telefono_usuario ? "is-invalid" : ""}`}
                    {...register("telefono_usuario", {
                      required: "El teléfono es obligatorio",
                      pattern: { value: /^[0-9+\s()-]{7,20}$/, message: "Formato de teléfono inválido" }
                    })}
                  />
                  {errors.telefono_usuario && <div className="invalid-feedback">{errors.telefono_usuario.message}</div>}
                </div>

                {/* Cargo */}
                <div className="col-12 col-md-6">
                  <label htmlFor="cargo_usuario" className="form-label">Cargo</label>
                  <input
                    id="cargo_usuario"
                    type="text"
                    className={`form-control ${errors.cargo_usuario ? "is-invalid" : ""}`}
                    {...register("cargo_usuario", {
                      maxLength: { value: 80, message: "Máximo 80 caracteres" }
                    })}
                  />
                  {errors.cargo_usuario && <div className="invalid-feedback">{errors.cargo_usuario.message}</div>}
                </div>

                {/* Estado */}
                <div className="col-12 col-md-6">
                  <label htmlFor="estado_usuario" className="form-label req-asterisk">Estado</label>
                  <select
                    id="estado_usuario"
                    className={`form-select ${errors.estado_usuario ? "is-invalid" : ""}`}
                    defaultValue=""
                    {...register("estado_usuario", { required: "El estado es obligatorio" })}
                  >
                    <option value="" disabled>Seleccione…</option>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                  {errors.estado_usuario && <div className="invalid-feedback">{errors.estado_usuario.message}</div>}
                </div>

                {/* Tipo de usuario */}
                <div className="col-12 col-md-6">
                  <label htmlFor="id_tipo_usuario" className="form-label req-asterisk">Tipo de usuario</label>
                  <select
                    id="id_tipo_usuario"
                    className={`form-select ${errors.id_tipo_usuario ? "is-invalid" : ""}`}
                    defaultValue=""
                    disabled={loadingTipos}
                    {...register("id_tipo_usuario", { required: "Tipo de usuario es obligatorio" })}
                  >
                    <option value="" disabled>{loadingTipos ? "Cargando…" : "Seleccione…"}</option>
                    {tiposUsuario.map((t) => (
                      <option key={t.id_tipo_usuario} value={t.id_tipo_usuario}>{t.nombre_tipo_usuario}</option>
                    ))}
                  </select>
                  {errors.id_tipo_usuario && <div className="invalid-feedback">{errors.id_tipo_usuario.message}</div>}
                </div>
              </div>

              <div className="d-flex justify-content-center gap-2 mt-4">
                <button type="button" className="btn btn-outline-secondary" onClick={() => reset()} disabled={isSubmitting}>
                  Limpiar
                </button>
                <button type="submit" className="btn btn-success px-4" disabled={isSubmitting || loadingTipos}>
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

import Axios from "axios";
import { useForm } from "react-hook-form";
import NavBar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function CrearEquipo() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm({ mode: "onTouched" });

  const [globalOk, setGlobalOk] = useState(null);
  const [globalErr, setGlobalErr] = useState(null);
  const [tipos, setTipos] = useState([]);
  const [loadingTipos, setLoadingTipos] = useState(true);
  const [tiposErr, setTiposErr] = useState(null);

  const navigate = useNavigate();

  const styles = `
    .liftable{transition:transform .15s ease,box-shadow .15s ease}
    .liftable:hover{transform:translateY(-2px);box-shadow:0 .5rem 1rem rgba(0,0,0,.08)}
    .req-asterisk::after{content:" *";color:#dc3545;font-weight:600}
  `;

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        setLoadingTipos(true);
        const res = await Axios.get("http://localhost:3000/api/tiposEquipos", { withCredentials: true });
        setTipos(res.data || []);
        setTiposErr(null);
      } catch (e) {
        setTiposErr("No se pudieron cargar los tipos de equipo.");
      } finally {
        setLoadingTipos(false);
      }
    };
    fetchTipos();
  }, []);

  const onSubmit = async (raw) => {
    setGlobalOk(null); setGlobalErr(null);
    const data = Object.fromEntries(
      Object.entries(raw).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v])
    );
    try {
      await Axios.post("http://localhost:3000/api/equipos", data, { withCredentials: true });
      reset();
      setGlobalOk("Equipo creado correctamente.");
      setTimeout(() => navigate("/ConsultarEquipo"), 600);
    } catch (error) {
      const msg = error?.response?.data?.message || "Error al crear el equipo.";
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
              <Link to="/MenuEquipo" className="btn btn-outline-secondary">← Menú Equipo</Link>
              <h1 className="h4 mb-0">Crear Equipo</h1>
              <span />
            </div>

            {globalOk && <div className="alert alert-success">{globalOk}</div>}
            {globalErr && <div className="alert alert-danger">{globalErr}</div>}
            {tiposErr && <div className="alert alert-warning">{tiposErr}</div>}

            <form noValidate onSubmit={handleSubmit(onSubmit)}>
              <div className="row g-3">
                {/* Tipo */}
                <div className="col-12 col-md-6">
                  <label htmlFor="id_tipo_equipo" className="form-label req-asterisk">Tipo</label>
                  <select
                    id="id_tipo_equipo"
                    className={`form-select ${errors.id_tipo_equipo ? "is-invalid" : ""}`}
                    defaultValue=""
                    disabled={loadingTipos}
                    {...register("id_tipo_equipo", { required: "Tipo de equipo es obligatorio" })}
                  >
                    <option value="" disabled>{loadingTipos ? "Cargando…" : "Seleccione…"}</option>
                    {tipos.map((t) => (
                      <option key={t.id_tipo_equipo} value={t.id_tipo_equipo}>{t.nombre_tipo_equipo}</option>
                    ))}
                  </select>
                  {errors.id_tipo_equipo && <div className="invalid-feedback">{errors.id_tipo_equipo.message}</div>}
                </div>

                {/* Modelo */}
                <div className="col-12 col-md-6">
                  <label htmlFor="modelo_equipo" className="form-label req-asterisk">Modelo</label>
                  <input
                    id="modelo_equipo"
                    type="text"
                    className={`form-control ${errors.modelo_equipo ? "is-invalid" : ""}`}
                    {...register("modelo_equipo", {
                      required: "Modelo es obligatorio",
                      minLength: { value: 2, message: "Mínimo 2 caracteres" },
                      maxLength: { value: 60, message: "Máximo 60 caracteres" },
                    })}
                  />
                  {errors.modelo_equipo && <div className="invalid-feedback">{errors.modelo_equipo.message}</div>}
                </div>

                {/* Marca */}
                <div className="col-12 col-md-6">
                  <label htmlFor="marca_equipo" className="form-label req-asterisk">Marca</label>
                  <input
                    id="marca_equipo"
                    type="text"
                    className={`form-control ${errors.marca_equipo ? "is-invalid" : ""}`}
                    {...register("marca_equipo", {
                      required: "Marca es obligatoria",
                      minLength: { value: 2, message: "Mínimo 2 caracteres" },
                      maxLength: { value: 60, message: "Máximo 60 caracteres" },
                    })}
                  />
                  {errors.marca_equipo && <div className="invalid-feedback">{errors.marca_equipo.message}</div>}
                </div>

                {/* Especificaciones */}
                <div className="col-12">
                  <label htmlFor="especificaciones_equipo" className="form-label req-asterisk">Especificaciones</label>
                  <input
                    id="especificaciones_equipo"
                    type="text"
                    className={`form-control ${errors.especificaciones_equipo ? "is-invalid" : ""}`}
                    {...register("especificaciones_equipo", {
                      required: "Especificaciones es obligatorio",
                      maxLength: { value: 200, message: "Máximo 200 caracteres" },
                    })}
                  />
                  {errors.especificaciones_equipo && <div className="invalid-feedback">{errors.especificaciones_equipo.message}</div>}
                </div>

                {/* Fecha de compra */}
                <div className="col-12 col-md-6">
                  <label htmlFor="fecha_compra_equipo" className="form-label req-asterisk">Fecha de compra</label>
                  <input
                    id="fecha_compra_equipo"
                    type="date"
                    className={`form-control ${errors.fecha_compra_equipo ? "is-invalid" : ""}`}
                    {...register("fecha_compra_equipo", { required: "La fecha es obligatoria" })}
                  />
                  {errors.fecha_compra_equipo && <div className="invalid-feedback">{errors.fecha_compra_equipo.message}</div>}
                </div>

                {/* Estado */}
                <div className="col-12 col-md-6">
                  <label htmlFor="estado_equipo" className="form-label req-asterisk">Estado</label>
                  <select
                    id="estado_equipo"
                    className={`form-select ${errors.estado_equipo ? "is-invalid" : ""}`}
                    defaultValue=""
                    {...register("estado_equipo", { required: "El estado es obligatorio" })}
                  >
                    <option value="" disabled>Seleccione…</option>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                  {errors.estado_equipo && <div className="invalid-feedback">{errors.estado_equipo.message}</div>}
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

import Axios from "axios";
import { useForm } from "react-hook-form";
import NavBar from "../../components/Navbar";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function CrearCliente() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm({ mode: "onTouched" });

  const [globalError, setGlobalError] = useState(null);
  const [globalSuccess, setGlobalSuccess] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (raw) => {
    setGlobalError(null);
    setGlobalSuccess(null);

    // Limpia espacios
    const data = Object.fromEntries(
      Object.entries(raw).map(([k, v]) => [
        k,
        typeof v === "string" ? v.trim() : v,
      ])
    );

    try {
      await Axios.post("http://localhost:3000/api/clientes", data, {
        withCredentials: true,
      });
      reset();
      setGlobalSuccess("Cliente creado correctamente.");
      // Navega tras una pequeña pausa (opcional) para que el usuario vea el éxito
      setTimeout(() => navigate("/ConsultarCliente"), 600);
    } catch (error) {
      const serverMsg = error?.response?.data?.message;
      const message = serverMsg || "Error al crear el cliente.";
      setGlobalError(message);

      // Si tu API envía errores de campo, puedes mapearlos:
      const fieldErrors = error?.response?.data?.errors; // { nombre_cliente: "Ya existe", ... }
      if (fieldErrors && typeof fieldErrors === "object") {
        Object.entries(fieldErrors).forEach(([field, msg]) => {
          setError(field, { type: "server", message: String(msg) });
        });
      }
    }
  };

  const campos = [
    {
      label: "Nombre",
      id: "nombre_cliente",
      type: "text",
      autoComplete: "name",
      required: true,
    },
    {
      label: "Dirección",
      id: "direccion_cliente",
      type: "text",
      autoComplete: "street-address",
      required: true,
    },
    {
      label: "Teléfono",
      id: "telefono_cliente",
      type: "tel",
      inputMode: "tel",
      autoComplete: "tel",
      required: true,
      pattern: /^[0-9+\s()-]{7,20}$/, // Permite +, espacios, guiones, paréntesis
    },
    {
      label: "Correo",
      id: "correo_cliente",
      type: "email",
      autoComplete: "email",
      required: true,
      // Validación de email básica; RHF ya valida type="email", pero reforzamos
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    },
    {
      label: "Responsable",
      id: "encargado_cliente",
      type: "text",
      autoComplete: "organization-title",
      required: true,
    },
    {
      label: "Estado",
      id: "estado_cliente",
      type: "select",
      options: ["Activo", "Inactivo"],
      required: true,
    },
  ];

  return (
    <>
      <style>{`
        .liftable { transition: transform .15s ease, box-shadow .15s ease; }
        .liftable:hover, .liftable:focus {
          transform: translateY(-2px);
          box-shadow: 0 .5rem 1rem rgba(0,0,0,.08);
          outline: none;
        }
        .req-asterisk::after {
          content: " *";
          color: #dc3545;
          font-weight: 600;
        }
      `}</style>

      <div className="min-vh-100 d-flex flex-column bg-light">
        <NavBar />

        <main className="container flex-grow-1 py-4">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-3">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/MenuPrincipal">Menú principal</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/MenuCliente">Cliente</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Crear
              </li>
            </ol>
          </nav>

          <div className="card shadow border-0 liftable">
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h1 className="h4 mb-0">Crear Cliente</h1>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => navigate(-1)}
                >
                  ← Volver
                </button>
              </div>

              {/* Mensajes globales */}
              {globalSuccess && (
                <div
                  className="alert alert-success"
                  role="alert"
                  aria-live="polite"
                >
                  {globalSuccess}
                </div>
              )}
              {globalError && (
                <div
                  className="alert alert-danger"
                  role="alert"
                  aria-live="assertive"
                >
                  {globalError}
                </div>
              )}

              <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <div className="row g-3">
                  {campos.map((f) => (
                    <div className="col-12 col-md-6" key={f.id}>
                      <label
                        htmlFor={f.id}
                        className={`form-label ${
                          f.required ? "req-asterisk" : ""
                        }`}
                      >
                        {f.label}
                      </label>

                      {f.type === "select" ? (
                        <select
                          id={f.id}
                          className={`form-select ${
                            errors[f.id] ? "is-invalid" : ""
                          }`}
                          aria-invalid={!!errors[f.id]}
                          defaultValue=""
                          {...register(f.id, {
                            required: f.required
                              ? `${f.label} es obligatorio`
                              : false,
                          })}
                        >
                          <option value="">Seleccione...</option>
                          {f.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          id={f.id}
                          type={f.type}
                          inputMode={f.inputMode}
                          autoComplete={f.autoComplete}
                          className={`form-control ${
                            errors[f.id] ? "is-invalid" : ""
                          }`}
                          aria-invalid={!!errors[f.id]}
                          {...register(f.id, {
                            required: f.required
                              ? `${f.label} es obligatorio`
                              : false,
                            pattern: f.pattern
                              ? {
                                  value: f.pattern,
                                  message: `Formato inválido de ${f.label.toLowerCase()}`,
                                }
                              : undefined,
                            minLength: f.minLength
                              ? {
                                  value: f.minLength,
                                  message: `${f.label} es demasiado corto`,
                                }
                              : undefined,
                            maxLength: f.maxLength
                              ? {
                                  value: f.maxLength,
                                  message: `${f.label} es demasiado largo`,
                                }
                              : undefined,
                          })}
                        />
                      )}

                      {errors[f.id] && (
                        <div className="invalid-feedback">
                          {errors[f.id]?.message}
                        </div>
                      )}
                    </div>
                  ))}
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
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Guardando…
                      </>
                    ) : (
                      "Crear"
                    )}
                  </button>
                </div>

                <p className="text-body-secondary text-center small mt-3">
                  Los campos marcados con <span className="text-danger">*</span>{" "}
                  son obligatorios.
                </p>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

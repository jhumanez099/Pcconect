import Axios from "axios";
import { useForm } from "react-hook-form";
import NavBar from "../../components/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CrearTipoUsuario() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [globalError, setGlobalError] = useState(null);

  const onSubmit = (data) => {
    crearTipoUsuario(data);
  };

  const crearTipoUsuario = (tipoUsuarioData) => {
    Axios.post("http://localhost:3000/api/tiposUsuarios", tipoUsuarioData)
      .then(() => {
        reset();
        setGlobalError(null);
      })
      .catch((error) => {
        const errorMessage =
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Error al crear el tipo de usuario. Intenta nuevamente.";
        setGlobalError(errorMessage);
      });
  };

  const navigate = useNavigate();

  return (
    <div className="min-vh-100 d-flex flex-column bg-secondary">
      <NavBar />
      <div className="d-flex justify-content-center align-items-center flex-grow-1">
        <div className="col-11 col-sm-10 col-md-8 col-lg-6 col-xl-5 bg-white rounded card shadow p-4 m-4">
          <div className="row my-4 gx-5">
            <div className="col-12 d-flex justify-content-between align-items-center mb-3">
              <button onClick={() => navigate("/MenuPrincipal")} className="btn btn-primary btn-sm">← Regresar</button>
              <h1 className="text-center w-100 mb-0">Crear tipo usuario</h1>
            </div>
          </div>

          {globalError && <div className="alert alert-danger">{globalError}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="px-3">
            {[
              { label: "Nombre", id: "nombreTipoUsuario", type: "text" },
            ].map((field, index) => (
              <div className="mb-4 row align-items-center" key={index}>
                <label
                  htmlFor={field.id}
                  className="col-sm-4 col-form-label text-end"
                  aria-invalid={errors[field.id] ? "true" : "false"}
                >
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
                      {field.options.map((option, idx) => (
                        <option key={idx} value={option}>{option}</option>
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
                  {errors[field.id] && (
                    <div className="invalid-feedback">{errors[field.id].message}</div>
                  )}
                </div>
              </div>
            ))}
            <div className="text-center">
              <button type="submit" className="btn btn-success px-4 py-2">
                Crear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

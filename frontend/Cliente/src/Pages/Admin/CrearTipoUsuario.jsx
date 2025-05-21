import Axios from "axios";
import { useForm } from "react-hook-form";
import NavBar from "../../components/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CrearTipoUsuario() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [globalError, setGlobalError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await Axios.post("http://localhost:3000/api/tiposUsuarios", data, {
        withCredentials: true,
      });
      reset();
      setGlobalError(null);
      alert("Tipo de usuario creado con éxito.");
      navigate("/ConsultarTipoUsuario");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error al crear el tipo de usuario.";
      setGlobalError(errorMessage);
    }
  };

  const campos = [
    {
      label: "Nombre",
      id: "nombre_tipo_usuario",
      type: "text",
    }
  ];

  return (
    <div className="min-vh-100 d-flex flex-column bg-secondary">
      <NavBar />
      <div className="d-flex justify-content-center align-items-center flex-grow-1 px-2">
        <div className="w-100 bg-white rounded card shadow p-4 m-4" style={{ maxWidth: "1000px" }}>
          <div className="mb-4 position-relative">
            <button className="btn btn-outline-primary position-absolute start-0" onClick={() => navigate('/MenuPrincipal')}>← Menú principal</button>
            <h1 className="text-center">Crear Tipo de Usuario</h1>
          </div>

          {globalError && <div className="alert alert-danger">{globalError}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="px-3">
            {campos.map((field, index) => (
              <div className="mb-4 row align-items-center" key={index}>
                <label htmlFor={field.id} className="col-sm-4 col-form-label text-end">{field.label}:</label>
                <div className="col-sm-8">
                  <input
                    type={field.type}
                    className={`form-control ${errors[field.id] ? "is-invalid" : ""}`}
                    id={field.id}
                    {...register(field.id, {
                      required: `${field.label} es obligatorio`,
                      minLength: field.id === "nombre_tipo_usuario" ? { value: 3, message: "Debe tener al menos 3 caracteres" } : undefined,
                    })}
                  />
                  {errors[field.id] && (
                    <div className="invalid-feedback">{errors[field.id].message}</div>
                  )}
                </div>
              </div>
            ))}
            <div className="text-center">
              <button type="submit" className="btn btn-success px-4 py-2">Crear</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

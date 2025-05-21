import Axios from "axios";
import { useForm } from "react-hook-form";
import NavBar from "../../components/Navbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CrearUsuario() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [globalError, setGlobalError] = useState(null);
  const [tiposUsuario, setTiposUsuario] = useState([]);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await Axios.post("http://localhost:3000/api/usuarios", data, { withCredentials: true });
      reset();
      alert("Usuario creado con éxito.");
      navigate("/ConsultarUsuario");
    } catch (error) {
      const msg = error.response?.data?.message || "Error al crear el usuario.";
      setGlobalError(msg);
    }
  };

  const obtenerTiposUsuario = () => {
    Axios.get("http://localhost:3000/api/tiposUsuarios", { withCredentials: true })
      .then(res => setTiposUsuario(res.data))
      .catch(err => console.error("Error cargando tipos de usuario:", err));
  };

  useEffect(() => {
    obtenerTiposUsuario();
  }, []);

  const campos = [
    { label: "Nombre", id: "nombre_usuario", type: "text" },
    { label: "Correo", id: "correo_usuario", type: "email" },
    { label: "Contraseña", id: "contraseña_usuario", type: "password" },
    { label: "Teléfono", id: "telefono_usuario", type: "text" },
    { label: "Cargo", id: "cargo_usuario", type: "text" },
    {
      label: "Estado",
      id: "estado_usuario",
      type: "select",
      options: ["Activo", "Inactivo"],
    },
  ];

  return (
    <div className="min-vh-100 d-flex flex-column bg-secondary">
      <NavBar />
      <div className="d-flex justify-content-center align-items-center flex-grow-1 px-2">
        <div className="w-100 bg-white rounded card shadow p-4 m-4" style={{ maxWidth: "1000px" }}>
          <div className="mb-4 position-relative">
            <button className="btn btn-outline-primary position-absolute start-0" onClick={() => navigate('/MenuPrincipal')}>← Menú principal</button>
            <h1 className="text-center">Crear Usuario</h1>
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
                  {errors[field.id] && <div className="invalid-feedback">{errors[field.id].message}</div>}
                </div>
              </div>
            ))}

            <div className="mb-4 row align-items-center">
              <label htmlFor="id_tipo_usuario" className="col-sm-4 col-form-label text-end">
                Tipo de usuario:
              </label>
              <div className="col-sm-8">
                <select
                  className={`form-control ${errors.id_tipo_usuario ? "is-invalid" : ""}`}
                  id="id_tipo_usuario"
                  {...register("id_tipo_usuario", { required: "Tipo de usuario es obligatorio" })}
                >
                  <option value="">Seleccione...</option>
                  {tiposUsuario.map((tipo) => (
                    <option key={tipo.id_tipo_usuario} value={tipo.id_tipo_usuario}>
                      {tipo.nombre_tipo_usuario}
                    </option>
                  ))}
                </select>
                {errors.id_tipo_usuario && (
                  <div className="invalid-feedback">{errors.id_tipo_usuario.message}</div>
                )}
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

import Axios from "axios";
import { useForm } from "react-hook-form";
import NavBar from "../../components/Navbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CrearEquipo() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [globalError, setGlobalError] = useState(null);
  const [tipoEquipo, setTipoEquipo] = useState([]);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await Axios.post("http://localhost:3000/api/equipos", data, {
        withCredentials: true,
      });
      reset();
      alert("Equipo creado correctamente.");
      navigate("/ConsultarEquipo");
    } catch (error) {
      const msg = error.response?.data?.message || "Error al crear el equipo.";
      setGlobalError(msg);
    }
  };

  useEffect(() => {
    Axios.get("http://localhost:3000/api/tiposEquipos", { withCredentials: true })
      .then((res) => setTipoEquipo(res.data))
      .catch((err) => console.error("Error al cargar tipos de equipo:", err));
  }, []);

  const campos = [
    { label: "Modelo", id: "modelo_equipo", type: "text" },
    { label: "Marca", id: "marca_equipo", type: "text" },
    { label: "Especificaciones", id: "especificaciones_equipo", type: "text" },
    { label: "Fecha de compra", id: "fecha_compra_equipo", type: "date" },
    {
      label: "Estado",
      id: "estado_equipo",
      type: "select",
      options: ["Activo", "Inactivo"],
    },
  ];

  return (
    <div className="min-vh-100 d-flex flex-column bg-secondary">
      <NavBar />
      <div className="d-flex justify-content-center align-items-center flex-grow-1">
        <div className="col-11 col-sm-10 col-md-8 col-lg-6 col-xl-5 bg-white rounded card shadow p-4 m-4">
          <div className="row my-4 gx-5">
            <div className="col-12 d-flex justify-content-between align-items-center mb-3">
              <button onClick={() => navigate("/MenuPrincipal")} className="btn btn-primary btn-sm">← Regresar</button>
              <h1 className="text-center w-100 mb-0">Crear equipo</h1>
            </div>
          </div>

          {globalError && <div className="alert alert-danger">{globalError}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="px-3">
            <div className="mb-4 row align-items-center">
              <label htmlFor="id_tipo_equipo" className="col-sm-4 col-form-label text-end">Tipo:</label>
              <div className="col-sm-8">
                <select
                  className={`form-control ${errors.id_tipo_equipo ? "is-invalid" : ""}`}
                  id="id_tipo_equipo"
                  {...register("id_tipo_equipo", { required: "Tipo de equipo es obligatorio" })}
                >
                  <option value="">Seleccione...</option>
                  {tipoEquipo.map((tipo) => (
                    <option key={tipo.id_tipo_equipo} value={tipo.id_tipo_equipo}>
                      {tipo.nombre_tipo_equipo}
                    </option>
                  ))}
                </select>
                {errors.id_tipo_equipo && (
                  <div className="invalid-feedback">{errors.id_tipo_equipo.message}</div>
                )}
              </div>
            </div>

            {campos.map((field, index) => (
              <div className="mb-4 row align-items-center" key={index}>
                <label htmlFor={field.id} className="col-sm-4 col-form-label text-end">{field.label}:</label>
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
              <button type="submit" className="btn btn-success px-4 py-2">Crear</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

import Axios from "axios";
import { useForm } from "react-hook-form";
import NavBar from "../../components/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CrearTipoPedido() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [globalError, setGlobalError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await Axios.post("http://localhost:3000/api/tiposPedidos", data, {
        withCredentials: true,
      });
      reset();
      alert("Tipo de pedido creado con éxito.");
      navigate("/ConsultarTipoPedido");
    } catch (error) {
      const msg = error.response?.data?.message || "Error al crear el tipo de pedido.";
      setGlobalError(msg);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <NavBar />
      <div className="d-flex justify-content-center align-items-center flex-grow-1 px-2">
        <div className="w-100 bg-white rounded card shadow p-4 m-4" style={{ maxWidth: "1000px" }}>
          <div className="mb-4 position-relative">
            <button className="btn btn-outline-primary position-absolute start-0" onClick={() => navigate('/MenuPrincipal')}>← Menú principal</button>
            <h1 className="text-center">Crear Tipo de Pedido</h1>
          </div>

          {globalError && <div className="alert alert-danger">{globalError}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="px-3">
            <div className="mb-4 row align-items-center">
              <label htmlFor="nombre_tipo_pedido" className="col-sm-4 col-form-label text-end">Nombre:</label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className={`form-control ${errors.nombre_tipo_pedido ? "is-invalid" : ""}`}
                  id="nombre_tipo_pedido"
                  {...register("nombre_tipo_pedido", {
                    required: "Nombre es obligatorio",
                    minLength: { value: 3, message: "Debe tener al menos 3 caracteres" }
                  })}
                />
                {errors.nombre_tipo_pedido && (
                  <div className="invalid-feedback">{errors.nombre_tipo_pedido.message}</div>
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

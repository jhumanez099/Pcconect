import Axios from "axios";
import { useForm } from "react-hook-form";
import NavBar from "../../components/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CrearTipoPedido() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [globalError, setGlobalError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await Axios.post("http://localhost:3000/api/tiposPedidos", data);
      reset();
      setGlobalError(null);
      alert("Tipo de pedido creado con éxito.");
      // navigate("/admin/consultarTipoPedido");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al crear el tipo de pedido.";
      setGlobalError(errorMessage);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-secondary">
      <NavBar />
      <div className="d-flex justify-content-center align-items-center flex-grow-1">
        <div className="col-11 col-sm-10 col-md-8 col-lg-6 col-xl-5 bg-white rounded card shadow p-4 m-4">
          <div className="row my-4 gx-5">
            <div className="col-12 d-flex justify-content-between align-items-center mb-3">
              <button onClick={() => navigate("/MenuPrincipal")} className="btn btn-primary btn-sm">← Regresar</button>
              <h1 className="text-center w-100 mb-0">Crear tipo de pedido</h1>
            </div>
          </div>

          {globalError && <div className="alert alert-danger">{globalError}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="px-3">
            <div className="mb-4 row align-items-center">
              <label htmlFor="nombre_tipo_pedido" className="col-sm-4 col-form-label text-end">
                Nombre:
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  id="nombre_tipo_pedido"
                  className={`form-control ${errors.nombre_tipo_pedido ? "is-invalid" : ""}`}
                  {...register("nombre_tipo_pedido", {
                    required: "El nombre es obligatorio",
                    minLength: { value: 3, message: "Mínimo 3 caracteres" },
                  })}
                />
                {errors.nombre_tipo_pedido && (
                  <div className="invalid-feedback">
                    {errors.nombre_tipo_pedido.message}
                  </div>
                )}
              </div>
            </div>

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

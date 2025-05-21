import { useNavigate } from "react-router-dom";
import NavBar from "../../components/Navbar";

export default function MenuCliente() {
  const navigate = useNavigate();

  const opciones = [
    { nombre: "Crear", ruta: "/CrearCliente" },
    { nombre: "Consultar", ruta: "/ConsultarCliente" },
  ];

  return (
    <div className="min-vh-100 d-flex flex-column">
      <NavBar />
      <div className="d-flex justify-content-center align-items-center flex-grow-1 px-3">
        <div className="w-100 rounded card shadow p-4 m-4" style={{ maxWidth: "600px" }}>
          <h2 className="text-center mb-4">Menú Cliente</h2>
          <div className="d-grid gap-3">
            {opciones.map((opcion, index) => (
              <button
                key={index}
                className="btn btn-outline-primary fw-bold text-start px-4 py-2"
                onClick={() => navigate(opcion.ruta)}
              >
                {opcion.nombre}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

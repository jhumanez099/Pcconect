import { useNavigate } from "react-router-dom";
import NavBar from "../../components/Navbar";

export default function MenuPrincipal() {
  const navigate = useNavigate();

  const opciones = [
    { nombre: "Clientes", ruta: "/ConsultarCliente" },
    { nombre: "Usuarios", ruta: "/ConsultarUsuario" },
    { nombre: "Equipos", ruta: "/ConsultarEquipo" },
    { nombre: "Pedidos", ruta: "/ConsultarPedido" },
  ];

  return (
    <div className="min-vh-100 d-flex flex-column bg-secondary">
      <NavBar />
      <div className="d-flex justify-content-center align-items-center flex-grow-1">
        <div className="col-10 col-sm-8 col-md-6 col-lg-5 bg-white rounded card shadow p-5">
          <h2 className="text-center mb-4">Menú Principal</h2>
          <div className="d-grid gap-3">
            {opciones.map((opcion, index) => (
              <button
                key={index}
                className="btn btn-primary btn-lg"
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

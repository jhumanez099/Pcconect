import { useNavigate } from "react-router-dom";
import NavBar from "../../components/Navbar";

export default function MenuPrincipal() {
  const navigate = useNavigate();

  const opciones = [
    { nombre: "Clientes", ruta: "/MenuCliente" },
    { nombre: "Tipos de Usuarios", ruta: "/MenuTipoUsuario" },
    { nombre: "Usuarios", ruta: "/MenuUsuario" },
    { nombre: "Tipos de Equipos", ruta: "/MenuTipoEquipo" },
    { nombre: "Equipos", ruta: "/MenuEquipo" },
    { nombre: "Tipos de Pedido", ruta: "/MenuTipoPedido" },
    { nombre: "Pedidos", ruta: "/MenuPedido" },
  ];

  return (
    <div className="min-vh-100 d-flex flex-column">
      <NavBar />
      <div className="d-flex justify-content-center align-items-center flex-grow-1 px-3">
        <div className="w-100 bg-white rounded card shadow p-4 m-4" style={{ maxWidth: "600px" }}>
          <h2 className="text-center mb-4">Menú Principal</h2>
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

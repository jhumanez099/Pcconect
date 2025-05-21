import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function NavBar() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        alert("Sesión cerrada correctamente");
        setUser(null);
        navigate("/");
      } else {
        alert("Error al cerrar sesión");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Error inesperado al cerrar sesión");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold text-white fs-4" to="/MenuPrincipal">PCCONECT</Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex gap-3">
            <li className="nav-item">
              <Link className="nav-link text-white fw-semibold" to="/MenuCliente">
                <i className="bi bi-people-fill me-1"></i>Clientes
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white fw-semibold" to="/MenuUsuario">
                <i className="bi bi-person-lines-fill me-1"></i>Usuarios
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white fw-semibold" to="/MenuPedido">
                <i className="bi bi-box-seam me-1"></i>Pedidos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white fw-semibold" to="/MenuEquipo">
                <i className="bi bi-hdd-network me-1"></i>Equipos
              </Link>
            </li>
          </ul>
        </div>

        {user && (
          <div className="dropdown ms-3">
            <button
              className="btn btn-outline-light dropdown-toggle d-flex align-items-center"
              id="userDropdowm"
              onClick={() => setShowDropdown(!showDropdown)}
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-person-circle me-2 fs-5"></i> Usuario
            </button>
            <ul className={`dropdown-menu dropdown-menu-end ${showDropdown ? "show" : "" } mt-2 shadow`}>
              <li>
                <button className="dropdown-item text-danger" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>Cerrar sesión
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

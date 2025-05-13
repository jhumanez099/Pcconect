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
    <nav className="navbar navbar-expand-lg navbar-light bg-light w-100">
      <div className="container">
        <Link className="navbar-brand" to="/">PCCONECT</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link className="nav-link" to="/MenuClientes">Clientes</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/MenuUsuarios">Usuarios</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/MenuPedidos">Pedidos</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/MenuEquipos">Equipos</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/Soporte">Soporte</Link></li>

            {user && (
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle bg-transparent border-0 d-flex align-items-center"
                  id="userDropdown"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <i className="bi bi-person-circle fs-4"></i>
                </button>
                <ul className={`dropdown-menu dropdown-menu-end ${showDropdown ? "show" : ""}`} aria-labelledby="userDropdown">
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i> Cerrar sesión
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

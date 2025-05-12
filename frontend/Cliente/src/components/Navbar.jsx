import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


export default function NavBar() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);

  // ✅ Función para cerrar sesión
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/auth/logout", {
        method: "POST",
        credentials: "include", // ✅ Enviar las cookies para eliminarlas
      });

      if (response.ok) {
        alert("Sesión cerrada correctamente");
        setUser(null); // ✅ Limpiar el estado de usuario
        navigate("/"); // ✅ Redirigir al login
      } else {
        alert("Error al cerrar sesión");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Error al cerrar sesión");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light w-100">
      <div className="container">
        <a className="navbar-brand" href="#">PCCONECT</a>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="/MenuClientes">Clientes</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/MenuUsuarios">Usuarios</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/MenuPedidos">Pedidos</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/MenuEquipos">Equipos</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/Soporte">Soporte</a>
            </li>

            {/* ✅ Menú Desplegable de Usuario */}
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle d-flex align-items-center" 
                href="#" 
                id="userDropdown" 
                role="button" 
                onClick={() => setShowDropdown(!showDropdown)} 
                aria-expanded={showDropdown}
              >
                <i className="bi bi-person-circle fs-4"></i>
              </a>
              <ul className={`dropdown-menu dropdown-menu-end ${showDropdown ? "show" : ""}`} aria-labelledby="userDropdown">
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

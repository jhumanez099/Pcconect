import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Logout() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const cerrarSesion = async () => {
      try {
        await fetch("http://localhost:3000/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });

        setUser(null);
        navigate("/");
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        alert("No se pudo cerrar sesión correctamente.");
      }
    };

    cerrarSesion();
  }, [setUser, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <h3>Cerrando sesión...</h3>
    </div>
  );
}

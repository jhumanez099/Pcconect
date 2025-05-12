// src/components/ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    // ✅ Mostrar un mensaje de carga mientras verifica
    if (loading) {
        return <div>Verificando autenticación...</div>;
    }

    // ✅ Si no está autenticado, redirigir a login
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // ✅ Si está autenticado, permitir acceso
    return children;
};

export default ProtectedRoute;

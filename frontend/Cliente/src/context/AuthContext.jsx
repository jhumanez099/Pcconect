// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // ✅ Estado de carga

    // ✅ Verificar si el usuario está autenticado al cargar la aplicación
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("http://localhost:4000/api/auth/profile", {
                    method: "GET",
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false); // ✅ Finalizar la carga
            }
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};


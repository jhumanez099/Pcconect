import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export default function useAuth() {
    const { user, setUser } = useContext(AuthContext);

    useEffect(() => {
        const obtenerPerfil = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/auth/profile", {
                    credentials: "include",
                });

                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Error al verificar sesión:", error);
                setUser(null);
            }
        };

        if (!user) {
            obtenerPerfil();
        }
    }, [user, setUser]);

    return { user };
}

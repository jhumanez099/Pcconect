// src/hooks/useAuth.js
import { useEffect, useState } from "react";

export const useAuth = () => {
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        fetch("http://localhost:4000/api/profile", {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.user) {
                    setAuthenticated(true);
                } else {
                    setAuthenticated(false);
                    window.location.href = "/"; // Redirigir al login
                }
            });
    }, []);

    return authenticated;
};

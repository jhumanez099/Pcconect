import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import logo from '../../assets/logo.png'; // Ajusta la ruta de tu logo

export default function LoginRegister() {
    const [isRegister, setIsRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState(""); // Solo para registro
    const [telefono, setTelefono] = useState(""); // ✅ Teléfono
    const [cargo, setCargo] = useState("");       // ✅ Cargo
    const [estadoUsuario, setEstadoUsuario] = useState("activo"); // ✅ Estado (por defecto "activo")

    // ✅ Cambiar entre Login y Registro
    const toggleForm = () => {
        setIsRegister(!isRegister);
    };

    // ✅ Mostrar/Ocultar Contraseña
    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

   // ✅ En tu LoginRegister.js (React)
const handleLogin = async () => {
    if (!email || !password) {
        alert("Correo y contraseña son requeridos");
        return;
    }

    try {
        const response = await fetch("http://localhost:4000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // ✅ Permitir las cookies
            body: JSON.stringify({
                correo_usuario: email,
                contraseña_usuario: password
            }),
        });

        const data = await response.json();
        if (response.ok) {
            alert("Inicio de sesión exitoso");
            console.log("Usuario autenticado:", data);
            window.location.href = "/MenuPrincipal"; // Redirigir a perfil
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("Error al iniciar sesión");
    }
};

// En tu LoginRegister.js
const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password || !telefono || !cargo) {
        alert("Todos los campos son obligatorios");
        return;
    }

    try {
        const response = await fetch("http://localhost:4000/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nombre_usuario: name,
                correo_usuario: email,
                contraseña_usuario: password,
                telefono_usuario: telefono,
                cargo_usuario: cargo,
                estado_usuario: "activo"
            }),
        });

        const data = await response.json();
        if (response.ok) {
            alert("Registro exitoso");
            setIsRegister(false);
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error al registrar:", error);
    }
};


    return (
        <div className="d-flex justify-content-center align-items-center vh-100 position-relative bg-light">
            <div className="login-container" style={{
                background: isRegister ? '#FF5A5F' : '#2E3A59',
                width: '350px',
                borderRadius: '25px',
                padding: '30px',
                position: 'relative',
                color: '#fff'
            }}>
                <div className="text-center mb-4">
                    <img src={logo} className="logo" alt="Logo"/>
                </div>

                {isRegister ? (
                    <div>
                        <h3 className="text-center">Registrarme</h3>
                        <input 
                            type="text" 
                            placeholder="Nombre" 
                            className="form-control mb-2" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                        <input 
                            type="email" 
                            placeholder="Email" 
                            className="form-control mb-2" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                        <input 
                            type="text" 
                            placeholder="Teléfono" 
                            className="form-control mb-2" 
                            value={telefono} 
                            onChange={(e) => setTelefono(e.target.value)} 
                        />
                        <input 
                            type="text" 
                            placeholder="Cargo" 
                            className="form-control mb-2" 
                            value={cargo} 
                            onChange={(e) => setCargo(e.target.value)} 
                        />
                        <div className="input-group mb-3">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Contraseña" 
                                className="form-control" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                            <button className="btn btn-outline-light" onClick={togglePassword}>👁️</button>
                        </div>
                        <button className="btn btn-light w-100" onClick={handleRegister}>Crear cuenta</button>
                    </div>
                ) : (
                    <div>
                        <h3 className="text-center">LOGIN</h3>
                        <input type="email" placeholder="Correo" className="form-control mb-2" 
                            value={email} onChange={(e) => setEmail(e.target.value)} />
                        <div className="input-group mb-3">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Contraseña" 
                                className="form-control" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                            <button className="btn btn-outline-light" onClick={togglePassword}>👁️</button>
                        </div>
                        <button className="btn btn-light w-100" onClick={handleLogin}>Iniciar Sesión</button>
                    </div>
                )}

                <div className="position-absolute" style={{ bottom: '-5px', right: '-5px' }}>
                    <button className="btn btn-danger rounded-circle" style={{ width: '50px', height: '50px' }} onClick={toggleForm}>+
                    </button>
                </div>
            </div>
        </div>
    );
}

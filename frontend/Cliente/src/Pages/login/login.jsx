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

    const toggleForm = () => {
        setIsRegister(!isRegister);
    };

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    // ✅ Función para manejar el inicio de sesión
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // ✅ Necesario para recibir la cookie del JWT
                body: JSON.stringify({
                    correoUsuario: email,
                    contraseñaUsuario: password,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Inicio de sesión exitoso");
                console.log("Usuario logeado:", data);
                // Aquí puedes redirigir al dashboard o alguna otra ruta
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
        }
    };

    // ✅ Función para manejar el registro
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombreUsuario: name,
                    correoUsuario: email,
                    contraseñaUsuario: password,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Registro exitoso");
                console.log("Usuario registrado:", data);
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
                        <input type="text" placeholder="Nombre" className="form-control mb-2" 
                            value={name} onChange={(e) => setName(e.target.value)} />
                        <input type="email" placeholder="Email" className="form-control mb-2" 
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

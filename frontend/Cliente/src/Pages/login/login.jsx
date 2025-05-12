import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import logo from '../../assets/logo.png'; // Ajusta la ruta de tu logo

export default function LoginRegister() {
    const [isRegister, setIsRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState(""); // Cargo del usuario
    const [status, setStatus] = useState("activo"); // Estado del usuario (por defecto activo)
    const [userType, setUserType] = useState(1); // ID del Tipo de Usuario (puedes cambiar el valor)

    const toggleForm = () => {
        setIsRegister(!isRegister);
    };

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };
// ✅ Asegúrate de tener las funciones definidas ANTES del return
const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch("http://localhost:3000/api/auth/login", {
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

// ✅ La función de registro también debe estar definida correctamente
const handleRegister = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                idTipoUsuario: userType,
                nombreUsuario: name,
                correoUsuario: email,
                contraseñaUsuario: password,
                telefonoUsuario: phone,
                cargoUsuario: role,
                estadoUsuario: status,
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
                        <input type="text" placeholder="Nombre Completo" className="form-control mb-2" 
                            value={name} onChange={(e) => setName(e.target.value)} />
                        <input type="email" placeholder="Correo" className="form-control mb-2" 
                            value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input type="tel" placeholder="Teléfono" className="form-control mb-2" 
                            value={phone} onChange={(e) => setPhone(e.target.value)} />
                        <input type="text" placeholder="Cargo" className="form-control mb-2" 
                            value={role} onChange={(e) => setRole(e.target.value)} />
                        <input type="number" placeholder="Tipo de Usuario" className="form-control mb-2" 
                            value={userType} onChange={(e) => setUserType(e.target.value)} />
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

import React, { useState } from "react";
import './Styles/Login.css';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import logo1 from './Images/logo1.png'; // Importa la imagen

function Login() {
    const [carnet, setCarnet] = useState('');
    const [password, setPassword] = useState('');
    const [cookie, setCookie] = useCookies(['user']);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!carnet || !password) {
            alert("Por favor, ingresa todos los campos.");
            return;
        }

        const data = {
            carnet: parseInt(carnet, 10),
            contrasenia: password
        };

        try {
            const response = await fetch(`http://localhost:5000/login`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const res = await response.json();

            if (res.success) {
                const dataUser = res.user;
                setCookie('user', dataUser);
                navigate('/inicio');
            } else {
                alert("Número de carnet y/o contraseña incorrectos.");
            }

            setCarnet("");
            setPassword("");
        } catch (error) {
            console.error(error);
            alert("Hubo un error con el servidor. Inténtalo nuevamente.");
        }
    };

    const handleRegister = () => {
        navigate('/registro');
    };

    const handleForgotPassword = () => {
        navigate('/contraseña_olvidada');
    };

    return (
        <div className="login-background">
            <div className="container-fluid h-100">
                <div className="row align-items-center h-100">
                    <div className="col-md-6 mx-auto">
                        <div className="card">
                            <div className="card-body">
                                <div className="login-header d-flex align-items-center">
                                    <img src={logo1} alt="USAC Logo" className="logo" style={{ width: '76px', height: 'auto' }} />
                                    <div className="text-container">
                                        <h1 className="university">UNIVERSIDAD DE SAN CARLOS DE GUATEMALA</h1>
                                        <h2 className="faculty">Facultad de Ingeniería</h2>
                                    </div>
                                </div>

                                <h3 className="login-title">INICIAR SESIÓN EN INGENIERÍA USAC</h3>

                                <form onSubmit={handleSubmit} className="form-signin w-100 m-auto">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="202400000"
                                            onChange={(e) => setCarnet(e.target.value)}
                                            value={carnet}
                                            required
                                        />
                                        <label htmlFor="codigo">CUI / REGISTRO ACADEMICO / REGISTRO PERSONAL</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder="Contraseña"
                                            onChange={(e) => setPassword(e.target.value)}
                                            value={password}
                                            required
                                        />
                                        <label htmlFor="contrasenia">Contraseña</label>
                                    </div>
                                    <div className="form-check mb-3">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="rememberMe"
                                        />
                                        <label className="form-check-label" htmlFor="rememberMe">
                                            Recordar mi usuario
                                        </label>
                                    </div>
                                    <div className="text-center">
                                        <button type="submit" className="btn btn-grey btn-lg">Iniciar Sesión</button>
                                    </div>
                                </form>
                                <div className="row align-items-center justify-content-center mt-3">
                                    <div className="col-auto text-center">
                                        <p className="registration-text">
                                            ¿No tienes cuenta? <a href="#" onClick={handleRegister} className="register-link">Regístrate</a>
                                        </p>
                                    </div>
                                    <div className="col-auto text-center mt-2">
                                        <a href="#" onClick={handleForgotPassword} className="forgot-password-link">¿Olvidaste tu contraseña?</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;

import React, { useState } from "react";
import './Styles/Login.css';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import logo1 from './Images/logo1.png'; // Importa la imagen

function Login() {
    const [codigo, setCodigo] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [cookie, setCookie] = useCookies(['user']);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!codigo || !contrasenia) {
            alert("Por favor, ingresa todos los campos.");
            return;
        }

        const data = {
            codigo: parseInt(codigo, 10),
            contrasenia: contrasenia
        };

        fetch(`http://localhost:5000/login`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.success) {
                    const dataUser = res.user;
                    alert(`Bienvenido: ${dataUser.nombres} ${dataUser.apellidos}`);
                    setCookie('user', dataUser);
                    navigate('/inicio');
                } else {
                    alert(`Número de carnet y/o contraseña incorrectos.`);
                }
                setCodigo("");
                setContrasenia("");
            })
            .catch((error) => {
                console.error(error);
                alert("Hubo un error con el servidor. Inténtalo nuevamente.");
            });
    };

<<<<<<< HEAD
=======
    const handleRegister = () => {
        navigate('/register');
    };

>>>>>>> 1eedc8e8d6f84a94ecd496270b422e1fee46f00f
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
                                            onChange={(e) => setCodigo(e.target.value)}
                                            value={codigo}
                                            required
                                        />
<<<<<<< HEAD
                                        <label>CUI / REGISTRO ACADEMICO / REGISTRO PERSONAL</label>
=======
                                        <label htmlFor="floatingInput">Número de Carnet</label>
>>>>>>> 1eedc8e8d6f84a94ecd496270b422e1fee46f00f
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder="Contraseña"
                                            onChange={(e) => setContrasenia(e.target.value)}
                                            value={contrasenia}
                                            required
                                        />
                                        <label>Contraseña</label>
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
<<<<<<< HEAD
                                <div className="text-center mt-3">
                                    <a href="#">¿Olvidó su contraseña?</a>
=======
                                <div className="row align-items-center justify-content-center">
                                    <div className="col-auto text-center">
                                        ¿No tienes cuenta?
                                    </div>
                                    <div className="col-auto text-start">
                                        <button type="submit" class="btn btn-outline-primary" onClick={handleRegister}>Regístrate</button>
                                    </div>
>>>>>>> 1eedc8e8d6f84a94ecd496270b422e1fee46f00f
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

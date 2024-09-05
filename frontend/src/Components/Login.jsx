import React, { useState, userState } from "react";
import './Styles/Login.css';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

function Login() {
    const [codigo, setCodigo] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [cookie, setCookie] = useCookies(['user']);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = {
            codigo: parseInt(codigo, 10),
            contrasenia: contrasenia
        }

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
                    alert(`Bienvenido: ${dataUser.nombres} ${dataUser.apellidos}`)
                    setCookie('user', dataUser);
                    navigate('/inicio');
                } else {
                    alert(`Numero de carnet y/o contraseña incorrectos.`)
                }
                setCodigo("")
                setContrasenia("")
            })
            .catch((error) => console.error(error));
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <div className="login-background">
            <div className="container-fluid h-100">
                <div className="row align-items-center h-100">
                    <div className="col-md-6 mx-auto">
                        <div className="card">
                            <div className="card-body">
                                <h2 className="card-title text-center mb-4">Inicio de Sesión</h2>
                                <form onSubmit={handleSubmit} className='form-signin w-100 m-auto'>
                                    <div className="form-floating" style={{ width: "100%" }}>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="floatingInput"
                                            placeholder="202400000"
                                            onChange={(e) => setCodigo(e.target.value)}
                                            value={codigo}
                                        />
                                        <label htmlFor="floatingInput">Número de Carnet</label>
                                    </div>
                                    <div className="form-floating" style={{ width: "100%" }}>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="floatingPassword"
                                            placeholder="Password"
                                            onChange={(e) => setContrasenia(e.target.value)}
                                            value={contrasenia}
                                        />
                                        <label htmlFor="floatingPassword">Contraseña</label>
                                    </div>
                                    <div className="text-center">
                                        <button type="submit" className="btn btn-outline-primary btn-lg">Iniciar Sesión</button>
                                    </div>
                                </form>
                                <div className="row align-items-center justify-content-center">
                                    <div className="col-auto text-center">
                                        ¿No tienes cuenta?
                                    </div>
                                    <div className="col-auto text-start">
                                        <button type="submit" class="btn btn-outline-primary" onClick={handleRegister}>Regístrate</button>
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
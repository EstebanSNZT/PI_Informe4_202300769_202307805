import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Styles/recuperar.css'; // Asegúrate de que la ruta al CSS sea correcta

function RecuperarContra() {
    const [codigo, setCodigo] = useState('');
    const [email, setEmail] = useState(''); 
    const [nuevaContrasenia, setNuevaContrasenia] = useState('');
    const [confirmarContrasenia, setConfirmarContrasenia] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        if (nuevaContrasenia !== confirmarContrasenia) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        const data = {
            codigo: parseInt(codigo, 10),
            email: email,
            nuevaContrasenia: nuevaContrasenia
        };

        fetch(`http://localhost:5000/recuperar-contrasena`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.success) {
                    alert("Contraseña actualizada con éxito.");
                    navigate('/login');
                } else {
                    alert("Datos incorrectos. Por favor verifica el código y el correo electrónico.");
                }
                setCodigo("");
                setEmail("");
                setNuevaContrasenia("");
                setConfirmarContrasenia("");
            })
            .catch((error) => {
                console.error(error);
                alert("Hubo un error con el servidor. Inténtalo nuevamente.");
            });
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <div className="recover-background">
            <div className="container-fluid h-100">
                <div className="row align-items-center h-100">
                    <div className="col-md-6 mx-auto">
                        <div className="card">
                            <div className="card-body">
                                <h2 className="card-title text-center mb-4">Recuperar Contraseña</h2>
                                <form onSubmit={handleSubmit} className="recover-form needs-validation" noValidate>
                                    <div className="mb-3">
                                        <label htmlFor="codigoInput" className="form-label">Número de Carnet/Código USAC</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="codigoInput"
                                            onChange={(e) => setCodigo(e.target.value)}
                                            value={codigo}
                                            required
                                        />
                                        <div className="invalid-feedback">Por favor ingrese un número de carnet/código USAC.</div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="emailInput" className="form-label">Correo electrónico</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="emailInput"
                                            onChange={(e) => setEmail(e.target.value)}
                                            value={email}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="nuevaContraseniaInput" className="form-label">Nueva Contraseña</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="nuevaContraseniaInput"
                                            onChange={(e) => setNuevaContrasenia(e.target.value)}
                                            value={nuevaContrasenia}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="confirmarContraseniaInput" className="form-label">Confirmar Contraseña</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="confirmarContraseniaInput"
                                            onChange={(e) => setConfirmarContrasenia(e.target.value)}
                                            value={confirmarContrasenia}
                                            required
                                        />
                                    </div>
                                    <div className="text-center">
                                        <button type="submit" className="btn btn-primary btn-lg">Actualizar Contraseña</button>
                                    </div>
                                </form>
                                <div className="text-center mt-3">
                                    <p>
                                        <a href="#" onClick={handleLoginRedirect} className="back-to-login">Regresar a Login</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecuperarContra;

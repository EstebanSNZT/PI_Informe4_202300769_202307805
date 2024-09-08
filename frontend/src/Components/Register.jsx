import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Styles/test.css';

function Register() {
    const [code, setCode] = useState('');
    const [names, setNames] = useState('');
    const [lastNames, setLastNames] = useState('');
    const [gender, setGender] = useState('');
    const [faculty, setFaculty] = useState('');
    const [career, setCareer] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate(); // Hook para la navegación

    const handleSubmit = (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }
        const newUser = {
            codigo: parseInt(code, 10),
            nombres: names,
            apellidos: lastNames,
            genero: gender,
            facultad: faculty,
            carrera: career,
            correo: email,
            contrasenia: password
        };

        fetch(`http://localhost:5000/users`, {
            method: "POST",
            body: JSON.stringify(newUser),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((res) => {
                console.log(res);
                alert(`Se ha creado su usuario ${newUser.nombres} ${newUser.apellidos}`);
                navigate('/login'); // Redirige al login después de un registro exitoso
            })
            .catch((error) => console.error(error));
    };

    const handleLogin = () => {
        navigate('/login');
    };

    useEffect(() => {
        const forms = document.querySelectorAll('.needs-validation');
        Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, []);

    return (
        <div className="register-background">
            <div className="register-card">
                <h2 className="card-title text-center mb-4">Registro</h2>
                <form onSubmit={handleSubmit} className="register-form needs-validation" noValidate>
                    <div className="mb-3">
                        <label htmlFor="codeInput" className="form-label">Número de Carnet/Código USAC</label>
                        <input
                            type="number"
                            className="form-control"
                            id="codeInput"
                            onChange={(e) => setCode(e.target.value)}
                            value={code}
                            required
                        />
                        <div className="invalid-feedback">Por favor ingrese un número de carnet/código USAC.</div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="namesInput" className="form-label">Nombres</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="namesInput"
                                    onChange={(e) => setNames(e.target.value)}
                                    value={names}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="lastNamesInput" className="form-label">Apellidos</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="lastNamesInput"
                                    onChange={(e) => setLastNames(e.target.value)}
                                    value={lastNames}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label htmlFor="genderFormSelect" className="form-label">Género</label>
                            <select className="form-select" id="genderFormSelect" onChange={(e) => setGender(e.target.value)} value={gender} required>
                                <option value="">Seleccionar...</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                        <div className="col">
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
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="facultyInput" className="form-label">Facultad</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="facultyInput"
                                    onChange={(e) => setFaculty(e.target.value)}
                                    value={faculty}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="careerInput" className="form-label">Carrera</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="careerInput"
                                    onChange={(e) => setCareer(e.target.value)}
                                    value={career}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="passwordInput" className="form-label">Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="passwordInput"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="confirmPasswordInput" className="form-label">Confirmar contraseña</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmPasswordInput"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    value={confirmPassword}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-register btn-lg">Registrarse</button>
                    </div>
                </form>
                <div className="row align-items-center justify-content-center mt-3">
                    <div className="col-auto text-center">
                        ¿Ya tienes cuenta?
                    </div>
                    <div className="col-auto text-center">
                        <button type="button" className="btn btn-link" onClick={handleLogin}>Iniciar sesión</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;

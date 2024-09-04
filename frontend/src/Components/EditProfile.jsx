import React, { useState, useEffect, Fragment } from 'react';
import './Styles/User.css';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function EditProfile() {
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const [names, setNames] = useState('');
    const [lastNames, setLastNames] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [faculty, setFaculty] = useState('');
    const [career, setCareer] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        const currentUser = cookies.user;
        setNames(currentUser.nombres);
        setLastNames(currentUser.apellidos);
        setGender(currentUser.genero);
        setEmail(currentUser.correo);
        setFaculty(currentUser.facultad);
        setCareer(currentUser.carrera);
        setPassword("");
        setConfirmPassword("");
    }, [cookies]);


    const handleSubmit = (event) => {
        event.preventDefault();
        const currentUser = cookies.user;
        const editedUser = {
            codigo: parseInt(currentUser.codigo, 10),
            nombres: names,
            apellidos: lastNames,
            genero: gender,
            correo: email,
            facultad: faculty,
            carrera: career,
            contrasenia: password
        }

        fetch(`http://localhost:5000/editUser`, {
            method: "PUT",
            body: JSON.stringify(editedUser),
            headers: {
                "Content-Type": "application/json",
            },
        })

            .then((response) => response.json())
            .then((res) => {
                console.log(res)
                if (res.success) {
                    const updatedUser = res.user;
                    alert(`Perfil Editado`)
                    setCookie('user', updatedUser);
                } else {
                    alert(`Usuario no encontrado`)
                }
            })
            .catch((error) => console.error(error));
    };

    const handleLogout = () => {
        removeCookie('user');
        navigate('/login')
    };

    const handleCancel = () => {
        const currentUser = cookies.user;
        setNames(currentUser.nombres);
        setLastNames(currentUser.apellidos);
        setGender(currentUser.genero);
        setEmail(currentUser.correo);
        setFaculty(currentUser.facultad);
        setCareer(currentUser.carrera);
        setPassword("");
        setConfirmPassword("");
    };

    return (
        <Fragment>
            <div style={{ display: "flex", alignItems: "center", height: "10vh", width: "100%", top: "0", backgroundColor: "#29437B", position: 'fixed', zIndex: "1" }}>
                <div style={{ display: "flex", alignItems: "center", height: "10vh", width: "50%", top: 0, paddingLeft: "5%" }}>
                    <ul style={{ listStyleType: "none", display: "flex", alignItems: "center", height: "100%", padding: 0, margin: "0px" }}>
                        <li style={{ color: "white", marginRight: "35px" }}>
                            <Link style={{ color: "white", textDecoration: "none", fontSize: "18px" }} to="/inicio">
                                <i class="bi bi-house"></i> Inicio
                            </Link>
                        </li>
                        <li style={{ color: "white", marginRight: "35px" }}>
                            <Link style={{ color: "white", textDecoration: "none", fontSize: "18px" }} to="/crear_posts">
                                <i class="bi bi-plus-circle"></i> Crear Posts
                            </Link>
                        </li>
                        <li style={{ color: "white", marginRight: "35px" }}>
                            <Link style={{ color: "white", textDecoration: "none", fontSize: "18px" }} to="/editar_perfil">
                                <i class="bi bi-pencil-square"></i> Editar Perfil
                            </Link>
                        </li>
                    </ul>
                </div>
                <div style={{ display: "flex", alignItems: "center", height: "10vh", width: "50%", top: 0, flexDirection: "row-reverse", paddingRight: "5%" }}>
                    <button className="btn btn-outline-info" onClick={handleLogout} style={{ fontSize: "18px" }}>
                        <i class="bi bi-box-arrow-left"></i> Cerrar Sesión
                    </button>
                </div>
            </div>
            <div className="row align-items-center justify-content-center" style={{ paddingTop: "8%", paddingBottom: "5%", paddingRight: "11px", paddingLeft: "11px" }}>
                <div className="col-md-8 mx-auto">
                    <h2 className="text-start mb-4">Edita tu perfil</h2>
                    <form onSubmit={handleSubmit} className='form-checkin w-100 m-auto'>
                        <div className="row align-items-center mb-3">
                            <div className="col text-start">
                                <label for="namesInput" className="form-label" style={{ fontSize: "20px" }}>Nombres</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="namesInput"
                                    onChange={(e) => setNames(e.target.value)}
                                    value={names}
                                />
                            </div>
                            <div className="col text-start">
                                <label for="lastNamesInput" className="form-label" style={{ fontSize: "20px" }}>Apellidos</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="lastNamesInput"
                                    onChange={(e) => setLastNames(e.target.value)}
                                    value={lastNames}
                                />
                            </div>
                        </div>
                        <div className="row align-items-center mb-3">
                            <div className="col text-start">
                                <label for="genderFormSelect" className="form-label style" style={{ fontSize: "20px" }}>Género</label>
                                <select className="form-select" id="genderFormSelect" onChange={(e) => setGender(e.target.value)} value={gender}>
                                    <option selected></option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Femenino">Femenino</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>
                            <div className="col text-start">
                                <label for="emailInput" className="form-label" style={{ fontSize: "20px" }}>Correo electrónico</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="emailInput"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                />
                            </div>
                        </div>
                        <div className="row align-items-center mb-3">
                            <div className="col text-start">
                                <label for="facultyInput" className="form-label" style={{ fontSize: "20px" }}>Facultad</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="facultyInput"
                                    onChange={(e) => setFaculty(e.target.value)}
                                    value={faculty}
                                />
                            </div>
                            <div className="col text-start">
                                <label for="careerInput" className="form-label" style={{ fontSize: "20px" }}>Carrera</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="careerInput"
                                    onChange={(e) => setCareer(e.target.value)}
                                    value={career}
                                />
                            </div>
                        </div>
                        <div className="row align-items-center mb-3">
                            <div className="col text-start">
                                <label for="passwordInput" className="form-label" style={{ fontSize: "20px" }}>Nueva contraseña</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="passwordInput"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                />
                            </div>
                            <div className="col text-start">
                                <label for="confirmPasswordInput" className="form-label" style={{ fontSize: "20px" }}>Confirmar nueva contraseña</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmPasswordInput"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    value={confirmPassword}
                                />
                            </div>
                        </div>
                        <div className="row align-items-center justify-content-center ">
                            <div className="col-auto text-center">
                                <button type="submit" className="btn btn-outline-primary btn-lg" style={{ fontSize: "23px", height: "60px", width: "190px" }}>
                                    <i class="bi bi-pencil-square" style={{ marginRight: "3%" }}></i> Editar perfil
                                </button>
                            </div>
                            <div className="col-auto text-center">
                                <button type="button" className="btn btn-outline-danger" onClick={handleCancel} style={{ fontSize: "23px", height: "60px", width: "190px" }}>
                                    <i class="bi bi-x" style={{ marginRight: "3%" }}></i>Cancelar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Fragment>
    );
}

export default EditProfile;
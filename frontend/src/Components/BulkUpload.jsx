import React, { useState, useEffect, Fragment } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function BulkUpload() {
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const [newUsers, setNewUsers] = useState([]);
    const [newPosts, setNewPosts] = useState([]);
    const navigate = useNavigate();

    const handleLogout = () => {
        removeCookie('user');
        navigate('/login');
    };

    const handleUploadUsers = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (file) {

            fetch(`http://localhost:5000/uploadUsers`, {
                method: "POST",
                body: file,
                headers: {
                    "Content-Type": "application/json",
                },
            })

                .then((response) => response.json())
                .then((res) => {
                    console.log(res);
                    alert(res.response);
                    setNewUsers(res.body);
                })
                .catch((error) => console.error(error));
        }


    };

    const handleUploadPosts = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (file) {

            fetch(`http://localhost:5000/uploadPosts`, {
                method: "POST",
                body: file,
                headers: {
                    "Content-Type": "application/json",
                },
            })

                .then((response) => response.json())
                .then((res) => {
                    console.log(res);
                    alert(res.response);
                    setNewPosts(res.body);
                })
                .catch((error) => console.error(error));
        }

    };

    return (
        <Fragment>
            <div style={{ overflow: 'hidden' }}>
                <div style={{ display: "flex", alignItems: "center", height: "10vh", width: "100%", top: "0", backgroundColor: "#29437B", position: 'fixed', zIndex: "1" }}>
                    <div style={{ display: "flex", alignItems: "center", height: "10vh", width: "50%", top: 0, paddingLeft: "5%" }}>
                        <ul style={{ listStyleType: "none", display: "flex", alignItems: "center", height: "100%", padding: 0, margin: "0px" }}>
                            <li style={{ color: "white", marginRight: "23px" }}>
                                <div class="dropdown">
                                    <button className="btn dropdown-toggle" type="button " data-bs-toggle="dropdown" aria-expanded="false" style={{ color: "white", fontSize: "18px" }}>
                                        <i class="bi bi-binoculars"></i> Visualizar Datos
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li>
                                            <Link style={{ textDecoration: "none", fontSize: "18px", paddingLeft: "7%" }} to="/administrador/visualizar_usuarios">
                                                <i class="bi bi-people"></i> Usuarios
                                            </Link>
                                        </li>
                                        <li>
                                            <Link style={{ textDecoration: "none", fontSize: "18px", paddingLeft: "7%" }} to="/administrador/visualizar_posts">
                                                <i class="bi bi-postcard"></i> Posts
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li style={{ color: "white", marginRight: "35px" }}>
                                <Link style={{ color: "white", textDecoration: "none", fontSize: "18px" }} to="/administrador/carga_masiva">
                                    <i class="bi bi-upload"></i> Carga Masiva
                                </Link>
                            </li>
                            <li style={{ color: "white", marginRight: "35px" }}>
                                <Link style={{ color: "white", textDecoration: "none", fontSize: "18px" }} to="/administrador/reportes">
                                    <i class="bi bi-bar-chart-line"></i> Reportes
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
                        <h2 className="text-start" style={{ marginBottom: "2rem" }}>Carga Masiva</h2>
                        <ul class="nav nav-tabs" id="tab" role="tablist" style={{ borderBottom: 0 }}>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="users-tab" data-bs-toggle="tab" data-bs-target="#users-tab-pane" type="button" role="tab" aria-controls="users-tab-pane" aria-selected="true" style={{ fontSize: "18px" }}>Usuarios</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="posts-tab" data-bs-toggle="tab" data-bs-target="#posts-tab-pane" type="button" role="tab" aria-controls="posts-tab-pane" aria-selected="false" style={{ fontSize: "18px" }}>Posts</button>
                            </li>
                        </ul>
                        <div className="card">
                            <div className="card-body">
                                <div class="tab-content" id="tabContent">
                                    <div class="tab-pane fade show active" id="users-tab-pane" role="tabpanel" aria-labelledby="users-tab" tabindex="0">
                                        <label htmlFor="users-upload" className="btn btn-outline-warning" style={{ marginBottom: "2rem", fontSize: "18px", width: "190px" }}>
                                            <i className="bi bi-upload" style={{ marginRight: "3%" }}></i> Carga Masiva
                                        </label>
                                        <input onChange={handleUploadUsers} id="users-upload" type="file" accept="json/*" style={{ display: "none" }} />
                                        {(newUsers.length !== 0) ? (
                                            <p style={{ fontSize: "18px", marginBottom: "0.5rem" }}>Acaba de cargar los siguientes usuarios.</p>
                                        ) : null}
                                        <table className="table table-bordered text-center align-middle">
                                            <thead className="table-primary">
                                                <tr>
                                                    <th>Código</th>
                                                    <th>Nombres</th>
                                                    <th>Apellidos</th>
                                                    <th>Género</th>
                                                    <th>Facultad</th>
                                                    <th>Carrrera</th>
                                                    <th>Correo</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    newUsers.map(newUser => (
                                                        <tr key={newUser.codigo}>
                                                            <td>{newUser.codigo}</td>
                                                            <td>{newUser.nombres}</td>
                                                            <td>{newUser.apellidos}</td>
                                                            <td>{newUser.genero}</td>
                                                            <td>{newUser.facultad}</td>
                                                            <td>{newUser.carrera}</td>
                                                            <td>{newUser.correo}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="tab-pane fade" id="posts-tab-pane" role="tabpanel" aria-labelledby="posts-tab" tabindex="0">
                                        <label htmlFor="posts-upload" className="btn btn-outline-warning" style={{ marginBottom: "2rem", fontSize: "18px", width: "190px" }}>
                                            <i className="bi bi-upload" style={{ marginRight: "3%" }}></i> Carga Masiva
                                        </label>
                                        <input onChange={handleUploadPosts} id="posts-upload" type="file" accept="json/*" style={{ display: "none" }} />
                                        {(newPosts.length !== 0) ? (
                                            <p style={{ fontSize: "18px", marginBottom: "0.5rem" }}>Acaba de cargar los siguientes posts.</p>
                                        ) : null}
                                        <table className="table table-bordered text-center align-middle">
                                            <thead className="table-primary">
                                                <tr>
                                                    <th>Código</th>
                                                    <th>Descripción</th>
                                                    <th>Categoría</th>
                                                    <th>Anónimo</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    newPosts.map(newPost => (
                                                        <tr key={newPost.id}>
                                                            <td>{newPost.codigo}</td>
                                                            <td>{newPost.descripcion}</td>
                                                            <td>{newPost.categoria}</td>
                                                            <td>{newPost.anonimo ? "Si" : "No"}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default BulkUpload;
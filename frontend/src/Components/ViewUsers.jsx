import React, { useState, useEffect, Fragment } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function ViewUsers() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userEliminated, setUserEliminated] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const navigate = useNavigate();

    useEffect(() => {

        fetch(`http://localhost:5000/getUsers`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((res) => {
                console.log(res);
                setUsers(res);
            })
            .catch((error) => console.error(error));
    }, [userEliminated]);

    const handleDeleteUser = (userCode) => {

        fetch(`http://localhost:5000/deleteUser/${userCode}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(res => {
                alert(res.response)
                if (res.success) {
                    console.log(res.numberPostEliminated);
                }
                setUserEliminated(!userEliminated);
            })
            .catch(error => console.error("Error al eliminar el usuario:", error));
    };

    const handleExportCvs = () => {
        const headers = ['Código', 'Nombres', 'Apellidos', 'Género', 'Facultad', 'Carrera', 'Correo', 'Contraseña'];
        const cvsUsers = headers.join(',') + '\n' + users.map(user => Object.values(user).join(',')).join('\n');
        const downloadCvs = `data:text/csv; chatset=utf-8 ,${cvsUsers}`;
        const link = document.createElement('a');
        link.href = downloadCvs;
        link.download = 'Usuarios_Usocial.csv';
        link.click();
    };

    const handleViewUser = (user) => {
        console.log(user);
        setSelectedUser(user);
    };

    const handleClose = () => {
        setSelectedUser(null);
    };

    const handleLogout = () => {
        removeCookie('user');
        navigate('/login');
    };

    return (
        <Fragment>
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
                    <h2 className="text-start" style={{ marginBottom: "2rem" }}>Visualización de Usuarios de Usocial</h2>
                    <div className="text-end" style={{ marginBottom: "2rem" }}>
                        <button type="button" class="btn btn-secondary btn-lg" onClick={handleExportCvs}>Exportar como csv</button>
                    </div>
                    <div className="table-container">
                        <table className="table table-bordered text-center align-middle">
                            <thead className="table-primary">
                                <tr>
                                    <th>Código</th>
                                    <th>Nombres</th>
                                    <th>Apellidos</th>
                                    <th>Correo</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    users.map(user => (
                                        <tr key={user.codigo}>
                                            <td>{user.codigo}</td>
                                            <td>{user.nombres}</td>
                                            <td>{user.apellidos}</td>
                                            <td>{user.correo}</td>
                                            <td>
                                                <button className="btn btn-outline-danger" onClick={() => handleDeleteUser(user.codigo)} style={{ marginRight: "5%" }}>
                                                    <i class="bi bi-trash"></i> Eliminar
                                                </button>
                                                <button className="btn btn-outline-warning" onClick={() => handleViewUser(user)}>
                                                    <i class="bi bi-search"></i> Ver
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {selectedUser && (
                            <Modal show={true} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Detalles del Usuario</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <p><strong>Código:</strong> {selectedUser.codigo}</p>
                                    <p><strong>Nombres:</strong> {selectedUser.nombres}</p>
                                    <p><strong>Apellidos:</strong> {selectedUser.apellidos}</p>
                                    <p><strong>Género:</strong> {selectedUser.género}</p>
                                    <p><strong>Facultad:</strong> {selectedUser.facultad}</p>
                                    <p><strong>Carrera:</strong> {selectedUser.carrera}</p>
                                    <p><strong>Correo:</strong> {selectedUser.correo}</p>
                                    <p><strong>Contraseña:</strong> {selectedUser.contrasenia}</p>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Cerrar
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        )}
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default ViewUsers;
import React, { useState, useEffect, Fragment } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function ViewPosts() {
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [postEliminated, setPostEliminated] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const navigate = useNavigate();

    useEffect(() => {

        fetch(`http://localhost:5000/getPostsAdmin`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((res) => {
                console.log(res);
                setPosts(res);
            })
            .catch((error) => console.error(error));
    }, [postEliminated]);

    const handleDeletePost = (postId) => {

        fetch(`http://localhost:5000/deletePost/${postId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(res => {
                alert(res.response)
                setPostEliminated(!postEliminated);
            })
            .catch(error => console.error("Error al eliminar el post:", error));
    };

    const handleExportCvs = () => {
        const headers = ['Código', 'Descripción', 'Categoría', 'Imagen', 'Anónimo', 'Likes', 'Fecha'];
        const cvsPosts = headers.join(',') + '\n' + posts.map(post => {
            const postModified = {
                codigo: post.codigo,
                descripcion: post.descripcion,
                categoria: post.categoria,
                imagen: post.imagen,
                anonimo: post.anonimo,
                likes: post.likes.length,
                fecha: post.fecha
            }
            return Object.values(postModified).join(',')
        }).join('\n');
        console.log(cvsPosts);
        const downloadCvs = `data:text/csv; chatset=utf-8 ,${cvsPosts}`;
        const link = document.createElement('a');
        link.href = downloadCvs;
        link.download = 'Posts_Usocial.csv';
        link.click();
    };

    const handleViewPost = (post) => {
        setSelectedPost(post);
    };

    const handleClose = () => {
        setSelectedPost(null);
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
                    <h2 className="text-start" style={{ marginBottom: "2rem" }}>Visualización de Posts de Usocial</h2>
                    <div className="text-end" style={{ marginBottom: "2rem" }}>
                        <button type="button" class="btn btn-secondary btn-lg" onClick={handleExportCvs}>Exportar como csv</button>
                    </div>
                    <div className="table-container">
                        <table className="table table-bordered text-center align-middle">
                            <thead className="table-primary">
                                <tr>
                                    <th>Código</th>
                                    <th>Descripción</th>
                                    <th>Categoría</th>
                                    <th>Fecha</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    posts.map(post => (
                                        <tr key={post.codigo}>
                                            <td>{post.codigo}</td>
                                            <td style={{ wordWrap: "break-word", maxWidth: "250px" }}>{post.descripcion}</td>
                                            <td style={{ wordWrap: "break-word", maxWidth: "100px" }}>{post.categoria}</td>
                                            <td>{post.fecha}</td>
                                            <td>
                                                <button className="btn btn-outline-danger" style={{ marginRight: "5%" }} onClick={() => handleDeletePost(post.id)}>
                                                    <i class="bi bi-trash"></i> Eliminar
                                                </button>
                                                <button className="btn btn-outline-warning" onClick={() => handleViewPost(post)}>
                                                    <i class="bi bi-search"></i> Ver
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {selectedPost && (
                            <Modal show={true} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Detalles de la Publicación</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <p><strong>Id:</strong> {selectedPost.id}</p>
                                    <p><strong>Fecha:</strong> {selectedPost.fecha}</p>
                                    <p><strong>Código:</strong> {selectedPost.codigo}</p>
                                    <p><strong>Descripción:</strong> {selectedPost.descripcion}</p>
                                    <p><strong>Imagen:</strong>{selectedPost.imagen === "" ? " No cuenta con imagen" : <img className="card-img-top" src={selectedPost.imagen} alt="Card image cap" />}</p>
                                    <p><strong>Likes:</strong> {selectedPost.likes.length}</p>
                                    <p><strong>Comentarios:</strong></p>
                                    {
                                        selectedPost.comentarios.map((comentario, index) => (
                                            <div>
                                                <p style={{ fontWeight: "500" }}>Comentario No. {index + 1}</p>
                                                <p> Fecha: {comentario.fecha}</p>
                                                <p> Código: {comentario.codigo}</p>
                                                <p> Descripción: {comentario.comentario}</p>
                                            </div>
                                        ))
                                    }
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

export default ViewPosts;
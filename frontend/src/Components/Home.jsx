import React, { Fragment, useState, useEffect } from 'react';
import './Styles/User.css';
import { useCookies } from 'react-cookie';
import { useNavigate, Link } from "react-router-dom";
import Comentario from './comentarios'; // Asegúrate de que la ruta al archivo sea correcta

// Componente para mostrar el inicio y la lista de publicaciones
function Home() {
    const [cookies, removeCookie] = useCookies(['user']);
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Cargar las publicaciones guardadas en el localStorage
        const savedPosts = JSON.parse(localStorage.getItem('posts')) || [];
        // Asegurarse de que cada publicación tenga una propiedad de comentarios
        const updatedPosts = savedPosts.map(post => ({
            ...post,
            comentarios: post.comentarios || []
        }));
        setPosts(updatedPosts);
    }, []);

    // Manejar el cierre de sesión del usuario
    const handleLogout = () => {
        removeCookie('user');
        navigate('/login');
    };

    // Navegar al componente de crear publicación
    const handleClick = () => {
        navigate('/crearpost');
    };

    // Función para eliminar un comentario
    const handleEliminarComentario = (postId, comentarioId) => {
        const updatedPosts = posts.map(post => {
            if (post.id === postId) {
                const updatedComentarios = post.comentarios.filter(com => com.id !== comentarioId);
                return { ...post, comentarios: updatedComentarios };
            }
            return post;
        });
        setPosts(updatedPosts);
        // Actualizar localStorage si es necesario
        localStorage.setItem('posts', JSON.stringify(updatedPosts));
    };

    return (
        <Fragment>
            <div style={{ display: "flex", alignItems: "center", height: "10vh", width: "100%", top: "0", backgroundColor: "#29437B", position: 'fixed', zIndex: "1" }}>
                <div style={{ display: "flex", alignItems: "center", height: "10vh", width: "50%", top: 0, paddingLeft: "5%" }}>
                    <ul style={{ listStyleType: "none", display: "flex", alignItems: "center", height: "100%", padding: 0, margin: "0px" }}>
                        <li style={{ color: "white", marginRight: "35px" }}>
                            <Link style={{ color: "white", textDecoration: "none", fontSize: "18px" }} to="/inicio">
                                <i className="bi bi-house"></i> Menú Principal
                            </Link>
                        </li>
                        <li style={{ color: "white" }}>
                            <button onClick={handleLogout} style={{ backgroundColor: "transparent", border: "none", color: "white", fontSize: "18px" }}>
                                <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="body" style={{ paddingTop: '10vh' }}>
                <div className="fondo">
                    <main className="container1">
                        <h1 className="letrad">Publicaciones</h1>
                        <button className="btn btn-outline-primary" onClick={handleClick}>Crear Nueva Publicación</button>
                        <div className="posts-container">
                            {posts.map((post, index) => (
                                <div key={index} className="post">
                                    <h2>{post.tipo} {post.seleccionado}</h2>
                                    <p>{post.mensaje}</p>
                                    {post.imagenURL && <img src={post.imagenURL} alt="Imagen" style={{ maxWidth: '150px', border: '1px solid #ddd' }} />}
                                    <p><strong>{post.estado ? 'Anónimo' : 'No Anónimo'}</strong></p>
                                    <p><em>{new Date(post.fechaCreacion).toLocaleString()}</em></p>
                                    <div>
                                        <strong>Comentarios:</strong>
                                        {post.comentarios.length > 0 ? (
                                             post.comentarios.map(com => (
                                                    <Comentario
                                                        key={com.id}
                                                        comentario={com}
                                                        onEliminar={(comentarioId) => handleEliminarComentario(post.id, comentarioId)}
                                                    />
                                            ))
                                        ) : (
                                            <p>No hay comentarios.</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        </Fragment>
    );
}

export default Home;

import React, { Fragment, useState, useEffect } from 'react';
import './Styles/User.css';
import { useCookies } from 'react-cookie';
import { useNavigate, Link } from "react-router-dom";
import Comentario from './comentarios';

function Home() {
    const [cookies, removeCookie] = useCookies(['user']);
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const savedPosts = JSON.parse(localStorage.getItem('posts')) || [];
        const updatedPosts = savedPosts.map(post => ({
            ...post,
            comentarios: post.comentarios || []
        }));
        setPosts(updatedPosts);
    }, []);

    const handleLogout = () => {
        removeCookie('user');
        navigate('/login');
    };

    const handleClick = () => {
        navigate('/crearpost');
    };

    const handleEliminarComentario = (postId, comentarioId) => {
        const updatedPosts = posts.map(post => {
            if (post.id === postId) {
                const updatedComentarios = post.comentarios.filter(com => com.id !== comentarioId);
                return { ...post, comentarios: updatedComentarios };
            }
            return post;
        });
        setPosts(updatedPosts);
        localStorage.setItem('posts', JSON.stringify(updatedPosts));
    };

    const filteredPosts = posts.filter(post => {
        const usuario = post.usuario ? post.usuario.toLowerCase() : '';
        const curso = post.curso ? post.curso.toLowerCase() : '';
        const mensaje = post.mensaje ? post.mensaje.toLowerCase() : '';
        const fechaCreacion = post.fechaCreacion ? new Date(post.fechaCreacion).toLocaleDateString() : '';

        return (
            usuario.includes(searchQuery.toLowerCase()) ||
            curso.includes(searchQuery.toLowerCase()) ||
            mensaje.includes(searchQuery.toLowerCase()) ||
            fechaCreacion.includes(searchQuery.toLowerCase())
        );
    });

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
                        <li style={{ color: "white", marginRight: "35px" }}>
                            <button onClick={handleClick} style={{ backgroundColor: "transparent", border: "none", color: "white", fontSize: "18px" }}>
                                <i className="bi bi-pencil-square"></i> Crear Nueva Publicación
                            </button>
                        </li>
                        <li style={{ color: "white" }}>
                            <button onClick={handleLogout} style={{ backgroundColor: "transparent", border: "none", color: "white", fontSize: "18px" }}>
                                <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
                            </button>
                        </li>
                    </ul>
                </div>
                <div style={{ marginLeft: "auto", paddingRight: "5%" }}>
                    <input 
                        type="text"
                        placeholder="Buscar..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ padding: "5px", fontSize: "16px", width: "200px", borderRadius: "5px" }}
                    />
                </div>
            </div>

            <div className="body" style={{ paddingTop: '10vh' }}>
                <div className="fondo">
                    <main className="container1">
                        <h1 className="letrad">Publicaciones</h1>
                        <div className="posts-container">
                            {filteredPosts.length > 0 ? (
                                filteredPosts.map((post, index) => (
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
                                ))
                            ) : (
                                <p>No se encontraron publicaciones.</p>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </Fragment>
    );
}

export default Home;

import React, { useState, useEffect, useRef, Fragment, use } from 'react';
import './Styles/User.css';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Home() {
    const [posts, setPosts] = useState([]);
    const [postView, setpostView] = useState(true);
    const [postChanged, setPostChanged] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const [comment, setComment] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:5000/getPostsUsers`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((res) => {
                console.log(res);
                setPosts(res.reverse());
            })
            .catch((error) => console.error(error));
    }, [postChanged]);

    const handleLogout = () => {
        removeCookie('user');
        navigate('/login')
    };

    function categoryBackgroundColor(category) {
        if (category === "Anuncio Importante") {
            return "#FC8A8A";
        } else if (category === "Divertido") {
            return "#FEF7A6";
        } else if (category === "Académico") {
            return "#B9CBFD";
        } else if (category === "Variedad") {
            return "#C7FEAD";
        }
    }

    function categoryTextColor(category) {
        if (category === "Anuncio Importante") {
            return "#DE0000";
        } else if (category === "Divertido") {
            return "#F9E600";
        } else if (category === "Académico") {
            return "#013CE9";
        } else if (category === "Variedad") {
            return "#4DF300";
        }
    }

    const handleComment = (postId) => {
        const element = document.getElementById(postId);
        const codigo = cookies.user.codigo;
        const newComment = {
            postId: postId,
            codigo: codigo,
            comentario: comment
        }
        console.log(newComment);

        fetch(`http://localhost:5000/commentPost`, {
            method: "POST",
            body: JSON.stringify(newComment),
            headers: {
                "Content-Type": "application/json",
            },
        })

            .then((response) => response.json())
            .then((res) => {
                console.log(res);
                element.value = "";
                setPostChanged(!postChanged);
            })
            .catch((error) => console.error(error));

    };

    const handleLike = (postId) => {
        const codigo = cookies.user.codigo;
        const likeButton = document.getElementById(`likeButon${postId}`);
        const postLike = {
            id: postId,
            codigo: codigo,
            liked: likeButton.checked
        }

        console.log(postLike);

        fetch(`http://localhost:5000/likePost`, {
            method: "POST",
            body: JSON.stringify(postLike),
            headers: {
                "Content-Type": "application/json",
            },
        })

            .then((response) => response.json())
            .then((res) => {
                console.log(res);
                setPostChanged(!postChanged);
            })
            .catch((error) => console.error(error));
    }

    function viewAllPosts() {
        const allPostButton = document.getElementById("allPostButton");
        console.log(posts);
        setpostView(allPostButton.checked);
        setPostChanged(!postChanged);
    }

    function viewTrends() {
        const trendsButton = document.getElementById("trendsButton");
        setpostView(!trendsButton.checked);
        setPostChanged(!postChanged);
    }

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
            <h1 style={{ textAlign: "center", paddingTop: "8%", marginBottom: "54px" }}>
                {
                    postView ? "¡Mira lo que los demás están compartiendo!" : "¡Tendencias!"
                }
                
            </h1>
            <div className="row align-items-start justify-content-between mt-3">
                <div className="col-auto text-center" style={{ marginLeft: "100px" }}>
                    <div className="row mb-4 align-items-center">
                        <input type="radio" onChange={viewAllPosts} className="btn-check" name="options-outlined" id="allPostButton" autocomplete="off" defaultChecked />
                        <label className="btn btn-outline-primary" for="allPostButton" style={{ fontSize: "25px", width: "300px" }}>
                            Todos los Posts
                        </label>
                    </div>
                    <div className="row align-items-center">
                        <input type="radio" onChange={viewTrends} className="btn-check" name="options-outlined" id="trendsButton" autocomplete="off" />
                        <label className="btn btn-outline-danger" for="trendsButton" style={{ fontSize: "25px", width: "300px" }}>
                            <i class="bi bi-fire"></i> Tendencias
                        </label>
                    </div>
                </div>
                <div className="col-auto" style={{ padding: 0, paddingLeft: "0px", marginRight: "100px" }}>
                    {
                        postView ? posts.map((post) => (
                            <div className="card mb-3" key={post.id} style={{ width: "809.41px" }}>
                                <div className="card-body">
                                    <div className="row">
                                        {
                                            (post.anonimo) ? (
                                                <div className="col-6 align-self-start">
                                                    <h4 className="card-title" style={{ marginBottom: 0 }}>Usuario anónimo</h4>
                                                    <p className="card-title" style={{ fontSize: "14px" }} >Universidad de San Carlos de Guatemala</p>
                                                </div>
                                            ) : (
                                                <div className="col-6 align-self-start">
                                                    <h4 className="card-title" style={{ marginBottom: 0 }}>{post.usuario.nombres} {post.usuario.apellidos}</h4>
                                                    <p className="card-title" style={{ fontSize: "14px" }} >{post.usuario.carrera} (Facultad de {post.usuario.facultad})</p>
                                                </div>
                                            )
                                        }
                                        <div className="col-auto align-self-end" style={{ paddingRight: "0.5rem", paddingLeft: "0.5rem", marginBottom: "0.3rem", backgroundColor: categoryBackgroundColor(post.categoria), borderRadius: "7px" }}>
                                            <p style={{ margin: 0, fontSize: "20px", fontWeight: "bold", color: categoryTextColor(post.categoria) }}>{post.categoria}</p>
                                        </div>
                                        <div className="col align-self-start text-end">
                                            <p style={{ margin: 0, fontSize: "15px" }}>{post.fecha}</p>
                                        </div>
                                    </div>
                                    <p className="card-text" style={{ fontSize: "27px" }}>{post.descripcion}</p>
                                    {
                                        (post.imagen === "") ? (
                                            null
                                        ) : (
                                            <img className="card-img-top" src={post.imagen} alt="Card image cap" />
                                        )
                                    }
                                    <div className="row align-items-center justify-content-end" style={{ marginTop: "1rem" }}>
                                        <div className="col-auto text-center" style={{ padding: 0 }}>
                                            <p style={{ marginBottom: 0, fontWeight: '500', fontSize: "20px", lineHeight: "1.2", color: "#dc3545" }}>{post.likes.length}</p>
                                        </div>
                                        <div className="col-auto text-center">
                                            {
                                                post.likes.find(codigo => codigo === cookies.user.codigo) ? (
                                                    <input
                                                        defaultChecked
                                                        type="checkbox"
                                                        className="btn-check"
                                                        id={`likeButon${post.id}`}
                                                        onClick={() => handleLike(post.id)}
                                                        autoComplete='off'
                                                    />
                                                ) : (
                                                    <input
                                                        type="checkbox"
                                                        className="btn-check"
                                                        id={`likeButon${post.id}`}
                                                        onClick={() => handleLike(post.id)}
                                                        autoComplete='off'
                                                    />
                                                )
                                            }
                                            <label className="btn btn-outline-danger" for={`likeButon${post.id}`} style={{ width: "80px", padding: "0.375rem", borderRadius: "16px" }}>
                                                <i className="bi bi-heart" style={{ marginRight: "3%" }}></i>Like
                                            </label>
                                        </div>
                                    </div>
                                    <hr />
                                    <h4 style={{ marginBottom: "1rem" }}>Comentarios {post.comentarios.length}</h4>
                                    {
                                        post.comentarios.map((comment) => (
                                            <div className="card" style={{ height: "auto", width: "100%", marginBottom: "1rem" }}>
                                                <div className="card-body">
                                                    <div className="row align-items-start">
                                                        <div className="col-auto">
                                                            <p style={{ marginBottom: 0, fontWeight: '500', fontSize: "18px", lineHeight: "1.2" }}>{comment.usuario.nombres} {comment.usuario.apellidos}</p>
                                                            <p style={{ fontSize: "13px", marginBottom: "0.5rem" }}>{comment.usuario.carrera} (Facultad de {comment.usuario.facultad})</p>
                                                        </div>
                                                        <div className="col text-end">
                                                            <p style={{ margin: 0, fontSize: "14px" }}>{comment.fecha}</p>
                                                        </div>
                                                        <p style={{ fontSize: "px", margin: "0px" }}>{comment.comentario}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                    <div className="row align-items-center">
                                        <div className="col text center">
                                            <textarea
                                                className="form-control"
                                                id={post.id}
                                                placeholder="Escribe un comentario"
                                                onChange={(e) => setComment(e.target.value)}
                                                style={{ resize: "none" }}
                                            />
                                        </div>
                                        <div className="col-auto text center">
                                            <button
                                                type="button" class="btn btn-outline-primary" onClick={() => handleComment(post.id)}><i class="bi bi-send"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : posts.sort(function (a, b) { return (b.likes.length + b.comentarios.length) - (a.likes.length + a.comentarios.length); }).slice(0, 10).map((post) => (
                            <div className="card mb-3" key={post.id} style={{ width: "809.41px" }}>
                                <div className="card-body">
                                    <div className="row">
                                        {
                                            (post.anonimo) ? (
                                                <div className="col-6 align-self-start">
                                                    <h4 className="card-title" style={{ marginBottom: 0 }}>Usuario anónimo</h4>
                                                    <p className="card-title" style={{ fontSize: "14px" }} >Universidad de San Carlos de Guatemala</p>
                                                </div>
                                            ) : (
                                                <div className="col-6 align-self-start">
                                                    <h4 className="card-title" style={{ marginBottom: 0 }}>{post.usuario.nombres} {post.usuario.apellidos}</h4>
                                                    <p className="card-title" style={{ fontSize: "14px" }} >{post.usuario.carrera} (Facultad de {post.usuario.facultad})</p>
                                                </div>
                                            )
                                        }
                                        <div className="col-auto align-self-end" style={{ paddingRight: "0.5rem", paddingLeft: "0.5rem", marginBottom: "0.3rem", backgroundColor: categoryBackgroundColor(post.categoria), borderRadius: "7px" }}>
                                            <p style={{ margin: 0, fontSize: "20px", fontWeight: "bold", color: categoryTextColor(post.categoria) }}>{post.categoria}</p>
                                        </div>
                                        <div className="col align-self-start text-end">
                                            <p style={{ margin: 0, fontSize: "15px" }}>{post.fecha}</p>
                                        </div>
                                    </div>
                                    <p className="card-text" style={{ fontSize: "27px" }}>{post.descripcion}</p>
                                    {
                                        (post.imagen === "") ? (
                                            null
                                        ) : (
                                            <img className="card-img-top" src={post.imagen} alt="Card image cap" />
                                        )
                                    }
                                    <div className="row align-items-center justify-content-end" style={{ marginTop: "1rem" }}>
                                        <div className="col-auto text-center" style={{ padding: 0 }}>
                                            <p style={{ marginBottom: 0, fontWeight: '500', fontSize: "20px", lineHeight: "1.2", color: "#dc3545" }}>{post.likes.length}</p>
                                        </div>
                                        <div className="col-auto text-center">
                                            {
                                                post.likes.find(codigo => codigo === cookies.user.codigo) ? (
                                                    <input
                                                        defaultChecked
                                                        type="checkbox"
                                                        className="btn-check"
                                                        id={`likeButon${post.id}`}
                                                        onClick={() => handleLike(post.id)}
                                                        autoComplete='off'
                                                    />
                                                ) : (
                                                    <input
                                                        type="checkbox"
                                                        className="btn-check"
                                                        id={`likeButon${post.id}`}
                                                        onClick={() => handleLike(post.id)}
                                                        autoComplete='off'
                                                    />
                                                )
                                            }
                                            <label className="btn btn-outline-danger" for={`likeButon${post.id}`} style={{ width: "80px", padding: "0.375rem", borderRadius: "16px" }}>
                                                <i className="bi bi-heart" style={{ marginRight: "3%" }}></i>Like
                                            </label>
                                        </div>
                                    </div>
                                    <hr />
                                    <h4 style={{ marginBottom: "1rem" }}>Comentarios {post.comentarios.length}</h4>
                                    {
                                        post.comentarios.map((comment) => (
                                            <div className="card" style={{ height: "auto", width: "100%", marginBottom: "1rem" }}>
                                                <div className="card-body">
                                                    <div className="row align-items-start">
                                                        <div className="col-auto">
                                                            <p style={{ marginBottom: 0, fontWeight: '500', fontSize: "18px", lineHeight: "1.2" }}>{comment.usuario.nombres} {comment.usuario.apellidos}</p>
                                                            <p style={{ fontSize: "13px", marginBottom: "0.5rem" }}>{comment.usuario.carrera} (Facultad de {comment.usuario.facultad})</p>
                                                        </div>
                                                        <div className="col text-end">
                                                            <p style={{ margin: 0, fontSize: "14px" }}>{comment.fecha}</p>
                                                        </div>
                                                        <p style={{ fontSize: "px", margin: "0px" }}>{comment.comentario}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                    <div className="row align-items-center">
                                        <div className="col text center">
                                            <textarea
                                                className="form-control"
                                                id={post.id}
                                                placeholder="Escribe un comentario"
                                                onChange={(e) => setComment(e.target.value)}
                                                style={{ resize: "none" }}
                                            />
                                        </div>
                                        <div className="col-auto text center">
                                            <button
                                                type="button" class="btn btn-outline-primary" onClick={() => handleComment(post.id)}><i class="bi bi-send"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </Fragment >
    );
}

export default Home;
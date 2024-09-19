import React, { useState, useEffect, useRef, Fragment, use } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Modal } from 'react-bootstrap';

function OtherHome() {
    const [professors, setProfessors] = useState([]);
    const [courses, setCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [posts, setPosts] = useState([]);
    const [comment, setComment] = useState("");
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");
    const [filter, setFilter] = useState("");
    const [idDetails, setIdDetails] = useState("");
    const [base64Image, setBase64Image] = useState('');
    const [search, setSearch] = useState("")
    const [postChanged, setPostChanged] = useState(false);
    const [image, setImage] = useState('https://img.freepik.com/vector-premium/paisaje-montana-naturaleza-sobre-fondo-gris_8934-347.jpg');
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:5000/getCourses`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((res) => {
                setCourses(res);
                console.log(res);
            })
            .catch((error) => console.error(error));

        fetch(`http://localhost:5000/getProfessors`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((res) => {
                setProfessors(res);
                console.log(res);
            })
            .catch((error) => console.error(error));
    }, []);

    useEffect(() => {
        const getPosts = async () => {
            try {
                const postsResponse = await fetch(`http://localhost:5000/getPosts`, {
                    method: "GET"
                });
                const postsData = await postsResponse.json();
     
                const updatedPosts = await Promise.all(postsData.map(async (post) => {
                    const commentsResponse = await fetch(`http://localhost:5000/getComments/${post.id_publicacion}`);
                    const comments = await commentsResponse.json();
                    return { ...post, comments };
                }));

                if (filter !== "") {
                    const filteredPosts = updatedPosts.filter(post => post.tipo_publicacion === filter);
                    setPosts(filteredPosts);
                    console.log(filteredPosts);
                } else if (search !== "") {
                    const searchedPosts = updatedPosts.filter(post => 
                        post.nombre_catedratico === search || post.nombre_curso === search);
                    setPosts(searchedPosts);
                    console.log(searchedPosts);
                } else {
                    setPosts(updatedPosts);
                    console.log(updatedPosts);
                }
            } catch (error) {
                console.error("Error al cargar publicaciones o comentarios:", error);
            }
        };

        getPosts();
    }, [postChanged, filter]);

    const handleCreate = async (event) => {
        event.preventDefault();
        const newPost = {
            carnet: cookies.user.carnet,
            tipo_publicacion: type,
            id: idDetails,
            mensaje: description,
            imagen: base64Image,
        }
        console.log(newPost);

        try {
            const response = await fetch(`http://localhost:5000/newPost`, {
                method: "POST",
                body: JSON.stringify(newPost),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const res = await response.json();
            console.log(res);
        } catch (error) {
            console.error(error);
        }
        setPostChanged(!postChanged);
        handleCancelPost();
    };

    const handleComment = async (postId) => {
        const element = document.getElementById(postId);
        const newComment = {
            id_publicacion: postId,
            carnet: cookies.user.carnet,
            comentario: comment
        }
        console.log(newComment);

        try {
            const response = await fetch(`http://localhost:5000/newComment`, {
                method: "POST",
                body: JSON.stringify(newComment),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const res = await response.json();
            console.log(res);
        } catch (error) {
            console.error(error);
        }
        element.value = "";
        setPostChanged(!postChanged);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const options = {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        };

        return date.toLocaleDateString('es-ES', options);
    };

    const handleLogout = () => {
        removeCookie('user');
        navigate('/login')
    };

    const handleFilterByProfessor = () => {
        setSearch("");
        setFilter("Catedrático");
    };

    const handleFilterByCourse = () => {
        setSearch("");
        setFilter("Curso");
    };

    const handleAllPosts = () => {
        setFilter("");
        setSearch("");
    };

    const handleImageChange = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(URL.createObjectURL(file));
                setBase64Image(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreatePost = () => {
        setShowModal(true);
    };

    const handleCancelPost = () => {
        setType("");
        setDescription("");
        setShowModal(false);
        setImage('https://img.freepik.com/vector-premium/paisaje-montana-naturaleza-sobre-fondo-gris_8934-347.jpg');
    };

    const handleSearch = (event) => {
        event.preventDefault();
        setFilter("");
        setPostChanged(!postChanged)
    };

    return (
        <Fragment>
            <div className="row align-items-center justify-content-between mt-3 mb-5 mx-4">
                <div className="col d-flex align-items-center">
                    <Link className="text-decoration-none" style={{ color: "#0d6efd", fontSize: "30px" }} to="/perfil">
                        <i className="bi bi-person-circle"></i> {cookies.user.nombre_completo}
                    </Link>
                </div>
                <div className="col d-flex justify-content-center">
                    <Link className="text-decoration-none" style={{ color: "#0d6efd", fontSize: "30px" }} to="/inicio">
                        <i className="bi bi-house"></i> Inicio
                    </Link>
                </div>
                <div className="col d-flex justify-content-end pr-3">
                    <button className="btn btn-outline-primary" onClick={handleLogout} style={{ fontSize: "18px", width: "180px" }}>
                        <i className="bi bi-box-arrow-left"></i> Cerrar Sesión
                    </button>
                </div>
            </div>
            <div className="row align-items-center justify-content-end mx-4">
                <div className="col-auto">
                    <div className="form-inline d-flex">
                        <input 
                            className="form-control mr-2" 
                            type="search" 
                            placeholder="Buscar" 
                            style={{ width: "300px" }} 
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                        />
                        <button className="btn btn-outline-success btn-sm"  onClick={handleSearch} style={{ width: "50px" }}><i class="bi bi-search"></i></button>
                    </div>
                </div>
            </div>
            <div className="row align-items-start justify-content-between pt-5">
                <div className="col-auto text-center" style={{ marginLeft: "100px" }}>
                    <div className="row mb-4 align-items-center">
                        <button className="btn btn-outline-primary" onClick={handleCreatePost} style={{ fontSize: "25px", width: "300px" }}>
                            <i class="bi bi-plus-circle"></i> Crear Posts
                        </button>
                    </div>
                    <div className="row mb-4 align-items-center">
                        <input type="radio" className="btn-check" onChange={handleAllPosts} name="options-outlined" id="allPostButton" autocomplete="off" defaultChecked />
                        <label className="btn btn-outline-success" for="allPostButton" style={{ fontSize: "25px", width: "300px" }}>
                            Todos los Posts
                        </label>
                    </div>
                    <div className="row mb-4 align-items-center">
                        <input type="radio" className="btn-check" onChange={handleFilterByProfessor} name="options-outlined" id="courseButton" autocomplete="off" />
                        <label className="btn btn-outline-info" for="courseButton" style={{ fontSize: "25px", width: "300px" }}>
                            Filtrar por curso
                        </label>
                    </div>
                    <div className="row mb-4 align-items-center">
                        <input type="radio" className="btn-check" onChange={handleFilterByCourse} name="options-outlined" id="professorsButton" autocomplete="off" />
                        <label className="btn btn-outline-warning" for="professorsButton" style={{ fontSize: "25px", width: "300px" }}>
                            Filtrar por Catedrático
                        </label>
                    </div>
                </div>
                <div className="col-auto" style={{ padding: 0, paddingLeft: "0px", marginRight: "100px" }}>
                    {
                        (posts.length > 0) ? (posts.map((post) => (
                            <div className="card mb-3" key={post.id_publicacion} style={{ width: "809.41px" }}>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-6 align-self-start">
                                            <h4 className="card-title" style={{ marginBottom: "3px" }}>{post.nombre_usuario}</h4>
                                            <p className="card-title" style={{ fontSize: "16px", marginBottom: "0px" }} >{post.carrera}</p>
                                            <p className="card-title" style={{ fontSize: "14px", marginBottom: "0px" }} >Facultad de {post.facultad}</p>
                                        </div>
                                        <div className="col">
                                            <div className="row mb-3">
                                                <div className="col d-flex justify-content-end">
                                                    <p style={{ margin: 0, fontSize: "15px", textAlign: "right" }}>{formatDate(post.fecha_creacion)}</p>
                                                </div>
                                            </div>
                                            <div className="row justify-content-center">
                                                {
                                                    post.nombre_catedratico ? (
                                                        <div className="col-auto" style={{ backgroundColor: "#D4EDDA", borderRadius: "7px", padding: "5px" }}>
                                                            <p style={{ margin: 0, fontSize: "20px" }}>
                                                                <strong>{post.tipo_publicacion}:</strong> {post.nombre_catedratico}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="col-auto" style={{ backgroundColor: "#FEF7A6", borderRadius: "7px", padding: "5px" }}>
                                                            <p style={{ margin: 0, fontSize: "20px" }}>
                                                                <strong>{post.tipo_publicacion}:</strong> {post.nombre_curso}
                                                            </p>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <p className="card-text" style={{ fontSize: "27px" }}>{post.mensaje}</p>
                                    {
                                        (post.imagen_base64 === "") ? (
                                            null
                                        ) : (
                                            <img className="card-img-top" src={post.imagen_base64} alt="Card image cap" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                                        )
                                    }
                                    <hr />
                                    <h4 style={{ marginBottom: "1rem" }}>Comentarios {post.comments.length}</h4>
                                    {
                                        post.comments.map((comment) => (
                                            <div className="card" style={{ height: "auto", width: "100%", marginBottom: "1rem" }}>
                                                <div className="card-body">
                                                    <div className="row align-items-start">
                                                        <div className="col-auto">
                                                            <p style={{ marginBottom: 0, fontSize: "18px", lineHeight: "1.2", fontWeight: "bold" }}>{comment.nombre_usuario}</p>
                                                            <p style={{ fontSize: "13px", marginBottom: "1rem" }}>{comment.carrera} (Facultad de {comment.facultad})</p>
                                                        </div>
                                                        <div className="col text-end">
                                                            <p style={{ margin: 0, fontSize: "14px" }}>{formatDate(comment.fecha_creacion)}</p>
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
                                                id={post.id_publicacion}
                                                placeholder="Escribe un comentario"
                                                onChange={(e) => setComment(e.target.value)}
                                                style={{ resize: "none" }}
                                            />
                                        </div>
                                        <div className="col-auto text center">
                                            <button
                                                type="button" onClick={() => handleComment(post.id_publicacion)} class="btn btn-outline-primary"><i class="bi bi-send"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))) : (
                            <div className="card mb-3" style={{ width: "809.41px" }}>
                                <div className="card-body">
                                    <h2 className='text-center fw-bold'>No hay publicaciones disponibles.</h2>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
            <Modal show={showModal} onHide={handleCancelPost} dialogClassName="modal-xl">
                <div className="row align-items-center justify-content-center py-4">
                    <div className="col mx-4">
                        <h2 className="text-start mb-4">Crear nueva publicación</h2>
                        <div className="mb-3">
                            <label for="descriptionTextarea" className="form-label" style={{ fontSize: "18px" }}>Escribe lo que quieras postear:</label>
                            <textarea className="form-control" id="descriptionTextarea" style={{ resize: "none" }} onChange={(e) => setDescription(e.target.value)} value={description}></textarea>
                        </div>
                        <div className="row align-items-center mb-3">
                            <div className="col-auto text-center">
                                <label for="categoryFormSelect" className="col-form-label" style={{ fontSize: "18px" }}>Categoría:</label>
                            </div>
                            <div className="col-auto text-center">
                                <select
                                    className="form-select"
                                    id="categoryFormSelect"
                                    onChange={(e) => setType(e.target.value)}
                                    value={type}
                                >
                                    <option value=""></option>
                                    <option value="Catedrático">Catedrático</option>
                                    <option value="Curso">Curso</option>
                                </select>
                            </div>
                        </div>
                        {type !== "" && (
                            <div className="row mb-3">
                                <div className="col-auto text-center">
                                    <label for="categoryFormSelect" className="col-form-label" style={{ fontSize: "18px" }}>{`${type}:`}</label>
                                </div>
                                <div className="col-auto text-center">
                                    <select
                                        className="form-select"
                                        id="datailsFormSelect"
                                        onChange={(e) => setIdDetails(e.target.value)}
                                        style={{ width: "700px" }}
                                    >
                                        <option value=""></option>
                                        {
                                            type === 'Catedrático' ? professors.map((professor) => (
                                                <option key={`professor-${professor.id_catedratico}`} value={professor.id_catedratico}>{professor.nombre_catedratico}</option>
                                            ))
                                                : courses.map((course) => (
                                                    <option key={`course-${course.id_curso}`} value={course.id_curso}>{course.id_curso} - {course.nombre_curso}</option>
                                                ))
                                        }
                                    </select>
                                </div>
                            </div>
                        )}
                        <div className='row justify-content-center mb-5'>
                            <div className="col-auto text-center align-items-center d-flex">
                                <label htmlFor="file-upload" className="btn btn-outline-warning" style={{ alignContent: "center", fontSize: "21px", height: "50px", width: "230px" }}>
                                    <i className="bi bi-images" style={{ marginRight: "3%" }}></i>Adjuntar Imagen
                                </label>
                                <input onChange={handleImageChange} id="file-upload" type="file" accept="image/*" style={{ display: "none" }} />
                            </div>
                            <div className="col-auto text-center align-items-center" style={{ maxWidth: "500px", maxHeight: "300px", overflow: "hidden" }}>
                                {image && <img src={image} alt="Selected" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />}
                            </div>
                        </div>
                        <div className='row align-items-center justify-content-center mb-3'>
                            <div className="col-auto" style={{ paddingRight: "3%" }}>
                                <button type="button" className="btn btn-outline-success" onClick={handleCreate} style={{ alignContent: "center", fontSize: "23px", height: "60px", width: "190px" }}>
                                    <i class="bi bi-file-arrow-up-fill" style={{ marginRight: "3%" }}></i>Postear
                                </button>
                            </div>
                            <div className="col-auto" style={{ paddingLeft: "3%" }}>
                                <button type="button" className="btn btn-outline-danger" onClick={handleCancelPost} style={{ alignContent: "center", fontSize: "23px", height: "60px", width: "190px" }}>
                                    <i class="bi bi-x" style={{ marginRight: "3%" }}></i>Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </Fragment>
    );
}

export default OtherHome;
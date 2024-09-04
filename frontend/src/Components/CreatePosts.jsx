import React, { useState, useEffect, Fragment } from 'react';
import './Styles/User.css';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function CreatePost() {
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [anonymous, setAnonymous] = useState(false);
    const [image, setImage] = useState('https://img.freepik.com/vector-premium/paisaje-montana-naturaleza-sobre-fondo-gris_8934-347.jpg');
    const [base64Image, setBase64Image] = useState('');
    const navigate = useNavigate();

    const handlePost = () => {
        const codigo = cookies.user.codigo;
        const newPost = {
            codigo: codigo,
            descripcion: description,
            categoria: category,
            imagen: base64Image,
            anonimo: anonymous,
        }
        console.log(newPost);

        fetch(`http://localhost:5000/createPost`, {
            method: "POST",
            body: JSON.stringify(newPost),
            headers: {
                "Content-Type": "application/json",
            },
        })

            .then((response) => response.json())
            .then((res) => {
                console.log(res);
                alert(res.response);
                setDescription("");
                setCategory("");
                setImage('https://img.freepik.com/vector-premium/paisaje-montana-naturaleza-sobre-fondo-gris_8934-347.jpg');
                setBase64Image('');
            })
            .catch((error) => console.error(error));
    };

    const handleCancel = () => {
        setDescription("");
        setCategory("");
        setImage('https://img.freepik.com/vector-premium/paisaje-montana-naturaleza-sobre-fondo-gris_8934-347.jpg');
        setBase64Image('');
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

    const handleLogout = () => {
        removeCookie('user');
        navigate('/login')
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
                    <h2 className="text-start mb-4">Crear nuevo post</h2>
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
                                onChange={(e) => setCategory(e.target.value)}
                                value={category}
                            >
                                <option selected></option>
                                <option value="Anuncio Importante">Anuncio Importante</option>
                                <option value="Divertido">Divertido</option>
                                <option value="Académico">Académico</option>
                                <option value="Variedad">Variedad</option>
                            </select>
                        </div>
                    </div>
                    <div className="row align-items-center mb-3">
                        <div className="col-auto text-center" style={{ fontSize: "18px", paddingRight: "1%" }}>
                            ¿Quieres publicarlo de forma anonima?
                        </div>
                        <div className="col-auto text-center" style={{ fontSize: "18px", paddingLeft: "4%", paddingRight: "7px" }}>
                            No
                        </div>
                        <div className="col-auto" style={{ padding: "0%" }}>
                            <div class="form-check form-switch" style={{ marginBottom: 0 }}>
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="anonymousSwitch"
                                    style={{ width: "45px", height: "25px" }}
                                    onChange={(e) => setAnonymous(e.target.checked)}
                                />
                            </div>
                        </div>
                        <div className="col-auto text-center" style={{ fontSize: "18px", paddingLeft: "7px" }}>
                            Si
                        </div>
                    </div>
                    <div className='row align-items-center mb-5'>
                        <div className="col-auto text-center">
                            <label htmlFor="file-upload" className="btn btn-outline-warning" style={{ alignContent: "center", fontSize: "21px", height: "50px", width: "230px" }}>
                                <i className="bi bi-images" style={{ marginRight: "3%" }}></i>Adjuntar Imagen
                            </label>
                            <input onChange={handleImageChange} id="file-upload" type="file" accept="image/*" style={{ display: "none" }} />
                        </div>
                        <div className="col-6 text-end">
                            {image && <img src={image} alt="Selected" style={{ objectFit: "cover", width: "25rem", height: "15rem" }} />}
                        </div>
                    </div>
                    <div className='row align-items-center justify-content-center mb-3'>
                        <div className="col-auto" style={{ paddingRight: "3%" }}>
                            <button type="button" className="btn btn-outline-success" onClick={handlePost} style={{ alignContent: "center", fontSize: "23px", height: "60px", width: "190px" }}>
                                <i class="bi bi-file-arrow-up-fill" style={{ marginRight: "3%" }}></i>Postear
                            </button>
                        </div>
                        <div className="col-auto" style={{ paddingLeft: "3%" }}>
                            <button type="button" className="btn btn-outline-danger" onClick={handleCancel} style={{ alignContent: "center", fontSize: "23px", height: "60px", width: "190px" }}>
                                <i class="bi bi-x" style={{ marginRight: "3%" }}></i>Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default CreatePost;
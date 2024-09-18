import React, { useState, useEffect, useRef, Fragment, use } from 'react';
import './Styles/User.css';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Modal, Button } from 'react-bootstrap';

function OtherHome() {
    const [professors, setProfessors] = useState([]);
    const [courses, setCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [id, setId] = useState("");
    const [base64Image, setBase64Image] = useState('');
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

    const handleLogout = () => {
        removeCookie('user');
        navigate('/login')
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
        setShowModal(false);
        setImage('https://img.freepik.com/vector-premium/paisaje-montana-naturaleza-sobre-fondo-gris_8934-347.jpg');
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
            <div className="row align-items-start justify-content-between pt-5">
                <div className="col-auto text-center" style={{ marginLeft: "100px" }}>
                    <div className="row mb-4 align-items-center">
                        <button className="btn btn-outline-primary" onClick={handleCreatePost} style={{ fontSize: "25px", width: "300px" }}>
                            <i class="bi bi-plus-circle"></i> Crear Posts
                        </button>
                    </div>
                    <div className="row mb-4 align-items-center">
                        <input type="radio" className="btn-check" name="options-outlined" id="allPostButton" autocomplete="off" defaultChecked />
                        <label className="btn btn-outline-success" for="allPostButton" style={{ fontSize: "25px", width: "300px" }}>
                            Todos los Posts
                        </label>
                    </div>
                    <div className="row mb-4 align-items-center">
                        <input type="radio" className="btn-check" name="options-outlined" id="courseButton" autocomplete="off" />
                        <label className="btn btn-outline-info" for="courseButton" style={{ fontSize: "25px", width: "300px" }}>
                            Filtrar por curso
                        </label>
                    </div>
                    <div className="row mb-4 align-items-center">
                        <input type="radio" className="btn-check" name="options-outlined" id="professorsButton" autocomplete="off" />
                        <label className="btn btn-outline-warning" for="professorsButton" style={{ fontSize: "25px", width: "300px" }}>
                            Filtrar por Catedratico
                        </label>
                    </div>
                </div>
                <div className="col-auto" style={{ padding: 0, paddingLeft: "0px", marginRight: "100px" }}>
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
                                    onChange={(e) => setCategory(e.target.value)}
                                    value={category}
                                >
                                    <option value=""></option>
                                    <option value="Catedrático">Catedrático</option>
                                    <option value="Curso">Curso</option>
                                </select>
                            </div>
                        </div>
                        {category !== "" && (
                            <div className="row mb-3">
                                <div className="col-auto text-center">
                                    <label for="categoryFormSelect" className="col-form-label" style={{ fontSize: "18px" }}>{`${category}:`}</label>
                                </div>
                                <div className="col-auto text-center">
                                    <select
                                        className="form-select"
                                        id="datailsFormSelect"
                                        onChange={(e) => setId(e.target.value)}
                                        style={{ width: "700px" }}
                                    >
                                        <option value=""></option>
                                        {
                                             category === 'Catedrático' ? professors.map((professor) => (
                                                <option key={`professor-${professor.id}`} value={professor.id}>{professor.nombre_completo}</option>
                                             ))
                                             : courses.map((course) => (
                                                 <option key={`course-${course.id}`} value={course.id}>{course.nombre}</option>
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
                                <button type="button" className="btn btn-outline-success" style={{ alignContent: "center", fontSize: "23px", height: "60px", width: "190px" }}>
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
import React, { Fragment, useState, useEffect } from 'react';
import './Styles/post.css';
import { useNavigate, Link } from "react-router-dom";
import Comentario from './comentarios';

// Componente para crear una nueva publicación
function Publicacion() {
    const [tipo, setTipo] = useState('');
    const [opciones, setOpciones] = useState([]);
    const [seleccionado, setSeleccionado] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [fechaCreacion] = useState(new Date().toISOString());
    const [estado, setEstado] = useState(false);
    const [imagenURL, setImagenURL] = useState('');
    const [imagen, setImagen] = useState(null);
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Cargar opciones dependiendo del tipo seleccionado
        const cargarOpciones = async () => {
            const cursos = [
                { id: 1, nombre: 'Matemáticas' },
                { id: 2, nombre: 'Física' }
            ];
            const catedraticos = [
                { id: 1, nombre: 'Dr. Pérez' },
                { id: 2, nombre: 'Dra. López' }
            ];
            
            setOpciones(tipo === 'Curso' ? cursos : (tipo === 'Catedrático' ? catedraticos : []));
        };

        cargarOpciones();
    }, [tipo]);

    // Manejar el cambio del tipo de publicación
    const handleTipoChange = (event) => {
        setTipo(event.target.value);
    };

    // Manejar el cambio de la opción seleccionada
    const handleSeleccionadoChange = (event) => {
        setSeleccionado(event.target.value);
    };

    // Manejar el cambio del mensaje de la publicación
    const handleMensajeChange = (event) => {
        setMensaje(event.target.value);
    };

    // Alternar el estado de anonimato de la publicación
    const handleSwitchChange = () => {
        setEstado(!estado);
    };

    // Manejar el cambio de la imagen seleccionada
    const handleImagenChange = (event) => {
        const file = event.target.files[0];
        const fileTypes = ['image/jpeg', 'image/png', 'image/gif'];

        if (file && fileTypes.includes(file.type) && file.size < 5000000) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagenURL(reader.result);
                setImagen(file);
            };
            reader.readAsDataURL(file);
        } else {
            alert("Solo se permiten imágenes de tipo JPEG, PNG o GIF menores a 5MB.");
            setImagen(null);
        }
    };

    // Manejar el cambio en el campo de nuevo comentario
    const handleComentarioChange = (event) => {
        setNuevoComentario(event.target.value);
    };

    // Agregar un nuevo comentario a la lista de comentarios
    const handleAgregarComentario = () => {
        const id = new Date().getTime();
        const nuevoComentarioObj = { id, texto: nuevoComentario };
        setComentarios([...comentarios, nuevoComentarioObj]);
        setNuevoComentario('');
    };

    // Eliminar un comentario por su ID
    const handleEliminarComentario = (id) => {
        setComentarios(comentarios.filter(com => com.id !== id));
    };

    // Manejar el envío del formulario
    const handleSubmit = (event) => {
        event.preventDefault();

        if (!imagen) {
            alert("Por favor, selecciona una imagen válida.");
            return;
        }

        // Crear una nueva publicación con los datos ingresados
        const newPost = {
            tipo,
            seleccionado,
            mensaje,
            estado,
            fechaCreacion,
            imagenURL,
            comentarios,
        };

        // Guardar la publicación en el localStorage
        const savedPosts = JSON.parse(localStorage.getItem('posts')) || [];
        savedPosts.push(newPost);
        localStorage.setItem('posts', JSON.stringify(savedPosts));

        navigate('/inicio');
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
                    </ul>
                </div>
            </div>

            <div className="body2" style={{ paddingTop: '10vh' }}>
                <div className="fondo">
                    <main className="container1">
                        <div className="form-container">
                            <form onSubmit={handleSubmit}>
                                <h1 className="letrad">Crear Publicación</h1>

                                <h1>Tipo de Publicación:</h1>
                                <select className="select" value={tipo} onChange={handleTipoChange} required>
                                    <option value="">Selecciona un tipo</option>
                                    <option value="Curso">Curso</option>
                                    <option value="Catedrático">Catedrático</option>
                                </select>

                                {tipo && (
                                    <>
                                        <h1>Seleccione {tipo}:</h1>
                                        <select className="select" value={seleccionado} onChange={handleSeleccionadoChange} required>
                                            <option value="">Selecciona un {tipo.toLowerCase()}</option>
                                            {opciones.map(opcion => (
                                                <option key={opcion.id} value={opcion.id}>{opcion.nombre}</option>
                                            ))}
                                        </select>
                                    </>
                                )}

                                <p className="i">Mensaje de la publicación:</p>
                                <textarea id="mensaje" placeholder="Escribe aquí" rows="4" value={mensaje} onChange={handleMensajeChange} required />

                                <div className="estadoPublicacion">
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" checked={estado} onChange={handleSwitchChange} />
                                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                                            ¿Quieres publicarlo de forma anónima?
                                        </label>
                                        <br />
                                        <label className="form-check-label">
                                            {estado ? 'Anónimo' : 'No Anónimo'}
                                        </label>
                                    </div>
                                </div>

                                <label htmlFor="imagen">Imagen:</label>
                                <input type="file" id="imagen" accept="image/*" onChange={handleImagenChange} />

                                {imagenURL && <img src={imagenURL} alt="Vista previa" style={{ maxWidth: '150px', marginTop: '10px', border: '1px solid #ddd' }} />}

                                <p>Comentarios:</p>
                                <textarea value={nuevoComentario} onChange={handleComentarioChange} placeholder="Escribe un comentario" rows="3" />
                                <button type="button" onClick={handleAgregarComentario}>Agregar Comentario</button>

                                {comentarios.map(com => (
                                    <Comentario key={com.id} comentario={com} onEliminar={handleEliminarComentario} />
                                ))}

                                <button type="submit" className="btn btn-outline-success">Crear Publicación</button>
                            </form>
                        </div>
                    </main>
                </div>
            </div>
        </Fragment>
    );
}

export default Publicacion;

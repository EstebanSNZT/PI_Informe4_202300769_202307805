import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Styles/perfil.css';

const Profile = () => {
  const [currentCourses, setCurrentCourses] = useState([
    { name: "Matemáticas", grade: 98 },
    { name: "Física", grade: 85 },
    { name: "Química", grade: 92 }
  ]);
  const [newCourse, setNewCourse] = useState("");
  const [newGrade, setNewGrade] = useState("");

  // Cargar cursos desde localStorage cuando el componente se monta
  useEffect(() => {
    const savedCourses = JSON.parse(localStorage.getItem('courses')) || [];
    setCurrentCourses(savedCourses);
  }, []);

  // Guardar cursos en localStorage cada vez que currentCourses cambie
  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(currentCourses));
  }, [currentCourses]);

  const handleCourseAddition = () => {
    if (newCourse.trim() && newGrade.trim()) {
      const newCourseObject = { name: newCourse.trim(), grade: Number(newGrade.trim()) };
      // Añadir curso solo si no está ya en la lista
      if (!currentCourses.some(course => course.name === newCourseObject.name)) {
        setCurrentCourses([...currentCourses, newCourseObject]);
      }
      setNewCourse("");
      setNewGrade("");
    }
  };

  const handleCourseDeletion = (courseName) => {
    setCurrentCourses(currentCourses.filter(course => course.name !== courseName));
  };

  return (
    <div className="container">
      {/* Encabezado */}
      <div className="row align-items-center justify-content-between mt-3 mb-5 mx-4">
        <div className="col d-flex align-items-center">
          <Link className="text-decoration-none" style={{ color: "#0d6efd", fontSize: "30px" }} >
            <i className="bi bi-person-circle"></i> Perfil Personal
          </Link>
        </div>
        <div className="col d-flex justify-content-center">
          <Link className="text-decoration-none" style={{ color: "#0d6efd", fontSize: "30px" }} to="/inicio">
            <i className="bi bi-house"></i> Inicio
          </Link>
        </div>
      </div>

      <div className="row">
        {/* Sección izquierda - Lista de cursos ganados y agregar cursos */}
        <div className="col-md-3">
          <h3>Cursos Ganados:</h3>
          <ul className="course-list">
            {currentCourses.map((course, index) => (
              <li key={index} className="course-item">
                {course.name} - {course.grade}
                <span 
                  className="delete-icon" 
                  onClick={() => handleCourseDeletion(course.name)}
                >
                  <i className="bi bi-trash"></i>
                </span>
              </li>
            ))}
          </ul>

          <h3>Agregar Curso Ganado:</h3>
          <input
            type="text"
            value={newCourse}
            onChange={(e) => setNewCourse(e.target.value)}
            placeholder="Curso"
          />
          <input
            type="number"
            value={newGrade}
            onChange={(e) => setNewGrade(e.target.value)}
            placeholder="Calificación"
          />
          <button onClick={handleCourseAddition}>Agregar Curso</button>
        </div>

        {/* Sección derecha - Datos personales */}
        <div className="col-md-9">
          <h2>Datos Personales</h2>
          <div className="profile-info">
            <img
              src="https://imagenes.elpais.com/resizer/v2/4UPKL26K5ZICHFC6UIAU5DDHWU.jpg?auth=393fdef15d621d403eec4dc5bc104e8ce874f3be8958f4d708d2ca856b646922&width=414" // Reemplaza con la URL de tu imagen
              alt="Foto de perfil"
              className="profile-pic"
            />
            <div className="profile-details">
              <p><strong>Nombre:</strong> Juan Pérez</p>
              <p><strong>Carnet:</strong> 123456789</p>
              <p><strong>Correo electrónico:</strong> juan.perez@example.com</p>
            </div>
          </div>

          {/* Cursos ganados actualizados */}
          <div className="updated-courses">
            <h3 style={{ color: 'orange' }}>Nuevos cursos ganados:</h3>
            <ul>
              {currentCourses.map((course, index) => (
                <li key={index}>
                  {course.name} - {course.grade}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

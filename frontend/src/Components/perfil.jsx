import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import './Styles/perfil.css';

const Profile = () => {
  const [courses, setCourses] = useState([]);
  const [winnedCourses, setWinnedCourses] = useState([]);
  const [newCourse, setNewCourse] = useState("");
  const [newGrade, setNewGrade] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
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
  }, []);

  const handleCourseAddition = () => {
    if (Number(newGrade) < 61) {
      alert("La calificación debe ser mayor o igual a 61.");
      return;
    };

    if (newCourse.trim() && newGrade.trim()) {
      const newCourseObject = { name: newCourse.trim(), grade: Number(newGrade.trim()) };
      if (!winnedCourses.some(winnedCourse => winnedCourse.name === newCourseObject.name)) {
        setWinnedCourses([...winnedCourses, newCourseObject]);
      }
      setNewCourse("");
      setNewGrade("");
    };
  };

  const handleCourseDeletion = (courseName) => {
    setWinnedCourses(winnedCourses.filter(winnedCourse => winnedCourse.name !== courseName));
  };

  const handleLogout = () => {
    removeCookie('user');
    navigate('/login')
  };

  return (
    <Fragment>
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
        <div className="col d-flex justify-content-end pr-3">
          <button className="btn btn-outline-primary" onClick={handleLogout} style={{ fontSize: "18px", width: "180px" }}>
            <i className="bi bi-box-arrow-left"></i> Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="row mx-5">
        <div className="col-md-3">
          <h3>Cursos Ganados:</h3>
          <ul className="course-list">
            {
              winnedCourses.map((winnedCourse, index) => (
                <li key={index} className="course-item">
                  {winnedCourse.name} - Nota: {winnedCourse.grade}
                  <span
                    className="delete-icon"
                    onClick={() => handleCourseDeletion(winnedCourse.name)}
                  >
                    <i className="bi bi-trash"></i>
                  </span>
                </li>
              ))
            }
          </ul>

          <h3>Agregar Curso Ganado:</h3>
          <select
            className="form-select"
            id="coursesFormSelect"
            onChange={(e) => setNewCourse(e.target.value)}
          >
            <option value=""></option>
            {
              courses.map((course) => (
                <option key={`course-${course.id_curso}`} value={`${course.id_curso} ${course.nombre_curso}`}>{course.id_curso} {course.nombre_curso}</option>
              ))
            }
          </select>
          <input
            type="number"
            value={newGrade}
            onChange={(e) => setNewGrade(e.target.value)}
            placeholder="Calificación"
          />
          <button onClick={handleCourseAddition}>Agregar Curso</button>
        </div>

        <div className="col-md-9">
          <h2>Datos Personales</h2>
          <div className="profile-info">
            <img
              src="https://imagenes.elpais.com/resizer/v2/4UPKL26K5ZICHFC6UIAU5DDHWU.jpg?auth=393fdef15d621d403eec4dc5bc104e8ce874f3be8958f4d708d2ca856b646922&width=414" // Reemplaza con la URL de tu imagen
              alt="Foto de perfil"
              className="profile-pic"
            />
            <div className="profile-details">
              <p><strong>Nombre: </strong>{cookies.user.nombre_completo}</p>
              <p><strong>Carnet: </strong> {cookies.user.carnet}</p>
              <p><strong>Correo electrónico: </strong> {cookies.user.correo}</p>
              <p><strong>Facultad: </strong> {cookies.user.facultad}</p>
              <p><strong>Carrera: </strong> {cookies.user.carrera}</p>
            </div>
          </div>

          <div className="updated-courses">
            <h3 style={{ color: 'orange' }}>Nuevos cursos ganados:</h3>
            <ul>
              {
                winnedCourses.map((winnedCourse, index) => (
                  <li key={index}>
                    {winnedCourse.name} - Nota: {winnedCourse.grade}
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Profile;

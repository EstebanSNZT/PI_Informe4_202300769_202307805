import React, { useState, useEffect, Fragment } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import PieChartPostsLikes from './PieChartPostsLikes';
import PieChartPostsCategory from './PieChartPostsCategory';
import BarCharUsers from './BarChartUsers';

function Reports() {
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const navigate = useNavigate();

    useEffect(() => {

    }, []);

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
                    <h2 className="text-start" style={{ marginBottom: "2rem" }}>Reportes</h2>
                    <div className="card" style={{ marginBottom: "2rem" }}>
                        <div className="card-body">
                            <h3 className="text-center" style={{ marginBottom: "1rem" }}>Top 5 post con más likes</h3>
                            <div className='row align-items-center justify-content-center'>
                                <div className='col-auto'>
                                    {
                                        <PieChartPostsLikes />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card" style={{ marginBottom: "2rem" }}>
                        <div className="card-body">
                            <h3 className="text-center" style={{ marginBottom: "1rem" }}>Cantidad de posts por categorías</h3>
                            <div className='row align-items-center justify-content-center'>
                                <div className='col-auto'>
                                    {
                                        <PieChartPostsCategory />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card" style={{ marginBottom: "2rem" }}>
                        <div className="card-body">
                            <h3 className="text-center" style={{ marginBottom: "1rem" }}>Top 10 usuarios con más publicaciones creadas</h3>
                            <div className='row align-items-center justify-content-center'>
                                <div className='col-auto'>
                                    {
                                        <BarCharUsers />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment >
    );
}

export default Reports;
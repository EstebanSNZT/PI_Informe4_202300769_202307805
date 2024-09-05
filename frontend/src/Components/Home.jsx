import React, { useState, useEffect, useRef, Fragment, use } from 'react';
import './Styles/User.css';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Home() {
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const navigate = useNavigate();

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
                            <div style={{ color: "white", textDecoration: "none", fontSize: "18px" }}>
                                <i class="bi bi-plus-circle"></i> Crear Posts
                            </div>
                        </li>
                        <li style={{ color: "white", marginRight: "35px" }}>
                        </li>
                    </ul>
                </div>
                <div style={{ display: "flex", alignItems: "center", height: "10vh", width: "50%", top: 0, flexDirection: "row-reverse", paddingRight: "5%" }}>
                    <button className="btn btn-outline-info" onClick={handleLogout} style={{ fontSize: "18px" }}>
                        <i class="bi bi-box-arrow-left"></i> Cerrar Sesión
                    </button>
                </div>
            </div>
        </Fragment >
    );
}

export default Home;
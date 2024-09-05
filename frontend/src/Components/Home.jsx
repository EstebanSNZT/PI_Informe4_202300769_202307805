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

    const handleLogout = () => {
        removeCookie('user');
        navigate('/login')
    };

    return (
        <Fragment>
            
        </Fragment >
    );
}

export default Home;
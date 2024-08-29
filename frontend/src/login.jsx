import React, { useState } from 'react';
import usac1 from "./images/usac1.jpeg";

const Login = () => {
  const [carnet, setCarnet] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (carnet === '202307805' && password === 'password123') {
      alert('Login exitoso');
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={usac1} alt="LOGO" />
        <h2>INICIAR SESIÓN INGENIERÍA USAC</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="CUI / REGISTRO ACADÉMICO / REGISTRO PERSONAL"
            value={carnet}
            onChange={(e) => setCarnet(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          <div className="login-options">
            <input type="checkbox" id="remember-me" />
            <label htmlFor="remember-me">Recordar mi usuario</label>
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="login-button">INICIAR SESIÓN</button>
        </form>
        <a href="#" className="login-forgot-password">¿Olvidó su contraseña?</a>
      </div>
    </div>
  );
};

export default Login;

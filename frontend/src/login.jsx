import React, { useState } from 'react';
import usac1 from './images/usac1.jpeg';
 

const Login = () => {
  const [carnet, setCarnet] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      carnet: parseInt(carnet, 10),
      contrasena: password
    };

    fetch('http://localhost:5000/login', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success) {
          alert(res)
        } else {
          alert('Número de carnet y/o contraseña incorrectos.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setError('Hubo un problema con la solicitud. Por favor, inténtelo de nuevo.');
      });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={usac1} alt="LOGO" className="login-logo" />
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

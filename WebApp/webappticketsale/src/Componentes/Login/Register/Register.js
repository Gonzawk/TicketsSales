import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../../styles/General/Register.css'; // Archivo de estilos

function Register() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [nroCelular, setNroCelular] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    const userData = {
      Nombre: nombre,
      Correo: correo,
      NroCelular: nroCelular,
      Clave: clave,
      Rol: "User",
    };

    try {
      const response = await axios.post('https://localhost:5000/api/User/register', userData);

      if (response.status === 200) {
        setSuccess(true);
        setError('');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } catch (error) {
      setSuccess(false);
      const errorMessage = error.response && error.response.data
        ? error.response.data
        : 'Error al conectar con el servidor';
      setError(errorMessage);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Registrarse</h2>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">Usuario registrado con éxito!</p>}

        <form onSubmit={handleRegister} className="register-form">
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              autoComplete="name"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Correo:</label>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              autoComplete="email"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Número de celular:</label>
            <input
              type="text"
              placeholder="Número de celular"
              value={nroCelular}
              onChange={(e) => setNroCelular(e.target.value)}
              required
              autoComplete="tel"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              placeholder="Contraseña"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              required
              autoComplete="new-password"
              className="form-input"
            />
          </div>

          <button type="submit" className="submit-btn">
            Registrar
          </button>
        </form>

        <h5 className="login-link">
          ¿Ya estás registrado?{' '}
          <Link to="/login">Iniciar sesión</Link>
        </h5>
      </div>
    </div>
  );
}

export default Register;

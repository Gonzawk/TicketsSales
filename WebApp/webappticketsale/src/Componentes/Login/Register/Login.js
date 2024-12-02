import React, { useState } from 'react';
import axios from '../../../axiosConfig.js';  // Aquí importas la configuración personalizada de axios
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Context/AuthContext.js';
import '../../../styles/General/Login.css'; // Importamos el archivo CSS

function Login() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { handleLogin } = useAuth();

  const handleLoginClick = async (event) => {
    event.preventDefault();
    setError(''); // Reinicia el error al intentar iniciar sesión
    try {
      const response = await axios.post('https://localhost:5000/api/User/login', {
        EmailOrPhone: emailOrPhone,
        Clave: clave,
      });

      if (response.status === 200) {
        const token = response.data.token;
        handleLogin(token);
        navigate('/dashboard'); // Navega a la página de dashboard
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (error) {
      setError('Error al iniciar sesión');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Iniciar Sesión</h2>
      {error && <p className="login-error">{error}</p>}
      <form className="login-form" onSubmit={handleLoginClick}>
        <input
          type="text"
          className="login-input"
          placeholder="Email o Nro de Celular"
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
          required
        />
        <input
          type="password"
          className="login-input"
          placeholder="Contraseña"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          required
        />
        <button type="submit" className="login-button">Iniciar Sesión</button>
      </form>
      <p className="login-register">
        ¿No estás registrado?{' '}
        <a href="http://localhost:3000/register" className="register-link">Registrarse</a>
      </p>
    </div>
  );
  
}

export default Login;

import React, { useState } from 'react';
import axios from 'axios';
import BackButton from '../General/BackButton';
import '../../styles/Admin/AdminUserRegisteer.css';


const AdminUserRegister = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [nroCelular, setNroCelular] = useState('');
  const [clave, setClave] = useState('');
  const [rol, setRol] = useState('User');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { nombre, correo, nroCelular, clave, rol };
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No hay token de autenticación.');
      return;
    }

    try {
      await axios.post('https://localhost:5000/api/User/register/admin', userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(true);
      setError('');
      setNombre('');
      setCorreo('');
      setNroCelular('');
      setClave('');
      setRol('User');
    } catch (err) {
      setSuccess(false);
      setError(err.response?.data?.message || 'Error al registrar el usuario.');
    }
  };

  return (
    <div className="admin-user-register-container">
      <div className="register-card">
        <h2>Registrar Usuario por Admin</h2>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">Usuario registrado con éxito!</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre:</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Correo:</label>
            <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Número de celular:</label>
            <input type="text" value={nroCelular} onChange={(e) => setNroCelular(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input type="password" value={clave} onChange={(e) => setClave(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Rol:</label>
            <select value={rol} onChange={(e) => setRol(e.target.value)}>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="submit-btn">Registrar Usuario</button>
        </form>
      </div>
      <BackButton />
    </div>
  );
};

export default AdminUserRegister;

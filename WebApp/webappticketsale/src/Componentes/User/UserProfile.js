import React, { useState, useEffect } from 'react';
import '../../styles/User/UserProfile.css'; // Importamos los estilos

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [nroCelular, setNroCelular] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token no encontrado');
        }

        const response = await fetch('https://localhost:5000/api/User/me', { // Actualiza con tu endpoint válido
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Error al cargar los datos del usuario.');

        const data = await response.json();
        setUserData(data);
        setNombre(data.nombre);
        setCorreo(data.correo);
        setNroCelular(data.nroCelular);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://localhost:5000/api/User/me', { // Actualiza con tu endpoint válido
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre, correo, nroCelular }),
      });

      if (!response.ok) throw new Error('Error al actualizar los datos del usuario.');

      const updatedData = await response.json();
      setUserData(updatedData);
      setEditing(false);
      alert('Datos actualizados con éxito.');
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <p className="loading">Cargando...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="user-profile">
      <h2>Mi Perfil</h2>
      {editing ? (
        <div className="edit-form">
          <label>
            Nombre:
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </label>
          <label>
            Correo:
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </label>
          <label>
            Número de Celular:
            <input
              type="tel"
              value={nroCelular}
              onChange={(e) => setNroCelular(e.target.value)}
              required
            />
          </label>
          <div className="form-actions">
            <button onClick={handleUpdate} className="btn-save">
              Guardar Cambios
            </button>
            <button onClick={() => setEditing(false)} className="btn-cancel">
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="user-details">
          <p><strong>Nombre:</strong> {userData.nombre}</p>
          <p><strong>Correo:</strong> {userData.correo}</p>
          <p><strong>Número de Celular:</strong> {userData.nroCelular}</p>
          <button onClick={() => setEditing(true)} className="btn-edit">
            Editar
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;

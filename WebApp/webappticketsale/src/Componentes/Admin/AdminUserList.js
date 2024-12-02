import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import BackButton from '../General/BackButton';
import '../../styles/Admin/AdminUserList.css'; // Archivo CSS específico para este componente

const AdminUserList = ({ withConfirmation = true }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
      return 'Fecha inválida';
    }
    return format(date, 'dd/MM/yyyy');
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No estás autorizado para ver esta página.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://localhost:5000/api/User', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (err) {
        setError('Error al cargar los usuarios.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (usuarioId) => {
    if (withConfirmation && !window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No estás autorizado para eliminar usuarios.');
      return;
    }

    try {
      await axios.delete(`https://localhost:7101/api/User/${usuarioId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter(user => user.UsuarioId !== usuarioId));
    } catch (err) {
      setError('Error al eliminar el usuario.');
      console.error(err);
    }
  };

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="admin-user-list-container">
      <h2>Lista de Usuarios</h2>

      {error && <p className="error-message">{error}</p>}

      <div className="user-list-card">
        <table className="user-list-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Celular</th>
              <th>Fecha Registro</th>
              <th>Estado</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.usuarioId}>
                <td>{user.nombre}</td>
                <td>{user.correo}</td>
                <td>{user.nroCelular}</td>
                <td>{formatDate(user.FechaRegistro)}</td>
                <td>{user.estado}</td>
                <td>{user.rol}</td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(user.UsuarioId)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <BackButton />
    </div>
  );
};

export default AdminUserList;

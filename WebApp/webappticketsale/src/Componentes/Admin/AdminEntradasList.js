// src/components/AdminEntradasList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import BackButton from '../General/BackButton';
import '../../styles/Admin/AdminEntradasList.css';

const AdminEntradasList = () => {
  const [entradas, setEntradas] = useState([]);
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
    const fetchEntradas = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No estás autorizado para ver esta página.');
        setIsLoading(false);
        return;
      }

      try {
        // Verificar si el token es válido antes de enviar la solicitud
        const response = await axios.get('https://localhost:5000/api/entradas/admin/listar', {
          headers: {
            Authorization: `Bearer ${token}`, // Asegúrate de que el token esté siendo enviado correctamente
          },
        });
        
        // Si la respuesta es exitosa, asignar los datos a las entradas
        setEntradas(response.data);
      } catch (err) {
        // Manejo del error
        if (err.response && err.response.status === 403) {
          setError('No tienes permisos para acceder a esta página. Verifica tu rol de administrador.');
        } else {
          setError('Error al cargar las entradas.');
        }
        console.error('Error en la solicitud:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntradas();
  }, []);

  if (isLoading) {
    return <p className="loading">Cargando...</p>;
  }

  return (
    <div className="admin-entradas-container">
      <div className="list-card">
        <h2 className="title">Lista de Entradas</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="table-wrapper">
          <table className="styled-table">
            <thead>
              <tr>
              <th>ID Entrada</th>
                <th>Evento</th>
                <th>Usuario</th>
                <th>Fecha Creación</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {entradas.map((entrada) => (
                <tr key={entrada.entradaId}>
                  <td>{entrada.entradaId}</td>
                  <td>{entrada.eventoNombre}</td>
                  <td>{entrada.usuarioNombre}</td>
                  <td>{formatDate(entrada.fechaCreacion)}</td>
                  <td>{entrada.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <BackButton />
    </div>
  );
};

export default AdminEntradasList;

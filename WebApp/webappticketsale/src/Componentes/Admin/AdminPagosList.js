import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from '../General/BackButton';
import '../../styles/Admin/AdminPagosList.css';

const AdminPagosList = () => {
  const [pagos, setPagos] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPagos = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No estás autorizado para ver esta página.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://localhost:5000/api/Pagos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPagos(response.data);
      } catch (err) {
        setError('Error al cargar los pagos.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPagos();
  }, []);

  if (isLoading) {
    return <p className="loading">Cargando...</p>;
  }

  return (
    <div className="admin-pagos-container">
      <div className="pagos-card">
        <h2>Lista de Pagos</h2>

        {error && <p className="error">{error}</p>}

        <table className="pagos-table">
          <thead>
            <tr>
              <th>ID Pago</th>
              <th>ID Usuario</th>
              <th>Nombre Usuario</th>
              <th>ID Evento</th>
              <th>Nombre Evento</th>
              <th>ID Entrada</th>
              <th>Monto</th>
              <th>Método de Pago</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((pago) => (
              <tr key={pago.pagoId}>
                <td>{pago.pagoId}</td>
                <td>{pago.usuarioId}</td>
                <td>{pago.usuarioNombre || 'N/A'}</td> {/* Mostrar Nombre de Usuario */}
                <td>{pago.eventoId}</td>
                <td>{pago.eventoNombre || 'N/A'}</td> {/* Mostrar Nombre del Evento */}
                <td>{pago.entradaId || 'N/A'}</td>
                <td>{pago.monto}</td>
                <td>{pago.metodoPago}</td>
                <td>{pago.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <BackButton />
    </div>
  );
};

export default AdminPagosList;

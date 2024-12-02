import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from '../General/BackButton';
/* import '../styles/UserPagos.css'; */

const UserPagos = () => {
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
        const response = await axios.get('https://localhost:5000/api/Pagos/user/mis-pagos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPagos(response.data);
      } catch (err) {
        setError('Error al cargar los pagos o no tienes pagos registrados.');
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
    <div className="user-pagos-container">
      <div className="pagos-card">
        <h2>Mis Pagos</h2>

        {error && <p className="error">{error}</p>}

        {pagos.length > 0 ? (
          <table className="pagos-table">
            <thead>
              <tr>
                <th>ID Pago</th>
                <th>Evento</th>
                <th>Monto</th>
                <th>Método de Pago</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map((pago) => (
                <tr key={pago.pagoId}>
                  <td>{pago.pagoId}</td>
                  <td>{pago.eventoNombre || 'Evento no asignado'}</td>
                  <td>{pago.monto}</td>
                  <td>{pago.metodoPago}</td>
                  <td>{pago.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-pagos">No tienes pagos registrados.</p>
        )}
      </div>
      <BackButton />
    </div>
  );
};

export default UserPagos;

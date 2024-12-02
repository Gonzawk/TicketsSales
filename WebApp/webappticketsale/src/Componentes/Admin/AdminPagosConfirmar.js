import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from '../General/BackButton';
import '../../styles/Admin/AdminPagosConfirmar.css'; // Importamos el CSS para este componente

const AdminPagosConfirmar = () => {
  const [pagosPendientes, setPagosPendientes] = useState([]); // Aseguramos que sea un array
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Indicador de carga

  useEffect(() => {
    const fetchPagosPendientes = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No estás autorizado para ver esta página.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://localhost:5000/api/Pagos/pendientes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Validar que la respuesta sea un array antes de actualizar el estado
        if (Array.isArray(response.data)) {
          setPagosPendientes(response.data);
        } else {
          throw new Error('La respuesta de la API no es un array.');
        }
      } catch (err) {
        setError('Error al cargar los pagos pendientes.');
        console.error('Error al cargar los pagos:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPagosPendientes();
  }, []);

  const handleConfirmarPago = async (pagoId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No estás autorizado para confirmar pagos.');
      return;
    }

    try {
      await axios.post('https://localhost:5000/api/Pagos/confirmar-pago', { PagoId: pagoId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Actualizar la lista después de la confirmación
      setPagosPendientes(pagosPendientes.filter(pago => pago.pagoId !== pagoId));
      alert('Pago confirmado con éxito.');
    } catch (err) {
      setError('Error al confirmar el pago.');
      console.error('Error al confirmar el pago:', err);
    }
  };

  // Función para manejar la cancelación de pago
  const handleCancelarPago = async (pagoId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No estás autorizado para cancelar pagos.');
      return;
    }

    try {
      await axios.post('https://localhost:5000/api/Pagos/cancelar-pago', { PagoId: pagoId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Actualizar la lista después de la cancelación
      setPagosPendientes(pagosPendientes.filter(pago => pago.pagoId !== pagoId));
      alert('Pago cancelado con éxito.');
    } catch (err) {
      setError('Error al cancelar el pago.');
      console.error('Error al cancelar el pago:', err);
    }
  };

  if (isLoading) {
    return <p className="loading">Cargando...</p>;
  }

  return (
    <div className="admin-pagos-container">
      <div className="pagos-card">
        <h2>Pagos Pendientes</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="table-wrapper">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Pago ID</th>
                <th>Usuario ID</th>
                <th>Nombre de Usuario</th>
                <th>Evento</th>
                <th>Monto</th>
                <th>Método de Pago</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(pagosPendientes) && pagosPendientes.length > 0 ? (
                pagosPendientes.map((pago) => (
                  <tr key={pago.pagoId}>
                    <td>{pago.pagoId}</td>
                    <td>{pago.usuarioId}</td>
                    <td>{pago.usuarioNombre}</td>
                    <td>{pago.eventoNombre}</td>
                    <td>{pago.monto}</td>
                    <td>{pago.metodoPago}</td>
                    <td>{pago.estado}</td>
                    <td>
                      <button className="confirm-btn" onClick={() => handleConfirmarPago(pago.pagoId)}>Confirmar Pago</button>
                      <button className="cancel-btn" onClick={() => handleCancelarPago(pago.pagoId)}>Cancelar Pago</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-data">No hay pagos pendientes.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <BackButton />
      </div>
    </div>
  );
};

export default AdminPagosConfirmar;

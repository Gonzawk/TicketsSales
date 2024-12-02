import React, { useState } from 'react';
import '../../styles/Admin/AdminPagosDetalles.css';
import axios from 'axios';

const AdminPagosDetalles = () => {
  const [pagoId, setPagoId] = useState('');
  const [pago, setPago] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Indicador de carga

  const buscarPago = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No estás autorizado.');
      return;
    }

    // Limpiamos los datos de la entrada y el error antes de hacer la nueva búsqueda
    setPago(null); // Limpiamos los datos del pago anterior
    setError(''); // Limpiamos cualquier error previo
    setIsLoading(true); // Iniciamos la carga

    try {
      const response = await axios.get(`https://localhost:5000/api/Pagos/${pagoId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Asegúrate de enviar el token correctamente
        },
      });
      setPago(response.data); // Establece los nuevos datos del pago
    } catch (err) {
      setError('Error al buscar el pago.');
      console.error(err);
    } finally {
      setIsLoading(false); // Finaliza el indicador de carga
    }
  };

  return (
    <div className="detalles-container">
      <h2 className="detalles-title">Detalles del Pago</h2>
      <div className="detalles-search">
        <input
          type="number"
          className="detalles-input"
          placeholder="ID del Pago"
          value={pagoId}
          onChange={(e) => setPagoId(e.target.value)}
        />
        <button className="detalles-button" onClick={buscarPago}>Buscar</button>
      </div>
      
      {isLoading && <p className="loading">Cargando...</p>} {/* Mensaje de carga */}

      {error && <p className="detalles-error">{error}</p>} {/* Mostrar el mensaje de error */}

      {pago && !isLoading && (  // Solo mostramos los detalles si no estamos cargando
        <div className="detalles-card">
          <p><strong>ID Pago:</strong> {pago.pagoId}</p>
          <p><strong>ID Usuario:</strong> {pago.usuarioId}</p>
          <p><strong>ID Evento:</strong> {pago.eventoId}</p>
          <p><strong>ID Entrada:</strong> {pago.entradaId ? pago.entradaId : 'Pendiente'}</p>
          <p><strong>Monto:</strong> ${pago.monto}</p>
          <p><strong>Método de Pago:</strong> {pago.metodoPago}</p>
          <p><strong>Estado:</strong> {pago.estado}</p>
        </div>
      )}
    </div>
  );
};

export default AdminPagosDetalles;

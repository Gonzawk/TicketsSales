// src/components/UserEntradaDetalles.js
import React, { useState } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react'; // Generador de códigos QR
import '../../styles/User/UserEntradaDetalles.css';

const UserEntradaDetalles = () => {
  const [entradaId, setEntradaId] = useState('');
  const [entrada, setEntrada] = useState(null);
  const [error, setError] = useState('');

  const buscarEntrada = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No estás autorizado.');
      return;
    }

    try {
      const response = await axios.get(
        `https://localhost:5000/api/Entradas/entradas/${entradaId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setEntrada(response.data);
        setError('');
      } else {
        setError('Entrada no encontrada.');
      }
    } catch (err) {
      setError('Error al buscar la entrada.');
      console.error(err);
    }
  };

  return (
    <div className="details-container">
      <h2>Detalles de la Entrada</h2>
      <div className="search-bar">
        <input
          type="number"
          placeholder="ID de la Entrada"
          value={entradaId}
          onChange={(e) => setEntradaId(e.target.value)}
        />
        <button onClick={buscarEntrada}>Buscar</button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {entrada && (
        <div className="entry-details">
          <p>
            <strong>ID Entrada:</strong> {entrada.entradaId}
          </p>
          <p>
            <strong>Evento:</strong> {entrada.eventoNombre}
          </p>
          <p>
            <strong>Estado:</strong> {entrada.estado}
          </p>
          <p>
            <strong>Fecha Creación:</strong>{' '}
            {new Date(entrada.fechaCreacion).toLocaleString()}
          </p>
          <div className="qr-container">
            <h3>Código QR de la Entrada</h3>
            {entrada.codigoQR ? (
              // Utiliza el código QR directamente desde la API
              <QRCodeSVG value={entrada.codigoQR} />
            ) : (
              <p>No hay código QR disponible.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserEntradaDetalles;

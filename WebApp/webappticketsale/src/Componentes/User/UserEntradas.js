// src/components/UserEntrada.js
import React, { useState, useEffect } from 'react';
import { getMisEntradas } from '../../Services/ticketService.js';
import '../../styles/User/UserEntrada.css';

const UserEntrada = () => {
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntradas = async () => {
      const token = localStorage.getItem('token'); // Obtener token desde localStorage
      if (!token) {
        setError('No estás autorizado. Inicia sesión.');
        setLoading(false);
        return;
      }

      try {
        const data = await getMisEntradas(token); // Solicita entradas desde la API
        if (data && Array.isArray(data)) {
          setEntradas(data);
        } else {
          setError('No se encontraron entradas.');
        }
      } catch (err) {
        setError('Error al cargar las entradas. Intenta nuevamente más tarde.');
        console.error('Error:', err);
      } finally {
        setLoading(false); // Detener el estado de carga
      }
    };

    fetchEntradas();
  }, []);

  return (
    <div className="user-entradas-container">
      {loading && <p className="loading-message">Cargando entradas...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="entradas-content">
        <h2>Tus Entradas</h2>
        {entradas.length === 0 && !loading && !error ? (
          <p className="no-entradas-message">No tienes entradas registradas.</p>
        ) : (
          <ul className="entradas-list">
            {entradas.map((entrada) => (
              <li key={entrada.entradaId} className="entrada-item">
                <div className="entrada-info">
                  <p>
                  <strong>ID Entrada:</strong> {entrada.entradaId || 'Desconocido'} <br />
                    <strong>Evento:</strong> {entrada.eventoNombre || 'Desconocido'} <br />
                    <strong>Estado:</strong> {entrada.estado || 'Sin estado'} <br />
                    <strong>Fecha de Creación:</strong> {entrada.fechaCreacion ? new Date(entrada.fechaCreacion).toLocaleString() : 'Desconocida'}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserEntrada;

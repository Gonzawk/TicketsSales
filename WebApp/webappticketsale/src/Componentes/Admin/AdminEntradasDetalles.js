import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Admin/AdminEntradasDetalles.css'; // Importamos los estilos para este componente

const AdminEntradasDetalles = () => {
  const [entradaId, setEntradaId] = useState('');
  const [entrada, setEntrada] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Indicador de carga

  const buscarEntrada = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No estás autorizado.');
      return;
    }

    // Limpiamos los datos de la entrada y el error antes de hacer la nueva búsqueda
    setEntrada(null);
    setError('');
    setIsLoading(true); // Iniciamos la carga

    try {
      // Corregimos la URL para que funcione correctamente el template string
      const response = await axios.get(`https://localhost:5000/api/Entradas/admin/detalles/${entradaId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Corregimos la forma de pasar el token en los headers
        },
      });
      setEntrada(response.data);
    } catch (err) {
      setError('Error al buscar la entrada.');
      console.error(err);
    } finally {
      setIsLoading(false); // Finaliza el indicador de carga
    }
  };

  return (
    <div className="admin-entradas-container">
      <div className="entradas-card">
        <h2>Detalles de la Entrada</h2>

        <div className="search-section">
          <input
            type="number"
            placeholder="ID de la Entrada"
            value={entradaId}
            onChange={(e) => setEntradaId(e.target.value)}
            className="entrada-input"
          />
          <button className="search-btn" onClick={buscarEntrada}>
            Buscar
          </button>
        </div>

        {isLoading && <p className="loading">Cargando...</p>}

        {error && <p className="error-message">{error}</p>}

        {entrada && !isLoading && (
          <div className="entrada-details">
            <p><strong>ID Entrada:</strong> {entrada.entradaId}</p>
            <p><strong>Nombre del Evento:</strong> {entrada.eventoNombre}</p>
            <p><strong>Usuario:</strong> {entrada.usuarioNombre}</p>
            <p><strong>Fecha de Creación:</strong> {new Date(entrada.fechaCreacion).toLocaleString()}</p>
            <p><strong>Estado:</strong> {entrada.estado}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEntradasDetalles;

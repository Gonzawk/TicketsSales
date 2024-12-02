import React, { useState } from "react";
import axios from "axios";
import "../../styles/User/UserEventBuscar.css";  // Asegúrate de agregar un archivo de estilo específico

const UserEventBuscar = () => {
  const [nombre, setNombre] = useState("");
  const [lugar, setLugar] = useState("");
  const [fecha, setFecha] = useState("");
  const [eventos, setEventos] = useState([]);
  const [error, setError] = useState("");

  const buscarEventos = async () => {
    try {
      setError(""); // Limpiar errores previos
      const params = {};

      // Solo agregar parámetros si no están vacíos
      if (nombre) params.nombre = nombre;
      if (lugar) params.lugar = lugar;
      if (fecha) params.fecha = fecha;

      // Obtener el token desde localStorage o cualquier otro almacenamiento seguro
      const token = localStorage.getItem("token");  // O el almacenamiento que estés utilizando para guardar el token

      // Verificar si el token está presente
      if (!token) {
        setError("No estás autenticado. Por favor, inicia sesión.");
        return;
      }

      // Realizamos la solicitud al backend con el token en las cabeceras
      const response = await axios.get("https://localhost:5000/api/evento/buscar", {
        params,
        headers: {
          Authorization: `Bearer ${token}`, // Enviar el token en la cabecera Authorization
        },
      });
      setEventos(response.data); // Guardamos los eventos en el estado
    } catch (err) {
      setError("Error al buscar eventos. Verifica los datos.");
      console.error(err);
    }
  };

  return (
    <div className="eventos-container">
      <h2 className="eventos-title">Buscar Eventos</h2>
      <div className="search-form">
        <div className="input-group">
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="input-group">
          <label>Ubicación:</label>
          <input
            type="text"
            value={lugar}
            onChange={(e) => setLugar(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="input-group">
          <label>Fecha:</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="search-input"
          />
        </div>
        <button onClick={buscarEventos} className="search-button">Buscar</button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <h3 className="results-title">Resultados:</h3>
      {eventos.length > 0 ? (
        <div className="eventos-grid">
          {eventos.map((evento, index) => (
            <div className="evento-card" key={index}>
              <h4>{evento.nombre}</h4>
              <p><strong>Lugar:</strong> {evento.ubicacion}</p>
              <p><strong>Fecha:</strong> {new Date(evento.fecha).toLocaleDateString()}</p>
              <p><strong>Precio:</strong> ${evento.precio}</p>
              <p><strong>Entradas Disponibles:</strong> {evento.entradasDisponibles || 0}</p>
              <p><strong>Descripción:</strong> {evento.descripcion}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No se encontraron eventos.</p>
      )}
    </div>
  );
};

export default UserEventBuscar;

import React, { useState } from 'react';
import '../../styles/Admin/AdminEventRegister.css'; // Importamos el archivo CSS

const AdminEventRegister = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [precio, setPrecio] = useState('');
  const [entradasDisponibles, setEntradasDisponibles] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // Obtener el JWT desde el localStorage

    const nuevoEvento = {
      nombre,
      descripcion,
      fecha,
      ubicacion,
      precio,
      entradasDisponibles,
      estado: 'Activo', // Asignar un estado por defecto
    };

    try {
      const response = await fetch('https://localhost:5000/api/Evento/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Incluir el JWT en las cabeceras
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoEvento), // Enviar los datos del nuevo evento
      });

      if (!response.ok) {
        throw new Error('Error al registrar el evento');
      }

      setSuccess(true);
      setNombre('');
      setDescripcion('');
      setFecha('');
      setUbicacion('');
      setPrecio('');
      setEntradasDisponibles('');
      setError(null);
    } catch (error) {
      setError(error.message);
      setSuccess(false);
    }
  };

  return (
    <div className="event-register-container">
      <h2 className="event-register-title">Registrar Evento</h2>
      {error && <p className="event-register-error">Error: {error}</p>}
      {success && <p className="event-register-success">Evento registrado con éxito!</p>}
      <form className="event-register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="descripcion">Descripción:</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="fecha">Fecha:</label>
          <input
            type="date"
            id="fecha"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="ubicacion">Ubicación:</label>
          <input
            type="text"
            id="ubicacion"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="precio">Precio:</label>
          <input
            type="number"
            id="precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="entradasDisponibles">Entradas Disponibles:</label>
          <input
            type="number"
            id="entradasDisponibles"
            value={entradasDisponibles}
            onChange={(e) => setEntradasDisponibles(e.target.value)}
            required
          />
        </div>
        <button className="event-register-button" type="submit">Registrar Evento</button>
      </form>
    </div>
  );
};

export default AdminEventRegister;

import React, { useState, useEffect } from 'react';
/* import { useNavigate } from 'react-router-dom'; // Importamos useNavigate de React Router v6 */
import '../../styles/General/Events.css'

const Eventos = () => {
  const [eventos, setEventos] = useState([]);  // Estado para los eventos
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null);  // Estado de error

 /*  const navigate = useNavigate();  // Usamos useNavigate para redirigir */

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const token = localStorage.getItem('token'); // Asumiendo que el token JWT está almacenado en localStorage con la clave 'jwt'
        if (!token) {
          throw new Error('Token no encontrado');
        }

        const response = await fetch('https://localhost:5000/api/Evento', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Incluyendo el JWT en el encabezado
            'Accept': 'application/json', // Asegurándose de aceptar JSON como respuesta
          },
        });

        if (!response.ok) throw new Error('Error al cargar los eventos.');

        const data = await response.json();
        setEventos(data);
        setLoading(false); // Cambiar el estado de carga a falso cuando se recibe la respuesta
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

/*   const handleCompra = (eventoId) => {
    // Redirigir al usuario a la página de compra con el id del evento
    navigate(`/comprar/${eventoId}`); // Usamos navigate para redirigir
  };
 */
  if (loading) return <p>Cargando eventos...</p>; // Muestra un mensaje mientras se cargan los eventos
  if (error) return <p>Error: {error}</p>; // Muestra un mensaje de error si ocurre un error

  return (
    <div>
      <h3>Eventos Disponibles</h3>
      {eventos.length === 0 ? (
        <p>No hay eventos disponibles.</p> // Si no hay eventos, muestra un mensaje
      ) : (
        <div className="eventos-grid">
          {eventos.map((evento) => (
            <div className="evento-card" key={evento.eventoId}>  {/* Cambié 'id' a 'eventoId' para que coincida con el ejemplo */}
              <h4>{evento.nombre}</h4>
              <p>{evento.descripcion}</p>
              <p><strong>Fecha:</strong> {new Date(evento.fecha).toLocaleDateString()}</p>
              <p>Lugar: {evento.ubicacion}</p>
              <p>Disponibles: {evento.entradasDisponibles} entradas</p>
              {/* <button onClick={() => handleCompra(evento.eventoId)}>Comprar Entrada</button> */}  {/* Cambié 'id' a 'eventoId' */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Eventos;

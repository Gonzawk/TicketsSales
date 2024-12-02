import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../../styles/General/Events.css';

const Eventos = () => {
  const [eventos, setEventos] = useState([]); // Lista de eventos
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error
  const [metodoPago, setMetodoPago] = useState(''); // Método de pago seleccionado
  const [monto, setMonto] = useState(0); // Monto de la entrada (será único por evento)

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token no encontrado');

        const response = await fetch('https://localhost:5000/api/Evento', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Error al cargar los eventos');

        const data = await response.json();
        console.log(data);

        // Asegúrate de que la respuesta sea un arreglo
        const eventosData = Array.isArray(data) ? data : data?.$values || [];
        setEventos(eventosData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  // Maneja la compra de entradas
  const handleCompra = async (eventoId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token no encontrado');
      return;
    }

    if (!metodoPago) {
      alert('Por favor, selecciona un método de pago');
      return;
    }

    if (monto <= 0) {
      alert('El monto de la entrada no es válido');
      return;
    }

    console.log('Precio de la entrada:', monto); // Verifica el precio de la entrada en consola

    try {
      // Decodifica el token para obtener el userId
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.UserId;

      if (!userId) {
        alert('No se pudo obtener el userId del token');
        return;
      }

      setLoading(true);

      const response = await fetch(`https://localhost:5000/api/entradas/user/comprar/${eventoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          monto: monto, // El monto de la entrada
          metodoPago: metodoPago, // Método de pago seleccionado
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'No se pudo completar la compra');
      }

      const data = await response.json();
      alert(`¡Compra exitosa! Entrada ID: ${data.EntradaId}`);
    } catch (error) {
      alert(error.message || 'Error al procesar la compra');
    } finally {
      setLoading(false);
    }
  };

  // Manejo del cambio en la selección del método de pago
  const handleMetodoPagoChange = (e) => {
    setMetodoPago(e.target.value);
  };

  // Cargar el monto del evento al hacer clic
  const handleSeleccionarEvento = (evento) => {
    console.log('Evento seleccionado:', evento); // Verifica el evento seleccionado
    setMonto(evento.precio); // Asegúrate de que el monto se asigne correctamente
    setMetodoPago(''); // Limpiar el método de pago cuando seleccionas un nuevo evento
  };

  useEffect(() => {
    console.log('Monto de la entrada:', monto); // Verifica si el monto se asigna correctamente
  }, [monto]);

  if (loading) return <p>Cargando eventos...</p>;
  if (error) return <p>Error: {error}</p>;

  if (!Array.isArray(eventos) || eventos.length === 0) {
    return <p>No hay eventos disponibles.</p>;
  }

  return (
    <div className="eventos-container">
      <h3 className="eventos-title">Eventos Disponibles</h3>
      <div className="eventos-grid">
        {eventos.map((evento) => (
          <div
            className="evento-card"
            key={evento.eventoId}
            onClick={() => handleSeleccionarEvento(evento)}
          >
            <h4 className="evento-name">{evento.nombre}</h4>
            <p className="evento-description">{evento.descripcion}</p>
            <p><strong>Fecha:</strong> {new Date(evento.fecha).toLocaleDateString()}</p>
            <p>Lugar: {evento.ubicacion}</p>
            <p>Disponibles: {evento.entradasDisponibles} entradas</p>
            <p><strong>Monto:</strong> ${evento.precio}</p>
            <button className="buy-button" onClick={() => handleCompra(evento.eventoId)}>
              Comprar Entrada
            </button>
          </div>
        ))}
      </div>

      {/* Solo muestra la sección del método de pago si el monto es mayor que 0 */}
      {monto > 0 && (
        <div className="metodo-pago-container">
          <h4>Selecciona el Método de Pago</h4>
          <select value={metodoPago} onChange={handleMetodoPagoChange}>
            <option value="">Seleccione un método de pago</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Transferencia">Transferencia</option>
            <option value="Tarjeta">Tarjeta</option>
          </select>
          {metodoPago === '' && <div className="error">Por favor, selecciona un método de pago.</div>}
        </div>
      )}
    </div>
  );
};

export default Eventos;

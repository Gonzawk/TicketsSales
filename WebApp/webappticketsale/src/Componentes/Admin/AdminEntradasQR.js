import React, { useState } from 'react';
import axios from 'axios';
import QrScanner from 'react-qr-scanner';
import '../../styles/Admin/AdminEntradasQR.css';

const AdminEntradasQR = () => {
  const [lectorActivo, setLectorActivo] = useState(true);
  const [codigoQr, setCodigoQr] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [mensajeColor, setMensajeColor] = useState('');
  const [loading, setLoading] = useState(false);

  const manejarCodigoQr = async (codigo) => {
    if (!codigo) return;
  
    console.log('Código QR escaneado:', codigo); // Verifica el código escaneado
    setCodigoQr(codigo);
    setLoading(true);
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMensaje('No estás autorizado. Token faltante.');
        setMensajeColor('red');
        setLoading(false);
        return;
      }
  
      const response = await axios.post(
        `https://localhost:5000/api/entradas/admin/confirmar-uso/${codigo}`,
        {}, // Enviar datos vacíos si la API no requiere cuerpo
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Verificar si la respuesta contiene el mensaje de éxito
      if (response.status === 200) {
        if (response.data.mensaje) {
          setMensaje(response.data.mensaje);
          setMensajeColor('green'); // Mensaje de éxito
        } else if (response.data.error) {
          setMensaje(response.data.error);
          setMensajeColor('red'); // Mensaje de error
        }
        setLectorActivo(false); // Desactiva el lector después de un escaneo exitoso
      } else {
        setMensaje('No se pudo confirmar el uso de la entrada.');
        setMensajeColor('red');
      }
    } catch (error) {
      const status = error.response?.status;
      let errorMsg = 'Error al confirmar el uso de la entrada.';
  
      if (status === 403) {
        errorMsg = 'Acceso denegado: No tienes permisos para realizar esta acción.';
      } else if (status === 401) {
        errorMsg = 'No estás autenticado. Por favor, inicia sesión.';
      }
  
      console.error('Error en la solicitud:', error.response || error.message);
      setMensaje(errorMsg);
      setMensajeColor('red');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="admin-entrada-qr">
      <h2>Admin - Activar Lector QR</h2>

      <div className="lector-qr-header">
        <button disabled={loading} onClick={() => setLectorActivo(true)}>
          Activar Lector QR
        </button>
        <button
          disabled={loading}
          onClick={() => setLectorActivo(false)} // Agregar opción para desactivar el lector
        >
          Desactivar Lector QR
        </button>
      </div>

      <div className="lector-qr-container">
        {lectorActivo && (
          <QrScanner
            delay={300}
            style={{ width: '100%' }}
            onScan={(result) => {
              if (result?.text) {
                manejarCodigoQr(result.text);
              }
            }}
            onError={(err) => {
              console.error('Error al escanear el QR:', err);
              setMensaje('Error al escanear el código QR.');
              setMensajeColor('red');
            }}
          />
        )}
      </div>

      {mensaje && (
        <div className={`mensaje ${mensajeColor}`}>
          <p>{mensaje}</p>
        </div>
      )}

      {loading && <p>Cargando...</p>}
    </div>
  );
};

export default AdminEntradasQR;

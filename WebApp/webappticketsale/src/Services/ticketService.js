// src/Services/ticketService.js
import axios from 'axios';

export const getMisEntradas = async (token) => {
  try {
    const response = await axios.get('https://localhost:5000/api/entradas/user/mis-entradas', {
      headers: {
        Authorization: `Bearer ${token}`, // Pasamos el token de autorización en los encabezados
      },
    });
    return response.data; // Suponiendo que la respuesta tiene los datos en `response.data`
  } catch (error) {
    console.error('Error fetching entradas:', error);
    throw error; // Lanzamos el error para que se maneje en el componente
  }
};

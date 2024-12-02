// src/axiosConfig.js
import axios from 'axios';

// Configuración global de axios para deshabilitar la validación SSL
axios.defaults.baseURL = 'https://localhost:5001'; // Dirección de tu API (ajusta la URL según tu entorno)
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Configuración para ignorar el certificado SSL solo en desarrollo
axios.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      // Ignora el error de certificado SSL solo en desarrollo
      config.rejectUnauthorized = false;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;

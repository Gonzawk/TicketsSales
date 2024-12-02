// src/components/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom'; // Importa Link para las rutas

function HomePage() {
  return (
    <div>
      <h2>Bienvenido a la página principal</h2>

      {/* Botones de navegación */}
      <div>
        <Link to="/login">
          <button>Iniciar Sesión</button>
        </Link>
        <Link to="/register">
          <button>Registrarse</button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;

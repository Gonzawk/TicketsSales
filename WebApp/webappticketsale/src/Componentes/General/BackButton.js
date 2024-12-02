// src/Componentes/BackButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Regresar a la página anterior
  };

  return (
    <button onClick={handleBackClick} style={{ padding: '10px 20px', backgroundColor: '#f44336', color: '#fff', border: 'none', borderRadius: '5px' }}>
      Volver Atrás
    </button>
  );
};

export default BackButton;

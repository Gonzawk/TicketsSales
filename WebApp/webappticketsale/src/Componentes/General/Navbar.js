// src/components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext'; // Importa el hook de autenticación

import '../../styles/General/NavBar.css';

const NavBar = () => {
  const { userRole, handleLogout } = useAuth(); // Usa el contexto de autenticación

  return (
    <nav className="navbar">
      <ul>
        <li>Inicio</li>

        {/* Opciones solo visibles para Admin */}
        {userRole === 'Admin' && (
          <>
            <li className="dropdown">
              <button className="dropdown-btn">Usuarios</button>
              <div className="dropdown-content">
                <Link to="/admin-dashboard/admin-users">Listar Usuarios</Link>
                <Link to="/admin-dashboard/admin-register">Registrar Usuario</Link>
              </div>
            </li>
            <li className="dropdown">
              <button className="dropdown-btn">Eventos</button>
              <div className="dropdown-content">
                <Link to="/admin-dashboard/admin-events">Ver Eventos</Link>
                <Link to="/admin-dashboard/admin-event-register">Registrar Evento</Link>
              </div>
            </li>
            <li className="dropdown">
              <button className="dropdown-btn">Entradas</button>
              <div className="dropdown-content">
                <Link to="/admin-dashboard/admin-entradas">Listar Entradas</Link>
                <Link to="/admin-dashboard/admin-entradas-confirmar">Lector QR</Link>
                <Link to="/admin-dashboard/admin-detalles-entrada">Ver Detalles de Entradas</Link>
              </div>
            </li>
            <li className="dropdown">
              <button className="dropdown-btn">Pagos</button>
              <div className="dropdown-content">
                <Link to="/admin-dashboard/admin-confirmar-pago">Pagos a Confirmar</Link>
                <Link to="/admin-dashboard/admin-pagos">Listar Pagos</Link>
                <Link to="/admin-dashboard/admin-detalles-pago">Ver Detalles de Pago</Link>
              </div>
            </li>
            <li className="dropdown">
              <button className="dropdown-btn" onClick={handleLogout}>Cerrar Sesion</button>
            </li>
          </>
        )}

        {/* Opciones solo visibles para Usuario */}
        {userRole === 'User' && (
          <>
            <li className="dropdown">
              <button className="dropdown-btn">Mis Datos</button>
              <div className="dropdown-content">
                <Link to="/user-dashboard/user-profile">Ver Información</Link>
              </div>
            </li>
            <li className="dropdown">
              <button className="dropdown-btn">Eventos</button>
              <div className="dropdown-content">
                <Link to="/user-dashboard/user-events">Ver Eventos</Link>
                <Link to="/user-dashboard/user-buscar-events">Buscar Evento</Link>
              </div>
            </li>
            <li className="dropdown">
              <button className="dropdown-btn">Entradas</button>
              <div className="dropdown-content">
                <Link to="/user-dashboard/user-entradas">Mis Entradas</Link>
                <Link to="/user-dashboard/user-detalles-entrada">Detalles de Entrada</Link>
              </div>
            </li>
            <li className="dropdown">
              <button className="dropdown-btn">Pagos</button>
              <div className="dropdown-content">
                <Link to="/user-dashboard/user-pagos">Mis Pagos</Link>
                <Link to="/user-dashboard/user-events">Ver Detalles de Pago</Link>
              </div>
            </li>
            <li className="dropdown">
              <button className="dropdown-btn" onClick={handleLogout}>Cerrar Sesion</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;

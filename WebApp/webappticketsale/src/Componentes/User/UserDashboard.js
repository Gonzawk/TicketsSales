import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserProfile from './UserProfile';
/* import UserOrders from '../UserOrders'; */
import UserEvent from './UserEvent';  
import UserEventBuscar from './UserEventBuscar';
import UserEntrada from './UserEntradas';
import UserEntradaDetalles from './UserEntradasDetalles';
import UserPagos from './UserPagos';


function UserDashboard() {
  return (
    <div>
      <h2>User Dashboard</h2>
   

      <Routes>
        <Route path="/" element={<h3>Bienvenido al Panel de Usuario</h3>} />
        <Route path="user-profile" element={<UserProfile />} />  {/* Perfil del usuario */}
        {/* <Route path="user-orders" element={<UserOrders />} />  {/* Órdenes del usuario */} 
        <Route path="user-events" element={<UserEvent />} />  {/* Órdenes del usuario */}
        <Route path="user-buscar-events" element={<UserEventBuscar/>} />  {/* Órdenes del usuario */}
        <Route path="user-entradas" element={<UserEntrada/>} />  {/* Órdenes del usuario */}
        <Route path="user-detalles-entrada" element={<UserEntradaDetalles/>} />  {/* Órdenes del usuario */}
        <Route path="user-pagos" element={<UserPagos/>} />  {/* Órdenes del usuario */}
      </Routes>
    </div>
  );
}

export default UserDashboard;

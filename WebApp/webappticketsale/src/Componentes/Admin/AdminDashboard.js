import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminUserList from './AdminUserList';
import AdminUserRegister from './AdminUserRegister';
import AdminEventRegister from './AdminEventRegister';
import AdminEvents from './AdminEvents';
import AdminPagosList from './AdminPagosList';
import AdminPagosConfirmar from './AdminPagosConfirmar';
import AdminPagosDetalles from './AdminPagosDetalles';
import AdminEntradasList from './AdminEntradasList';
/* import AdminEntradasDetalles from './AdminEntradasDetalles/useEntradasDetalles'; */
import AdminEntradasQR from '../../Componentes/Admin/AdminEntradasQR.js';

import AdminEntradasDetalles from '../Admin/AdminEntradasDetalles.js';
/* import useAdminEntradasDetalles from './AdminEntradasDetallesLogic'; */

function AdminDashboard() {
  return (
    <div>
      <h2>Admin Dashboard</h2>
    

      <Routes>
        <Route path="/" element={<h3>Bienvenido al Panel de Administración</h3>} />
        <Route path="admin-users" element={<AdminUserList />} />  {/* Lista de usuarios */}
        <Route path="admin-register" element={<AdminUserRegister />} />  {/* Configuración del Admin */}
        <Route path="admin-events" element={<AdminEvents />} />  {/* Lista Eventos como Admin */}
        <Route path="admin-event-register" element={<AdminEventRegister />} />  {/* Registra Eventos solo para Admin*/}
        <Route path="admin-pagos" element={<AdminPagosList />} />  {/* Lista de Pagos solo para Admin*/}
        <Route path="admin-confirmar-pago" element={<AdminPagosConfirmar />} />  {/* Confirmacion de Pagos solo para Admin*/}
        <Route path="admin-detalles-pago" element={<AdminPagosDetalles />} />  {/* Busqueda de Pagos por ID solo para Admin*/}
        <Route path="admin-entradas" element={<AdminEntradasList />} />  {/* Lista de entradas solo para Admin*/}
        <Route path="admin-detalles-entrada" element={<AdminEntradasDetalles />} />  {/* Busqueda de entradas por ID solo para Admin*/}
        <Route path="admin-entradas-confirmar" element={<AdminEntradasQR />} />  {/* Busqueda de entradas por ID solo para Admin*/}
      </Routes>
    </div>
  );
}

export default AdminDashboard;

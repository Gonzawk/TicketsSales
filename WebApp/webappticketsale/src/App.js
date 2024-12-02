import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './Componentes/Login/Register/HomePage';
import Login from './Componentes/Login/Register/Login';
import Register from './Componentes/Login/Register/Register';
import AdminDashboard from './Componentes/Admin/AdminDashboard';
import UserDashboard from './Componentes/User/UserDashboard';
import AdminUserRegister from './Componentes/Admin/AdminUserRegister';
import AdminUserList from './Componentes/Admin/AdminUserList';
import PrivateRoute from './Routes/PrivateRoute';
import NavBar from './Componentes/General/Navbar';
import AdminEvents from './Componentes/Admin/AdminEvents';
import AdminEventRegister from './Componentes/Admin/AdminEventRegister';
import UserProfile from './Componentes/User/UserProfile';
import UserEvent from './Componentes/User/UserEvent';
import AdminPagosList from './Componentes/Admin/AdminPagosList';
import AdminPagosConfirmar from './Componentes/Admin/AdminPagosConfirmar';
import AdminEntradasList from './Componentes/Admin/AdminEntradasList';
import AdminEntradasDetalles from './Componentes//Admin/AdminEntradasDetalles';
import UserEventBuscar from './Componentes/User/UserEventBuscar';
import { AuthProvider, useAuth } from './Context/AuthContext'; // Importar el AuthContext
import UserEntrada from './Componentes/User/UserEntradas';
import UserEntradasDetalles from './Componentes/User/UserEntradasDetalles'; // Nueva ruta para detalles de entradas de usuario
import AdminEntradasQR from './Componentes/Admin/AdminEntradasQR';
import UserPagos from './Componentes/User/UserPagos';

function App() {
  return (
    <AuthProvider> {/* Envolvemos la aplicación con el AuthProvider */}
      <AppContent />
    </AuthProvider>
  );
}

const AppContent = () => {
  const { isAuthenticated, userRole, logout } = useAuth(); // Usamos el contexto

  return (
    <div className="App">
      <header className="App-header">
        <h1>TicketsSalesApp</h1>
      </header>

      {/* NavBar se muestra solo si el usuario está autenticado */}
      {isAuthenticated && <NavBar userRole={userRole} logout={logout} />}

      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas para Admin */}
        <Route 
          path="/admin-dashboard/*" 
          element={
            <PrivateRoute isAuthenticated={isAuthenticated} userRole={userRole} requiredRole="Admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        >
          <Route path="admin-users" element={<AdminUserList />} />
          <Route path="admin-register" element={<AdminUserRegister />} />
          <Route path="admin-events" element={<AdminEvents />} />
          <Route path="admin-event-register" element={<AdminEventRegister />} />
          <Route path="admin-pagos" element={<AdminPagosList />} />
          <Route path="admin-confirmar-pago" element={<AdminPagosConfirmar />} />
          <Route path="admin-entradas" element={<AdminEntradasList />} />
          <Route path="admin-detalles-entrada/:entradaId" element={<AdminEntradasDetalles />} /> {/* Detalles de entrada admin */}
          <Route path="admin-entradas-confirmar" element={<AdminEntradasQR />} /> {/* Detalles de entrada admin */}
        </Route>

        {/* Rutas protegidas para Usuario */}
        <Route 
          path="/user-dashboard/*" 
          element={
            <PrivateRoute isAuthenticated={isAuthenticated} userRole={userRole} requiredRole="User">
              <UserDashboard />
            </PrivateRoute>
          }
        >
          <Route path="profile" element={<UserProfile />} />
          <Route path="user-event" element={<UserEvent />} />
          <Route path="user-buscar-events" element={<UserEventBuscar />} />
          <Route path="user-entradas" element={<UserEntrada />} />
          <Route path="user-detalles-entrada" element={<UserEntradasDetalles />} /> {/* Detalles de entrada usuario */}
          <Route path="user-pagos" element={<UserPagos />} /> {/* Detalles de entrada usuario */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;


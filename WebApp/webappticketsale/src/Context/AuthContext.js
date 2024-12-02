// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  // Al montar el componente, verificamos si el token está en el localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Decodifica el JWT y extrae el rol
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      setIsAuthenticated(true);  // El usuario está autenticado
      setUserRole(role);  // Establece el rol del usuario
    }
  }, []);

  const handleLogin = (token) => {
    // Guardamos el token en el localStorage y actualizamos el estado de autenticación
    localStorage.setItem('token', token);
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    setIsAuthenticated(true);
    setUserRole(role);
    navigate(role === 'Admin' ? '/admin-dashboard' : '/user-dashboard');  // Redirige según el rol
  };

  const handleLogout = () => {
    // Elimina el token y actualiza el estado
    localStorage.removeItem('token');
    setIsAuthenticated(false); // Actualiza el estado para reflejar que el usuario cerró sesión
    setUserRole(null); // Limpia el rol
    navigate('/login'); // Redirige a la página de login
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

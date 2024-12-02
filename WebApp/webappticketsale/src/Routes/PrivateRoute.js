import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ isAuthenticated, userRole, requiredRole, children }) => {
  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Si el rol no coincide, redirigir a la página principal o a otro lugar
  if (userRole !== requiredRole) {
    return <Navigate to="/" />;
  }

  // Si todo es válido, renderizar los componentes hijos
  return children;
};

export default PrivateRoute;

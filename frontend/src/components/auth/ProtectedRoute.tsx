import { type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // ../../ para subir dos niveles

const ProtectedRoute = ({ 
  children,
  allowedRoles 
}: { 
  children: JSX.Element,
  allowedRoles: ('cliente' | 'dueño_negocio' | 'administrador')[]
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Cargando...</div>;
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/iniciar-sesion" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
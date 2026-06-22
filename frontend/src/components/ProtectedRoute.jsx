import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isLoggedIn, role } = useAuth();

  if (!isLoggedIn) {
    // Si no está logueado, lo mandamos al login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Si está logueado pero no tiene el rol necesario, lo mandamos al home
    return <Navigate to="/" replace />;
  }

  // Si pasa las validaciones, renderiza la ruta protegida
  return children;
}

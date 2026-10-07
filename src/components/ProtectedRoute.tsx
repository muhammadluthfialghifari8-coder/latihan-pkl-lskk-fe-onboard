import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const ProtectedRoute = () => {
  const { token, user, isAuthenticated } = useAuthStore();
  const hasValidSession = Boolean(token) && Boolean(user) && isAuthenticated;

  return hasValidSession ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
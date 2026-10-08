import { Navigate, Outlet } from 'react-router-dom'; // Pastikan ada Outlet
import { useAuthStore } from '../stores/authStore';

const ProtectedRoute = () => {
  // Cek token (sesuai implementasi Zustand kamu)
  const token = useAuthStore((state) => state.token);

  if (!token) {
    // Jika tidak ada token, lempar ke login
    return <Navigate to="/login" replace />;
  }

  // Jika ada token, render halaman anak (DashboardPage) di sini
  return <Outlet />; 
};

export default ProtectedRoute;
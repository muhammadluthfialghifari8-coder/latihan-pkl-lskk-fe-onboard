import { lazy, Suspense } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { Spin } from 'antd';
import ProtectedRoute from './components/ProtectedRoute';

// LAZY LOADING: Komponen hanya dimuat saat dibutuhkan
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

// FALLBACK LOADING: Tampilan saat komponen sedang dimuat
const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <Spin size="large" description="Memuat halaman..." />
  </div>
);

// KONFIGURASI ROUTER (Hash Router)
const router = createHashRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: <ProtectedRoute />, // Wrapper untuk proteksi
    children: [
      {
        index: true, // Ini mewakili path '/' (root)
        element: (
          <Suspense fallback={<PageLoader />}>
            <DashboardPage />
          </Suspense>
        ),
      },
    ],
  },
]);

function App() {
  // RENDER PROVIDER
  return <RouterProvider router={router} />;
}

export default App;

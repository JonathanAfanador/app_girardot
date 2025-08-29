import { createBrowserRouter, RouterProvider, redirect, useLocation} from 'react-router-dom'
import Layout from '../components/layout/Layout'
import HomePage from '../pages/Home/HomePage'
import BusinessesPage from '../pages/Businesses/BusinessesPage'
import BusinessEditPage from '../pages/Businesses/BusinessEditPage'
import LoginPage from '../pages/Auth/LoginPage'
import RegisterPage from '../pages/Auth/RegisterPage'
import ProtectedRoute from '../components/auth/ProtectedRoute';
import OwnerDashboardPage from '../pages/Dashboard/OwnerDashboardPage';
import { AuthProvider, useAuth } from '../context/AuthContext'


// Componente envoltorio para Layout
const LayoutWrapper = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth(); // <-- Agregar esta línea
  return <Layout key={`${location.pathname}-${isAuthenticated}`} />; // <-- Combinar ruta y estado de auth
};

// Crea el router pero no lo exportes directamente
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <LayoutWrapper />
      </AuthProvider>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'negocios', element: <BusinessesPage /> },
      {
        path: 'iniciar-sesion',
        element: <LoginPage />,
        loader: () => {
          const token = localStorage.getItem('token');
          return token ? redirect('/') : null;
        }
      },
      {
        path: 'registrarse',
        element: <RegisterPage />,
        loader: () => {
          const token = localStorage.getItem('token');
          return token ? redirect('/') : null;
        }
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute allowedRoles={['dueño_negocio', 'administrador']}>
            <OwnerDashboardPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'negocios/editar/:id',
        element: (
          <ProtectedRoute allowedRoles={['dueño_negocio', 'administrador']}>
            <BusinessEditPage />
          </ProtectedRoute>
        )
      },
      {
        path: '/negocios/nuevo',
        element: (
          <ProtectedRoute allowedRoles={['dueño_negocio']}>
            <BusinessEditPage />
          </ProtectedRoute>
        )
      }
      
    ]
  }
])

// Exporta el componente Router que usa RouterProvider
export const Router = () => <RouterProvider router={router} />
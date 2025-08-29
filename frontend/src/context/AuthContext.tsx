import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';
import { AuthService } from '../services/auth';
import { useNavigate } from 'react-router-dom';


interface User {
  id: number;
  name: string;
  email: string;
  role: 'cliente' | 'dueño_negocio' | 'administrador'; // Corregir 'dueño_negocio'
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProviderImplementation = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  


  // Función para obtener datos del usuario autenticado
  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me');
      const userData = response.data;
      // Mapear campos del backend al frontend si es necesario
      setUser({
        id: userData.id_usuario,
        name: userData.nombre,
        email: userData.correo,
        role: userData.tipo_usuario // Debe coincidir con los roles definidos
      });
      return true;
    } catch (error) {
      console.error('Error obteniendo datos de usuario:', error);
      localStorage.removeItem('token');
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) fetchUser();
    else setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const isAuthenticated = !!user;
      const currentPath = window.location.pathname;
      
      // Forzar actualización de componentes clave
      if (isAuthenticated) {
        window.dispatchEvent(new Event('visibilitychange'));
      }

      // Redirecciones
      const protectedPaths = ['/dashboard', '/perfil'];
      if (!isAuthenticated && protectedPaths.some(path => currentPath.includes(path))) {
        navigate('/');
      }
      
      if (isAuthenticated && (currentPath === '/iniciar-sesion' || currentPath === '/registrarse')) {
        navigate('/');
      }
    }
  }, [user, isLoading, navigate]);

  const login = useCallback(async (email: string, password: string) => { // <-- Usar useCallback
    try {
      setIsLoading(true);
      const { token } = await AuthService.login(email, password);
      localStorage.setItem('token', token);
      const success = await fetchUser();
      if (success) navigate('/'); // <-- Ahora navigate está disponible
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/'); // <-- Agregar navegación
  }, [navigate]);

  const contextValue = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  }), [user, isLoading, login, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider = AuthProviderImplementation;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};
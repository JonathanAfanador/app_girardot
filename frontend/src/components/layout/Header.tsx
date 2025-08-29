import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import type { ReactNode } from 'react'
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/images/logo.png';

const Header = (): ReactNode => {
  const [updateKey, setUpdateKey] = useState(0);
  const { user, isAuthenticated, logout, isLoading} = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { path: '/', label: 'Inicio' },
    { path: '/negocios', label: 'Negocios' },
    { path: '/eventos', label: 'Eventos' },
    { path: '/promociones', label: 'Promociones' }
  ]

  useEffect(() => {
    const handler = () => setUpdateKey(prev => prev + 1);
    window.addEventListener('visibilitychange', handler);
    return () => window.removeEventListener('visibilitychange', handler);
  }, []);

  if (isLoading) return null;

  return (
    <header key={updateKey} className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src={logo}
            alt="Logo Girardot App"
            className="h-10 w-auto"
          />
          <span className="text-xl font-bold text-primary hidden md:inline">
            Girardot App
          </span>
        </Link>
        
        {/* Menú para desktop */}
        <nav className="hidden md:flex space-x-6">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-gray-600 hover:text-primary font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Menú móvil */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-600 hover:text-primary"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Botones de auth */}
        <div className="hidden md:flex gap-4 items-center">
          {isAuthenticated ? (
            <>
              {user?.role === 'dueño_negocio' && (
                <Link to="/dashboard" className="text-gray-600 hover:text-primary">
                  Panel Dueño
                </Link>
              )}
              {(user?.role === 'cliente' || user?.role === 'administrador') && (
                <Link to="/perfil" className="text-gray-600 hover:text-primary">
                  Perfil
                </Link>
              )}
              <Button 
                onClick={logout} 
                variant="outline" 
                className="text-gray-600 hover:text-primary"
              >
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Link to="/iniciar-sesion" className="text-gray-600 hover:text-primary">
                Iniciar sesión
              </Link>
              <Link to="/registrarse">
                <Button variant="primary">Registrarse</Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-2 flex flex-col space-y-3">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="py-2 text-gray-600 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-200 space-y-3">
              {isAuthenticated ? (
                <>
                  {user?.role === 'dueño_negocio' && (
                    <Link 
                      to="/dashboard" 
                      className="block w-full text-center py-2 text-gray-600 hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Panel Dueño
                    </Link>
                  )}
                  <Button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }} 
                    variant="outline" 
                    className="w-full"
                  >
                    Cerrar sesión
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    as={Link}
                    to="/iniciar-sesion"
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Iniciar sesión
                  </Button>
                  <Button 
                    as={Link}
                    to="/registrarse"
                    className="w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Registrarse
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
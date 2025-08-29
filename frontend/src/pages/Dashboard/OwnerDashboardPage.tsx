// frontend/src/pages/Dashboard/OwnerDashboardPage.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import type { Business } from '../../types/business'
import { useAuth } from '../../context/AuthContext'
import { BusinessService } from '../../services/business'

const OwnerDashboardPage = () => {
  const { user } = useAuth()
  const [businesses, setBusinesses] = useState<Business[]>([])

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const businesses = await BusinessService.getMyBusinesses();
        setBusinesses(businesses);
      } catch (error) {
        console.error('Error cargando negocios:', error);
      }
    };
    
    if (user?.role === 'dueño_negocio') fetchBusinesses();
  }, [user]);

  const handleDelete = async (businessId: number) => {
    if (window.confirm('¿Estás seguro de eliminar este negocio?')) {
      try {
        await BusinessService.delete(businessId)
        setBusinesses(prev => prev.filter(b => b.id !== businessId))
      } catch (error) {
        console.error('Error eliminando negocio:', error)
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mis Negocios</h1>
        <Link 
          to="/negocios/nuevo"
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
        >
          + Nuevo Negocio
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map((business) => (
          <div key={business.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="absolute top-2 right-2 space-x-2">
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => handleDelete(business.id)}
                >
                  Eliminar
                </Button>
              </div>
            <h3 className="text-xl font-semibold mb-2">{business.name}</h3>
            <p className="text-gray-600 mb-4">{business.address}</p>
            <Link
              to={`/negocios/editar/${business.id}`}
              className="text-primary hover:text-primary-dark"
            >
              Administrar Negocio →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OwnerDashboardPage
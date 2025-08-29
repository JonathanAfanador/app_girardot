// src/pages/Businesses/BusinessesPage.tsx
import { useEffect, useState } from 'react'
import BusinessCard from '../../components/business/BusinessCard'
import { BusinessService } from '../../services/api'
import type { Business } from '../../types/business'

const BusinessesPage = () => {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await BusinessService.getAll();
        console.log('Datos recibidos:', response.data);
        
        // Asegurar acceso correcto a los datos
        const data = response.data?.data || response.data
        
        if (!Array.isArray(data)) {
          throw new Error('Formato de respuesta inválido: se esperaba un array')
        }
        
        setBusinesses(data)
      } catch (err) {
        const error = err as Error
        setError(`Error al cargar negocios: ${error.message}`)
        console.error('Error detallado:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBusinesses()
  }, [])

  if (loading) return <div className="text-center py-8">Cargando negocios...</div>
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>
  if (businesses.length === 0) return <div className="text-center py-8">No hay negocios registrados</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Negocios en Girardot</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {businesses.map(business => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>
    </div>
  )
}

export default BusinessesPage
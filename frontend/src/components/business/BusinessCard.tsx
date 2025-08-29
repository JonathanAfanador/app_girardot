import type { Business } from '../../types/business'
import { Link } from 'react-router-dom';

// components/business/BusinessCard.tsx
interface BusinessCardProps {
  business: Business // Asegurar que Business tenga las propiedades correctas
}

const BusinessCard = ({ business }: BusinessCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900">{business.name}</h2> {/* Usar nombre */}
        <p className="text-primary font-medium mt-1">{business.category}</p> {/* nombre_categoria */}
        <p className="text-gray-600 mt-2">{business.description}</p>
        <p className="text-gray-500 text-sm mt-4">
          📍 {business.address}
        </p>
        <div className="mt-4">
          <Link 
            to={`/negocios/${business.id}`}
            className="inline-block bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver más
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BusinessCard
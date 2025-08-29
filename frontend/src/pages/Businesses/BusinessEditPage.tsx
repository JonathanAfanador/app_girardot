import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BusinessService } from '../../services/business';
import BusinessForm from '../../components/business/BusinessForm';
import type { Business, BusinessFormData } from '../../types/business';

const BusinessEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const [business, setBusiness] = useState<Business | null>(null);

  useEffect(() => {
    const loadBusiness = async () => {
      try {
        const data = await BusinessService.getById(Number(id));
        setBusiness(data);
      } catch (error) {
        console.error('Error cargando negocio:', error);
      }
    };
    loadBusiness();
  }, [id]);

  const handleSubmit = async (formData: BusinessFormData) => {
    if (!id) return;
    
    try {
      const updatedBusiness = await BusinessService.update(Number(id), formData);
      setBusiness(updatedBusiness);
    } catch (error) {
      console.error('Error actualizando negocio:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Editar Negocio</h1>
      
      {business && (
        <BusinessForm 
          initialData={{
            nombre: business.name,
            direccion: business.address,
            telefono: business.phone || '',
            descripcion: business.description || '',
            id_categoria: Number(business.category)
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default BusinessEditPage;
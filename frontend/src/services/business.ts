import api from './api';
import type { Business, BusinessFromBackend, BusinessFormData } from '../types/business';

// Función de conversión desde el backend
const mapBusinessFromBackend = (business: BusinessFromBackend): Business => ({
  id: business.id_negocio,
  name: business.nombre,
  address: business.direccion,
  phone: business.telefono,
  category: business.id_categoria.toString(), // Asumiendo que necesitas convertir a string
  description: business.descripcion
});

export const BusinessService = {
  getAll: async (page = 1, limit = 10) => {
    const response = await api.get(`/negocios?page=${page}&limit=${limit}`);
    return {
      data: response.data.data.map(mapBusinessFromBackend),
      pagination: response.data.pagination
    };
  },

  getMyBusinesses: async () => {
    const response = await api.get<BusinessFromBackend[]>('/negocios/mis-negocios');
    return response.data.map(mapBusinessFromBackend);
  },

  getById: async (id: number) => {
    const response = await api.get<BusinessFromBackend>(`/negocios/${id}`);
    return mapBusinessFromBackend(response.data);
  },

  create: async (data: BusinessFormData) => {
    const response = await api.post<BusinessFromBackend>('/negocios', data);
    return mapBusinessFromBackend(response.data);
  },

  update: async (id: number, data: BusinessFormData) => {
    const response = await api.put<BusinessFromBackend>(`/negocios/${id}`, data);
    return mapBusinessFromBackend(response.data);
  },

  delete: async (id: number) => {
  await api.delete(`/negocios/${id}`);
  },

};

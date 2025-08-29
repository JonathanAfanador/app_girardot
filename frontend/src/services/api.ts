import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

// Crea una instancia de axios con tipos correctos
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para añadir token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {} // Asegura que headers exista
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const BusinessService = {
  getAll: (page = 1, limit = 10) => 
    api.get(`/negocios?page=${page}&limit=${limit}`),
  getById: (id: number) => api.get(`/negocios/${id}`),
  // Más métodos según necesites
}

export const ReviewService = {
  getByBusiness: (id: number) => api.get(`/resenas/negocio/${id}`),
}

export default api
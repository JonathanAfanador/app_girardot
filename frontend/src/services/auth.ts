import api from './api'
import type { AxiosError } from 'axios'

interface LoginResponse {
  token: string
}

interface RegisterData {
  name: string
  email: string
  password: string
  phone: string
  userType: 'cliente' | 'dueño_negocio'
}

interface ApiError {
  message: string
}

export const AuthService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await api.post('/auth/login', {
        correo: email,
        contraseña: password
      })
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>
      throw new Error(axiosError.response?.data?.message || 'Error al iniciar sesión')
    }
  },

  register: async (data: RegisterData) => {
    try {
      const response = await api.post('/auth/register', data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>
      throw new Error(axiosError.response?.data?.message || 'Error al registrarse')
    }
  }
}
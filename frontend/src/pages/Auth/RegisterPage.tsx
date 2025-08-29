import { useState, useEffect } from 'react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    userType: 'cliente'
  })
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Registrarse</h1>
      <form className="space-y-4">
        <Input
          label="Nombre completo"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
        <Input
          label="Correo electrónico"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        <Input
          label="Teléfono"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          required
        />
        <Input
          label="Contraseña"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
        <div className="space-y-2">
          <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
            Tipo de usuario
          </label>
          <select
            id="userType"
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={formData.userType}
            onChange={(e) => setFormData({...formData, userType: e.target.value})}
          >
            <option value="cliente">Cliente</option>
            <option value="dueño_negocio">Dueño de Negocio</option>
          </select>
        </div>
        <Button type="submit" variant="primary" className="w-full">
          Registrarse
        </Button>
      </form>
    </div>
  )
}

export default RegisterPage
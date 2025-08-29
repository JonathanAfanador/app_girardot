import { useState , useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { AuthService } from '../../services/auth'
import { useAuth } from '../../context/AuthContext';



const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setError('')
  
  try {
    const { token } = await AuthService.login(email, password)
    localStorage.setItem('token', token)
    navigate('/')
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
    setError(errorMessage)
    console.error('Detalle del error:', err)
  } finally {
    setLoading(false)
  }
}
  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Iniciar Sesión</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </Button>
      </form>
    </div>
  )
}

export default LoginPage
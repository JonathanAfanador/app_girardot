import Button from '../ui/Button'
import { useAuth } from '../../context/AuthContext';


const HeroSection = () => {
  const { isAuthenticated } = useAuth();
  return (
    <section className="relative bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Descubre lo mejor de Girardot
          </h1>
          <p className="text-xl mb-8">
            Promociones, eventos y los mejores lugares para ti
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated && (
              <Button 
                as="a" 
                href="/registrarse"
                variant="primary"
                className="px-8 py-3 text-lg"
              >
                Regístrate gratis
              </Button>
            )}
            <Button
              as="a"
              href="/negocios"
              variant="outline"
              className="px-8 py-3 text-lg"
            >
              Explorar negocios
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
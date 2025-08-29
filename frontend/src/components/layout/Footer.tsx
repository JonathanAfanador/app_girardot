import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface FooterSection {
  title: string
  links: { label: string; to: string }[]
}

const Footer = () : ReactNode => {
  const sections: FooterSection[] = [
    {
      title: 'Enlaces',
      links: [
        { label: 'Inicio', to: '/' },
        { label: 'Negocios', to: '/negocios' },
        { label: 'Eventos', to: '/eventos' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Términos', to: '/terminos' },
        { label: 'Privacidad', to: '/privacidad' }
      ]
    },
    {
      title: 'Contacto',
      links: [
        { label: 'info@girardotapp.com', to: 'mailto:info@girardotapp.com' },
        { label: 'Soporte', to: '/soporte' }
      ]
    }
  ]

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-4">Girardot App</h3>
            <p className="text-gray-400">
              Descubre lo mejor de Girardot en un solo lugar.
            </p>
          </div>
          
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      to={link.to} 
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Girardot App. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
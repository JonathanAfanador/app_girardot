import Card from '../ui/Card'

const FeaturedSection = () => {
  // Datos temporales - luego vendrán de la API
  const featuredItems = [
    {
      id: 1,
      title: "Fiesta en la Piscina",
      description: "Evento especial con DJ en vivo",
      imageUrl: "/placeholder-event.jpg"
    },
    {
      id: 2,
      title: "2x1 en Cócteles",
      description: "Promoción válida todos los jueves",
      imageUrl: "/placeholder-promo.jpg"
    },
    {
      id: 3,
      title: "Bar La Terraza",
      description: "Nuevo local con vista panorámica",
      imageUrl: "/placeholder-business.jpg"
    }
  ]

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-12">Destacados</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {featuredItems.map((item) => (
          <Card
            key={item.id}
            title={item.title}
            description={item.description}
            imageUrl={item.imageUrl}
          >
            <button className="mt-4 text-primary font-medium hover:underline">
              Ver más
            </button>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default FeaturedSection
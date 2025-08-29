const HowItWorks = () => {
  const steps = [
    {
      title: "Descubre",
      description: "Explora negocios y eventos en Girardot",
      icon: "🔍"
    },
    {
      title: "Reserva",
      description: "Asegura tu lugar con un clic",
      icon: "📅"
    },
    {
      title: "Disfruta",
      description: "Vive la experiencia y califica",
      icon: "🎉"
    }
  ]

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">¿Cómo funciona?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center p-6">
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
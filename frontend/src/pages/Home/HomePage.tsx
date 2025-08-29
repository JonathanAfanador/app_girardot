import HeroSection from '../../components/sections/HeroSection'
import FeaturedSection from '../../components/sections/FeaturedSection'
import HowItWorks from '../../components/sections/HowItWorks'

const HomePage = () => {
  return (
    <div className="space-y-16 pb-16">
      <HeroSection />
      <FeaturedSection />
      <HowItWorks />
    </div>
  )
}

export default HomePage
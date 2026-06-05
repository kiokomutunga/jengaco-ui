import React from 'react'
import Navbar        from '../components/layout/Navbar'
import LandingHero   from '../components/landing/LandingHero'
import PublicJobs    from '../components/landing/PublicJobs'
import HowItWorks    from '../components/landing/HowItWorks'
import LandingFooter from '../components/landing/LandingFooter'

export default function Landing() {
  return (
    <div>
      <Navbar />
      <LandingHero />
      <PublicJobs />
      <HowItWorks />
      <LandingFooter />
    </div>
  )
}

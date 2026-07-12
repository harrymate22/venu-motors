import { useParams, Navigate } from "react-router-dom"
import { BIKES } from "./bikes"
import BikeHero from "./sections/BikeHero"
import BikeShowcase from "./sections/BikeShowcase"
import BikeColours from "./sections/BikeColours"
import BikeFeatures from "./sections/BikeFeatures"
import BikeService from "./sections/BikeService"
import TestimonialsSection from "@/pages/home/sections/testimonials/TestimonialsSection"

export default function BikePage() {
  const { slug } = useParams()
  const bike = BIKES[slug]

  // Unknown bike → send back home
  if (!bike) return <Navigate to="/" replace />

  return (
    <main>
      <BikeHero bike={bike} />
      <BikeShowcase showcase={bike.showcase} />
      <BikeColours bike={bike} />
      <BikeFeatures tabs={bike.featureTabs} />
      <BikeService service={bike.service} />
      <TestimonialsSection />
      {/* Coming next: specs, key features, warranty */}
    </main>
  )
}

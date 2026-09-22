import { useParams, useSearchParams, Navigate, Link } from "react-router-dom"
import { X } from "lucide-react"
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
  // The shop sends buyers back with ?order=unavailable when the colour/battery
  // they chose is switched off or out of stock there.
  const [searchParams, setSearchParams] = useSearchParams()
  const unavailable = searchParams.get("order") === "unavailable"

  // Unknown bike → send back home
  if (!bike) return <Navigate to="/" replace />

  return (
    <main>
      {unavailable && (
        <div
          role="status"
          className="fixed inset-x-4 top-24 z-40 mx-auto flex max-w-lg items-start gap-3 rounded-xl bg-white p-4 text-sm text-neutral-700 shadow-xl ring-1 ring-black/5"
        >
          <p className="flex-1">
            That {bike.shortName} option can&rsquo;t be bought online right now.{" "}
            <Link to="/#enquire" className="font-semibold text-neutral-900 underline underline-offset-2">
              Send us an enquiry
            </Link>{" "}
            and we&rsquo;ll call you.
          </p>
          <button
            onClick={() => setSearchParams({}, { replace: true })}
            aria-label="Dismiss"
            className="text-neutral-400 transition-colors hover:text-neutral-700"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
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

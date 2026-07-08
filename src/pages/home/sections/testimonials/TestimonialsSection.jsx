import { useState } from "react"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"
import { carouselArrowClass as arrowClass } from "@/lib/carousel"
import { TESTIMONIALS } from "./testimonials"
import TestimonialCard from "./TestimonialCard"
import TestimonialModal from "./TestimonialModal"

export default function TestimonialsSection() {
  const [active, setActive] = useState(null)

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true })]}
        >
          {/* Header */}
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl">
                Voices of our Venu community
              </h2>
              <p className="mt-3 max-w-xl text-neutral-500">
                From first rides to everyday commutes — real owners share their electric journey.
              </p>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <CarouselPrevious className={arrowClass} />
              <CarouselNext className={arrowClass} />
            </div>
          </div>

          {/* py gives hover shadows room inside the overflow-hidden viewport */}
          <CarouselContent className="mt-10 py-2">
            {TESTIMONIALS.map((testimonial) => (
              <CarouselItem
                key={testimonial.id}
                className="basis-[85%] sm:basis-1/2 lg:basis-1/3"
              >
                <TestimonialCard testimonial={testimonial} onOpen={setActive} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <TestimonialModal testimonial={active} onClose={() => setActive(null)} />
    </section>
  )
}

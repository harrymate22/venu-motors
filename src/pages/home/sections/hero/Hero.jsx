import { useEffect, useState } from "react"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"
import { HERO_SLIDES } from "./slides"
import HeroSlide from "./HeroSlide"
import HeroDots from "./HeroDots"

const arrowClass =
  "size-10 border-0 bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 hover:text-white top-1/2"

export default function Hero() {
  const [api, setApi] = useState(null)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return
    const onSelect = () => setCurrent(api.selectedScrollSnap())
    onSelect()
    api.on("select", onSelect)
    return () => void api.off("select", onSelect)
  }, [api])

  return (
    <section className="relative w-full overflow-hidden">
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true })]}
      >
        {/* ml-0 / pl-0 override the default gutter for full-bleed slides */}
        <CarouselContent className="ml-0">
          {HERO_SLIDES.map((slide, i) => (
            <CarouselItem key={slide.id} className="pl-0">
              <HeroSlide slide={slide} active={i === current} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className={`left-4 md:left-8 ${arrowClass}`} />
        <CarouselNext className={`right-4 md:right-8 ${arrowClass}`} />
      </Carousel>

      <HeroDots
        count={HERO_SLIDES.length}
        current={current}
        onSelect={(i) => api?.scrollTo(i)}
      />
    </section>
  )
}

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import SparkIcon from "@/components/SparkIcon"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"

const arrowClass =
  "static size-10 translate-y-0 rounded-full border-0 bg-white/10 text-white ring-1 ring-white/15 backdrop-blur-md transition-all hover:bg-white hover:text-neutral-900 hover:ring-transparent disabled:opacity-40"

function VariantCard({ bike, variant }) {
  const { name, price, variantSpecs } = bike

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white text-neutral-900 shadow-xl">
      <img
        src={variant.image}
        alt={`${name} ${variant.colour}`}
        className="aspect-[4/3] w-full object-cover"
      />

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-semibold">
          {name}{" "}
          <span className="font-medium" style={{ color: variant.accent }}>
            {variant.colour}
          </span>
        </h3>

        {/* Shared spec columns */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          {variantSpecs.columns.map((col) => (
            <div key={col.label}>
              <p className="text-base font-semibold text-neutral-900">{col.value}</p>
              <p className="mt-0.5 text-xs text-neutral-500">{col.label}</p>
            </div>
          ))}
        </div>

        <hr className="my-5 border-neutral-200" />

        <ul className="space-y-3">
          {variantSpecs.bullets.map((bullet) => (
            <li key={bullet} className="flex items-center gap-3 text-sm text-neutral-700">
              <SparkIcon className="size-4" />
              {bullet}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6">
          <p className="text-xs uppercase tracking-wide text-neutral-400">Starting at</p>
          <p className="text-xl font-semibold text-neutral-900">
            {price}
            <span className="text-sm font-normal text-neutral-500"> onwards</span>
          </p>

          <div className="mt-4 flex gap-3">
            <Button className="group/btn h-11 flex-1 gap-2">
              Order now
              <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-0.5" />
            </Button>
            <Button asChild variant="outline" className="h-11 flex-1">
              <Link to="/thunder">Explore</Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function BikeColours({ bike }) {
  const [api, setApi] = useState(null)
  const [scrollable, setScrollable] = useState(false)

  useEffect(() => {
    if (!api) return
    const update = () => setScrollable(api.canScrollPrev() || api.canScrollNext())
    update()
    api.on("select", update)
    api.on("reInit", update)
    return () => {
      api.off("select", update)
      api.off("reInit", update)
    }
  }, [api])

  if (!bike.variants?.length) return null

  return (
    <section className="relative overflow-hidden bg-neutral-950 py-16 text-white md:py-24">
      {/* Diagonal vector texture + soft centre glow behind the cards */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-48deg, rgba(255,255,255,0.65) 0, rgba(255,255,255,0.65) 1px, transparent 1px, transparent 26px)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_45%,rgba(150,150,190,0.18),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <Carousel setApi={setApi} opts={{ align: "start" }}>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Choose your Thunder
              </h2>
              <p className="mt-3 max-w-xl text-white/60">
                Same effortless ride, five bold finishes. Pick the colour that's you.
              </p>
            </div>
            <div className={cn("items-center gap-2", scrollable ? "hidden md:flex" : "hidden")}>
              <CarouselPrevious className={arrowClass} />
              <CarouselNext className={arrowClass} />
            </div>
          </div>

          <CarouselContent className="mt-10">
            {bike.variants.map((variant) => (
              <CarouselItem key={variant.id} className="basis-[85%] sm:basis-1/2 lg:basis-1/3">
                <VariantCard bike={bike} variant={variant} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}

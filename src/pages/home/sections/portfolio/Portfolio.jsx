import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"
import { carouselArrowClass as arrowClass } from "@/lib/carousel"
import { PRODUCTS } from "./products"
import ProductCard from "./ProductCard"

export default function Portfolio() {
  const [api, setApi] = useState(null)
  const [scrollable, setScrollable] = useState(false)

  // Only surface the arrows when the row actually overflows (e.g. tablet).
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

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Carousel setApi={setApi} opts={{ align: "start" }}>
          {/* Header: title + inline nav controls */}
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl">
              Meet the Venu Thunder
            </h2>
            <div className={cn("items-center gap-2", scrollable ? "hidden md:flex" : "hidden")}>
              <CarouselPrevious className={arrowClass} />
              <CarouselNext className={arrowClass} />
            </div>
          </div>

          <CarouselContent className="mt-8">
            {PRODUCTS.map((product) => (
              <CarouselItem
                key={product.id}
                className="basis-[82%] sm:basis-1/2 lg:basis-1/3"
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}

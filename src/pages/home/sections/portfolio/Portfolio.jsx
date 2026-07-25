import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"
import { carouselArrowClass as arrowClass } from "@/lib/carousel"
import { MODELS } from "./products"
import ProductCard from "./ProductCard"

export default function Portfolio() {
  const [activeId, setActiveId] = useState(MODELS[0].id)
  const [api, setApi] = useState(null)
  const [scrollable, setScrollable] = useState(false)
  const sectionRef = useRef(null)
  const { hash, key } = useLocation()

  const model = MODELS.find((m) => m.id === activeId) ?? MODELS[0]

  // Deep links from the nav (/#icon, /#spot, …) select that model and bring the
  // section into view — the models without their own page rely on this. No
  // element carries those ids, so ScrollManager finds nothing and leaves it to us.
  useEffect(() => {
    const id = hash.replace(/^#/, "")
    if (!MODELS.some((m) => m.id === id)) return
    setActiveId(id)
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [hash, key])

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

  // Swapping models changes both the card count and their width — re-measure and
  // snap back to the first card. (Re-keying the Carousel instead would remount the
  // switcher and kill the pill's layout animation.)
  useEffect(() => {
    if (!api) return
    api.reInit()
    api.scrollTo(0, true)
  }, [api, activeId])

  return (
    <section ref={sectionRef} id="models" className="scroll-mt-20 bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Carousel setApi={setApi} opts={{ align: "start" }}>
          {/* Header: title + model switcher + inline nav controls */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl">
              {model.heading}
            </h2>

            <div className="flex items-center gap-3 sm:justify-end">
              {/* Model switcher — sliding pill, sits beside the arrows. Scrolls
                  edge-to-edge on phones, where the labels outgrow the viewport. */}
              <div className="no-scrollbar -mx-6 flex-1 overflow-x-auto px-6 sm:mx-0 sm:flex-none sm:overflow-visible sm:px-0">
                <div
                  role="tablist"
                  aria-label="Choose a model"
                  className="inline-flex items-center gap-1 rounded-full bg-neutral-100 p-1 ring-1 ring-inset ring-black/[0.06]"
                >
                  {MODELS.map((m) => {
                    const isActive = m.id === model.id
                    return (
                      <button
                        key={m.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setActiveId(m.id)}
                        className={cn(
                          // Tighter padding on phones, where space is scarcest.
                          "relative whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors sm:px-4",
                          isActive ? "text-white" : "text-neutral-500 hover:text-neutral-900"
                        )}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="portfolio-model-pill"
                            className="absolute inset-0 rounded-full bg-neutral-900"
                            transition={{ type: "spring", stiffness: 420, damping: 34 }}
                          />
                        )}
                        <span className="relative z-10">{m.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className={cn("items-center gap-2", scrollable ? "hidden md:flex" : "hidden")}>
                <CarouselPrevious className={arrowClass} />
                <CarouselNext className={arrowClass} />
              </div>
            </div>
          </div>

          <CarouselContent className="mt-8">
            {model.products.map((product) => (
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

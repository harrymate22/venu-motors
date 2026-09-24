import { useEffect, useMemo, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "motion/react"
import { ArrowUpRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"
import { DEALERS, DEALER_FILTERS, DEALER_STATES } from "../../dealers"

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: "easeOut" },
})

const arrowClass =
  "static size-10 translate-y-0 rounded-full border-0 bg-white/10 text-white ring-1 ring-white/15 backdrop-blur-md transition-all hover:bg-white hover:text-neutral-900 hover:ring-transparent disabled:opacity-40"

function DealerCard({ dealer }) {
  return (
    <article className="flex h-full flex-col rounded-2xl bg-white p-6 text-neutral-900 shadow-xl">
      <h3 className="text-lg font-semibold tracking-tight">Venu Motors, {dealer.city}</h3>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
        {dealer.state}
      </p>

      {/* `flex-1` pushes the link to the bottom, so every card in the row lines
          its call to action up regardless of how long the address runs. */}
      <p className="mt-4 flex-1 text-sm leading-[1.6] text-neutral-600">{dealer.address}</p>

      <a
        href={dealer.mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group/link mt-6 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
      >
        Get directions
        <ArrowUpRight className="size-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
        <span className="sr-only"> to Venu Motors {dealer.city} on Google Maps</span>
      </a>
    </article>
  )
}

export default function DealerFinder() {
  const ref = useRef(null)
  const [state, setState] = useState("all")
  const [api, setApi] = useState(null)
  const [scrollable, setScrollable] = useState(false)

  const dealers = useMemo(
    () => (state === "all" ? DEALERS : DEALERS.filter((dealer) => dealer.state === state)),
    [state]
  )

  // Same split as the About hero: the headline lifts and fades as the frame
  // scrolls on, handing the photograph over to the locator band underneath.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -80])

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
    <section ref={ref} className="relative w-full overflow-hidden bg-neutral-950">
      {/* One continuous frame spans the headline viewport *and* the locator
          band, so scrolling reveals more of the same showroom rather than
          cutting to a new block. */}
      <img
        src="/dealership/dealership_banner.png"
        alt="The Venu Motors showroom, with scooters parked along the street outside"
        className="absolute inset-0 size-full object-cover"
      />
      {/* The showroom's glass front sits high and bright in this frame, so the
          headline needs its own scrim rather than the top of a gradient spanning
          the whole (much taller) section. */}
      {/* Explicit stops rather than from/via/to: a phone crops this landscape
          frame to the lit glass front, so the scrim has to stay dark through the
          whole copy band instead of fading out halfway down it. */}
      <div className="absolute inset-x-0 top-0 h-[88svh] bg-[linear-gradient(to_bottom,rgba(0,0,0,0.80)_0%,rgba(0,0,0,0.62)_38%,rgba(0,0,0,0.38)_62%,rgba(0,0,0,0)_100%)]" />

      {/* ---- Headline viewport ---- */}
      {/* Copy sits high in the frame so it lands on open sky, clear of the building */}
      <div className="relative flex h-svh min-h-[560px] flex-col items-center justify-start px-6 pt-[22svh] text-center text-white md:pt-[18svh]">
        <motion.div style={{ opacity: headlineOpacity, y: headlineY }}>
          <motion.p
            {...rise(0.05)}
            className="text-[11px] font-semibold tracking-[0.32em] text-white/70 md:text-xs"
          >
            FIND A SHOWROOM
          </motion.p>

          <motion.h1
            {...rise(0.15)}
            className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-[1.15] tracking-tight text-balance sm:text-5xl md:text-6xl"
          >
            Come and take one for a ride.
          </motion.h1>

          <motion.p
            {...rise(0.25)}
            className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg"
          >
            Sit on one, take it round the block, and talk to people who ride them every day.
            Here&rsquo;s where to find us across {DEALER_STATES}.
          </motion.p>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          {...rise(0.5)}
          style={{ opacity: headlineOpacity }}
          className="absolute inset-x-0 bottom-10 flex justify-center"
        >
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="flex size-10 items-center justify-center rounded-full border border-white/30 backdrop-blur-sm"
          >
            <ChevronDown className="size-5 text-white/80" />
          </motion.span>
        </motion.div>
      </div>

      {/* ---- Locator band — the lower half of the same frame ---- */}
      <div id="locations" className="relative scroll-mt-20">
        {/* Dark enough to hold the filter pills, light enough that the street
            stays visible behind the cards — the photo is the point of the band. */}
        {/* On a phone this band opens over the lit shopfront rather than the
            road, so it starts with a little tint to keep the pills legible. */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/45 to-black/70" />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative mx-auto max-w-7xl px-6 pb-16 pt-12 md:pb-24 md:pt-16"
        >
          {/* Remounting on filter change resets the carousel to slide one, so a
              narrowed list never opens scrolled past its only card. */}
          <Carousel key={state} setApi={setApi} opts={{ align: "start" }}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Filter by state — every store is in its own city, so a city
                  filter would only ever narrow six cards down to one. */}
              <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter showrooms by state">
                {DEALER_FILTERS.map((filter) => {
                  const active = state === filter.id
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setState(filter.id)}
                      aria-pressed={active}
                      className={cn(
                        "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-white text-neutral-900"
                          : "bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-md hover:bg-white/20"
                      )}
                    >
                      {filter.label}
                      <span className={cn("ml-1.5", active ? "text-neutral-400" : "text-white/50")}>
                        {filter.count}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className={cn("items-center gap-2", scrollable ? "hidden md:flex" : "hidden")}>
                <CarouselPrevious className={arrowClass} />
                <CarouselNext className={arrowClass} />
              </div>
            </div>

            <CarouselContent className="mt-8">
              {dealers.map((dealer) => (
                <CarouselItem
                  key={dealer.id}
                  className="basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <DealerCard dealer={dealer} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </motion.div>
      </div>
    </section>
  )
}

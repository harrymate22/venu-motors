import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  Gauge,
  Zap,
  BatteryCharging,
  Disc,
  Timer,
  RotateCcw,
  Lightbulb,
  CircleDot,
  Palette,
  Armchair,
  Sparkles,
  KeyRound,
  ShieldCheck,
  Usb,
  Navigation,
  FileCheck,
  PlugZap,
  Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"

const ICONS = {
  Gauge, Zap, BatteryCharging, Disc, Timer, RotateCcw, Lightbulb, CircleDot,
  Palette, Armchair, Sparkles, KeyRound, ShieldCheck, Usb, Navigation, FileCheck, PlugZap,
}

// Woven 3-column mosaic (Ola-style): every column = one tall card (1×2) + one
// short card (1×1), alternating. Placement is explicit so there are no gaps and
// all columns end level. Indices 0/2/4 are the tall slots.
const LAYOUT = [
  "md:col-start-1 md:row-start-1 md:row-span-2", // 0 · tall
  "md:col-start-2 md:row-start-1",               // 1 · short
  "md:col-start-3 md:row-start-1 md:row-span-2", // 2 · tall
  "md:col-start-1 md:row-start-3",               // 3 · short
  "md:col-start-2 md:row-start-2 md:row-span-2", // 4 · tall
  "md:col-start-3 md:row-start-3",               // 5 · short
]
const TALL_SLOTS = new Set([0, 2, 4])

// Ola-style tints — soft card, matching icon chip and colour-keyed subtitle.
// `rose` is our Thunder-branded two-tone accent.
const TINTS = {
  cream: { card: "bg-[#F6F0E6]", chip: "bg-[#EEE1CB] text-[#D0912E]", title: "text-[#2a2621]", sub: "text-[#a98f63]" },
  sky: { card: "bg-[#E7EFF8]", chip: "bg-[#D5E3F4] text-[#3F79BE]", title: "text-[#1f2733]", sub: "text-[#7091b5]" },
  mint: { card: "bg-[#E7F1EB]", chip: "bg-[#D5E9DD] text-[#3F9068]", title: "text-[#212a24]", sub: "text-[#6fa585]" },
  rose: { card: "bg-gradient-to-br from-[#FBE9E7] to-[#F6D9D6]", chip: "bg-[#F6D3CF] text-[#E0362F]", title: "text-[#2a1e1e]", sub: "text-[#c07872]" },
}

function BentoCard({ card, tall = false }) {
  const Icon = ICONS[card.icon] ?? Sparkles

  // Full-bleed photo card — title + subtitle sit at the top over a scrim.
  if (card.image) {
    return (
      <div className="group relative flex size-full flex-col justify-start overflow-hidden rounded-2xl">
        <img
          src={card.image}
          alt=""
          className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Scrim from the top keeps the heading legible over any photo */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent" />
        <div className="relative p-6 md:p-7">
          <h4 className={cn("font-semibold text-white", tall ? "text-2xl md:text-[28px] lg:text-[32px]" : "text-lg")}>
            {card.title}
          </h4>
          <p className="mt-1.5 text-sm text-white/80">{card.subtitle}</p>
        </div>
      </div>
    )
  }

  const t = TINTS[card.tint] ?? TINTS.cream

  return (
    <div
      className={cn(
        "flex size-full flex-col justify-center rounded-2xl p-6 transition-transform duration-200 hover:-translate-y-0.5 md:p-7",
        t.card
      )}
    >
      <div className={cn("flex size-14 items-center justify-center rounded-full", t.chip)}>
        <Icon className="size-7" />
      </div>
      <h4 className={cn("mt-6 text-2xl font-semibold leading-tight md:text-[28px] lg:text-[32px]", t.title)}>
        {card.title}
      </h4>
      <p className={cn("mt-2 text-[15px]", t.sub)}>{card.subtitle}</p>
    </div>
  )
}

// Below `md` we swap the sticky tabs + bento for an accordion + swipeable carousel.
function useIsMobile() {
  const query = "(max-width: 767px)"
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setIsMobile(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])
  return isMobile
}

// Horizontal, scroll-snap carousel — each card peeks the next so it reads as swipeable.
function CardCarousel({ cards }) {
  return (
    <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-6 px-6 pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {cards.map((card) => (
        <div key={card.title} className="h-[360px] w-[80%] shrink-0 snap-start">
          <BentoCard card={card} />
        </div>
      ))}
    </div>
  )
}

function MobileAccordion({ tabs }) {
  const [open, setOpen] = useState(tabs[0]?.id)

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="divide-y divide-neutral-200 border-y border-neutral-200">
        {tabs.map((tab) => {
          const isOpen = open === tab.id
          return (
            <div key={tab.id}>
              <button
                onClick={() => setOpen(isOpen ? null : tab.id)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
                aria-expanded={isOpen}
              >
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-neutral-900">{tab.title}</h3>
                  <p className="mt-1 text-sm text-neutral-500">{tab.subtitle}</p>
                </div>
                <Plus
                  className={cn(
                    "size-6 shrink-0 text-neutral-900 transition-transform duration-300",
                    isOpen && "rotate-45"
                  )}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pt-1">
                      <CardCarousel cards={tab.cards} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DesktopTabs({ tabs }) {
  const [active, setActive] = useState(tabs[0]?.id)

  // Scroll-spy: highlight the tab whose panel sits just below the sticky bar.
  useEffect(() => {
    const els = tabs.map((t) => document.getElementById(t.id)).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: "-130px 0px -55% 0px", threshold: 0 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [tabs])

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })

  return (
    <>
      {/* Sticky tabs — attach under the navbar and travel with this section */}
      <div className="sticky top-16 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollTo(tab.id)}
                className={cn(
                  "relative whitespace-nowrap py-4 text-base font-medium transition-colors md:text-lg",
                  active === tab.id
                    ? "text-neutral-900"
                    : "text-neutral-400 hover:text-neutral-600"
                )}
              >
                {tab.label}
                {active === tab.id && (
                  <motion.span
                    layoutId="feature-tab-underline"
                    className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-neutral-900"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {tabs.map((tab, i) => (
          <div
            key={tab.id}
            id={tab.id}
            className={cn(
              "scroll-mt-[130px]",
              i === 0 ? "mt-16 md:mt-[76px]" : "mt-24 md:mt-[174px]",
              "mb-16 md:mb-[76px]"
            )}
          >
            <h3 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
              {tab.title}
            </h3>
            <p className="mt-2 text-neutral-500">{tab.subtitle}</p>

            <div className="mt-8 grid grid-cols-1 gap-5 md:auto-rows-[250px] md:grid-cols-3">
              {tab.cards.map((card, idx) => (
                <div
                  key={card.title}
                  className={cn("min-h-[220px]", LAYOUT[idx])}
                >
                  <BentoCard card={card} tall={TALL_SLOTS.has(idx)} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default function BikeFeatures({ tabs }) {
  const isMobile = useIsMobile()

  if (!tabs?.length) return null

  return (
    <section className="bg-white">
      {isMobile ? <MobileAccordion tabs={tabs} /> : <DesktopTabs tabs={tabs} />}
    </section>
  )
}

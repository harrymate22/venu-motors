import { useEffect, useState } from "react"
import { motion } from "motion/react"
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
} from "lucide-react"
import { cn } from "@/lib/utils"

const ICONS = {
  Gauge, Zap, BatteryCharging, Disc, Timer, RotateCcw, Lightbulb, CircleDot,
  Palette, Armchair, Sparkles, KeyRound, ShieldCheck, Usb, Navigation, FileCheck, PlugZap,
}

const SPAN = {
  big: "md:col-span-2 md:row-span-2",
  wide: "md:col-span-2",
}

function BentoCard({ card }) {
  const Icon = ICONS[card.icon] ?? Sparkles
  const isBig = card.span === "big"

  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-2xl bg-neutral-100 p-6 transition-colors hover:bg-neutral-200/70",
        SPAN[card.span]
      )}
    >
      <div className="flex size-11 items-center justify-center rounded-full bg-white text-neutral-700 shadow-sm">
        <Icon className="size-5" />
      </div>
      <div className="mt-6">
        <h4
          className={cn(
            "font-semibold text-neutral-900",
            isBig ? "text-xl md:text-2xl" : "text-base md:text-lg"
          )}
        >
          {card.title}
        </h4>
        <p className="mt-1 text-sm text-neutral-500">{card.subtitle}</p>
      </div>
    </div>
  )
}

export default function BikeFeatures({ tabs }) {
  const [active, setActive] = useState(tabs?.[0]?.id)

  // Scroll-spy: highlight the tab whose panel sits just below the sticky bar.
  useEffect(() => {
    if (!tabs?.length) return
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

  if (!tabs?.length) return null

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })

  return (
    <section className="bg-white">
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

            <div className="mt-8 grid auto-rows-[180px] grid-cols-2 gap-4 md:grid-flow-dense md:grid-cols-3">
              {tab.cards.map((card) => (
                <BentoCard key={card.title} card={card} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

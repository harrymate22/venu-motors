import { useRef } from "react"
import { motion, useScroll, useTransform } from "motion/react"
import { ChevronDown } from "lucide-react"

/**
 * Numbers are product facts from the catalogue (see bikes.js) — not usage or
 * company telemetry — so they stay true without needing a "as on <date>"
 * caveat. The range is the best in the line-up (Icon and E-Fly, 60V 42Ah).
 */
const STATS = [
  { value: "80", unit: "km", label: "Range on a single charge" },
  { value: "Zero", label: "Emissions on every ride" },
  { value: "₹0", label: "Licence, RTO & petrol bills" },
]

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: "easeOut" },
})

export default function AboutHero() {
  const ref = useRef(null)

  // Drives the "split": the headline lifts and fades as the frame scrolls on,
  // handing the same photograph over to the stats band below.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -80])

  return (
    <section ref={ref} className="relative w-full overflow-hidden bg-neutral-950">
      {/* One continuous frame spans the headline viewport *and* the stats band,
          so scrolling reveals more of the same photo rather than a new block. */}
      <img
        src="/about-us/about_us.png"
        alt="Venu Motors electric scooters at a mountain pass"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/15 to-transparent" />

      {/* ---- Headline viewport ---- */}
      {/* Copy sits high in the frame so it lands on open sky, clear of the bikes */}
      <div className="relative flex h-svh min-h-[560px] flex-col items-center justify-start px-6 pt-[22svh] text-center text-white md:pt-[18svh]">
        <motion.div style={{ opacity: headlineOpacity, y: headlineY }}>
          <motion.p
            {...rise(0.05)}
            className="text-[11px] font-semibold tracking-[0.32em] text-white/70 md:text-xs"
          >
            ABOUT VENU MOTORS
          </motion.p>

          <motion.h1
            {...rise(0.15)}
            className="mx-auto mt-6 max-w-4xl text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl md:text-6xl"
          >
            Electric mobility that every
            <br className="hidden sm:block" />{" "}
            Indian household can own
          </motion.h1>

          <motion.p
            {...rise(0.25)}
            className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg"
          >
            No licence. No registration. No fuel bills. Just quiet, dependable
            range — built for Indian roads and priced for Indian homes.
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

      {/* ---- Stats band — the lower half of the same frame ---- */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/55 to-black/85" />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 py-14 text-white sm:flex-row sm:justify-center sm:gap-0 md:py-20"
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex-1 text-center sm:px-8 ${
                i > 0 ? "sm:border-l sm:border-white/25" : ""
              }`}
            >
              <p className="text-3xl font-bold tracking-tight md:text-5xl">
                {stat.value}
                {stat.unit && (
                  <span className="ml-1.5 align-baseline text-base font-medium text-white/80 md:text-lg">
                    {stat.unit}
                  </span>
                )}
              </p>
              <p className="mt-2 text-sm text-white/75 md:text-base">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <p className="relative pb-6 pr-6 text-right text-[11px] text-white/45 md:pr-10">
          *Venu Thunder, on a full charge under standard riding conditions
        </p>
      </div>
    </section>
  )
}

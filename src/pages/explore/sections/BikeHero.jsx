import { motion } from "motion/react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
})

export default function BikeHero({ bike }) {
  const { name, eyebrow, price, image, heroLines, heroStats, specNote } = bike

  // No published price yet → send buyers to the enquiry form instead of the
  // configurator, which has no figure to build a booking around.
  const buyTo = price ? `/${bike.slug}/book` : "/#enquire"
  const buyLabel = price ? "Buy Now" : "Enquire now"

  return (
    <section className="relative h-svh min-h-[922px] w-full overflow-hidden bg-neutral-950">
      <img src={image} alt={name} className="absolute inset-0 size-full object-cover" />
      {/* Legibility — darker on the left (text) and along the bottom (stats) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/25 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

      {/* Left content block */}
      <div className="relative z-10 flex h-full max-w-7xl flex-col justify-center px-6 text-white md:px-10 lg:mx-auto">
        <motion.p
          {...rise()}
          className="text-xs font-semibold tracking-[0.28em] text-white/80 md:text-sm"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          {...rise(0.08)}
          className="mt-4 max-w-xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
        >
          {name}
        </motion.h1>
        {/* Three claims, one per line — what powers it, how far it goes, what it
            costs. They carry the price, so there's no separate price paragraph. */}
        <div className="mt-6 max-w-lg space-y-1.5">
          {heroLines.map((line, i) => (
            <motion.p
              key={line}
              {...rise(0.16 + i * 0.06)}
              className="text-base leading-relaxed text-white/85 md:text-lg"
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.div {...rise(0.28)} className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            to={buyTo}
            className="group flex h-14 w-52 items-center justify-center gap-2 rounded-sm bg-white text-lg font-medium text-[#181E22] transition-colors hover:bg-white/90"
          >
            {buyLabel}
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <button className="group flex h-14 w-52 items-center justify-center gap-2 rounded-sm bg-white/10 text-lg font-medium text-white ring-1 ring-white/25 backdrop-blur-sm transition-colors hover:bg-white/20">
            Book a Test Ride
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>

      {/* Bottom stats */}
      <motion.div
        {...rise(0.36)}
        className="absolute inset-x-0 bottom-10 z-10 mx-auto flex max-w-7xl flex-wrap items-end justify-center gap-x-12 gap-y-6 px-6 text-white md:justify-start md:px-10"
      >
        {heroStats.map((stat) => (
          <div key={stat.label} className="text-center md:text-left">
            <p className="text-3xl font-bold md:text-4xl">{stat.value}</p>
            <p className="mt-1 text-sm text-white/70">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {specNote && (
        <span className="absolute bottom-6 right-6 z-10 hidden max-w-xs text-right text-xs text-white/50 lg:block">
          {specNote}
        </span>
      )}
    </section>
  )
}

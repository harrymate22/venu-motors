import { motion } from "motion/react"
import { ArrowRight } from "lucide-react"

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
})

export default function BikeHero({ bike }) {
  const { name, eyebrow, tagline, price, image, heroStats, specNote } = bike

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
        <motion.p
          {...rise(0.16)}
          className="mt-5 max-w-md text-base leading-relaxed text-white/85 md:text-lg"
        >
          {tagline}
        </motion.p>
        <motion.p {...rise(0.2)} className="mt-4 text-lg text-white/90">
          Starting at <span className="text-2xl font-semibold">{price}</span>
          <span className="text-sm text-white/60"> on-road</span>
        </motion.p>

        <motion.div {...rise(0.28)} className="mt-8 flex flex-wrap items-center gap-4">
          <button className="group flex h-14 w-52 items-center justify-center gap-2 rounded-sm bg-white text-lg font-medium text-[#181E22] transition-colors hover:bg-white/90">
            Buy Now
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </button>
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

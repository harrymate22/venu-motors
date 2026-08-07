import { motion } from "motion/react"
import { ArrowRight } from "lucide-react"

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
})

export default function DealershipHero() {
  return (
    <section className="relative flex h-[72svh] min-h-[500px] w-full items-end justify-center overflow-hidden bg-neutral-950 md:h-[78svh]">
      {/* Narrow screens crop to the middle third, which is exactly where the
          signage sits — framing left of it keeps the copy on clean façade. */}
      <img
        src="/dealership/dealership_img1.png"
        alt="A Venu Motors showroom"
        className="absolute inset-0 size-full object-cover object-[22%_center] md:object-[center_75%]"
      />

      {/* Bright daylight shot, so centred white copy needs a real scrim: a flat
          wash, a top/bottom fade that also carries the transparent navbar, and a
          centre vignette — without it the gold VENU MOTORS signage sits right
          behind the headline and bleeds through the letterforms. */}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/65" />
      <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_70%,rgba(0,0,0,0.7),transparent_75%)]" />

      {/* Anchored low rather than dead-centre: on wide screens the signage runs
          straight through the middle band, so the copy sits below it on glass. */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 pb-[6svh] text-center text-white">
        <motion.p
          {...rise()}
          className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/75 md:text-xs"
        >
          Become a Venu Motors partner
        </motion.p>

        <motion.h1
          {...rise(0.08)}
          className="mt-6 text-3xl font-extrabold uppercase leading-[1.1] tracking-tight sm:text-5xl md:text-6xl"
        >
          Bring affordable electric to your city.
        </motion.h1>

        <motion.p
          {...rise(0.16)}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg"
        >
          Every Venu scooter is built in-house at our Dharmavaram plant — and every
          partner is backed with service, spares and training from day one.
        </motion.p>

        <motion.div {...rise(0.26)} className="mt-10 flex justify-center">
          <a
            href="#apply"
            className="group flex h-14 w-full max-w-xs items-center justify-center gap-2 rounded-sm bg-white text-sm font-semibold uppercase tracking-wide text-[#181E22] transition-colors hover:bg-white/90 sm:w-auto sm:px-10"
          >
            Apply for a dealership
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

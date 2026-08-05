import { motion } from "motion/react"

/**
 * Both source photos are portrait, so each gets its own focal point — a plain
 * centre crop would clip the welder's helmet out of frame.
 */
const SHOTS = [
  {
    src: "/about-us/venumotorswarehouse_demo1.png",
    alt: "The Venu Motors manufacturing facility at Dharmavaram",
    focus: "object-center",
  },
  {
    src: "/about-us/aboutus_demo1.png",
    alt: "A technician welding a scooter frame on the assembly line",
    focus: "object-[center_35%]",
  },
]

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" },
}

export default function AboutFacility() {
  // Carries its own top padding — it no longer shares the care section's tinted block.
  return (
    <section id="facility" className="scroll-mt-20 bg-white py-16 md:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.p
          {...fadeUp}
          className="max-w-2xl text-lg leading-[1.6] text-neutral-800 md:text-xl"
        >
          The plant sits in Dharmavaram, Anantapur district, Andhra Pradesh, where
          assembly and final quality checks happen under one roof. Founded by
          engineers from the automotive industry, we put every build through
          durability testing, because a scooter meant to last years on Indian roads
          has to prove it here first.
        </motion.p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 md:mt-14 md:gap-6">
          {SHOTS.map((shot, i) => (
            <motion.div
              key={shot.src}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 + i * 0.1 }}
              className="overflow-hidden rounded-2xl"
            >
              <img
                src={shot.src}
                alt={shot.alt}
                loading="lazy"
                decoding="async"
                className={`h-[320px] w-full object-cover sm:h-[420px] lg:h-[520px] ${shot.focus}`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { motion } from "motion/react"
import { ArrowRight } from "lucide-react"

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" },
}

export default function AboutSection() {
  return (
    <section className="bg-[#F8FBFF] py-16 text-neutral-800 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        {/* Copy */}
        <motion.div {...fadeUp}>
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
            About Us
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-neutral-600">
            At Venu Motors, we're redefining everyday mobility across India with
            affordable, reliable electric scooters like the Thunder. Built for Indian
            roads and made to be owned effortlessly — no registration, no licence, and
            home charging that delivers 65–70 km on a single charge. We're on a mission
            to put clean, silent, and truly practical EVs in every household.
          </p>

          <blockquote className="mt-8 border-l-4 border-neutral-900 pl-5 text-lg font-medium text-neutral-900 md:text-xl">
            Making India's roads cleaner, one Thunder at a time.
          </blockquote>

          <a
            href="#"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
          >
            Learn more
            <ArrowRight className="size-4" />
          </a>
        </motion.div>

        {/* Image */}
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
        >
          <img
            src="/Home-page/aboutus.png"
            alt="Venu Motors electric scooters"
            className="aspect-[4/3] w-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  )
}

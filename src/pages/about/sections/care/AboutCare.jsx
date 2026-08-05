import { motion } from "motion/react"

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" },
}

export default function AboutCare() {
  return (
    <section id="care" className="scroll-mt-20 bg-[#F3F7F9] py-16 md:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.h2
          {...fadeUp}
          className="text-2xl font-semibold leading-[1.35] tracking-tight text-neutral-900 sm:text-3xl md:text-4xl md:leading-[1.3]"
        >
          We care long after the sale.
          <br />
          For every rider. For every road.
        </motion.h2>

        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
          className="mt-10 overflow-hidden rounded-2xl md:mt-14"
        >
          <img
            src="/about-us/careus_demo_img.jpg"
            alt="We Care painted across the wall of the Venu Motors facility"
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full object-cover sm:aspect-[16/9] md:aspect-[16/7]"
          />
        </motion.div>
      </div>
    </section>
  )
}

import { motion } from "motion/react"

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" },
}

export default function AboutPeople() {
  return (
    <section id="people" className="scroll-mt-20 bg-[#F3F7F9] py-16 md:py-24 lg:py-28">
      <div className="mx-auto max-w-5xl px-6">
        {/* Title column, then copy — stacks on mobile, splits 1:2 from md up */}
        <motion.div {...fadeUp} className="grid gap-6 md:grid-cols-3 md:gap-10">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl">
            Our People
          </h2>
          <p className="text-base leading-[1.65] text-neutral-700 md:col-span-2 md:text-lg">
            Venu Motors was started by engineers who had spent years in the automotive
            industry, and that bench still runs the floor today. Around them stand the
            technicians, dealers and suppliers who put a Venu in front of riders across
            Andhra Pradesh — and we measure success by how well that whole chain does.
          </p>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
          className="mt-10 overflow-hidden rounded-2xl md:mt-14"
        >
          <img
            src="/about-us/our_team_demo.png"
            alt="The Venu Motors team together outdoors"
            loading="lazy"
            decoding="async"
            className="aspect-[3/2] w-full object-cover md:aspect-[16/9]"
          />
        </motion.div>
      </div>
    </section>
  )
}

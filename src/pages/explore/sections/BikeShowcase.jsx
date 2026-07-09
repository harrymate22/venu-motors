import { motion } from "motion/react"
import SparkIcon from "@/components/SparkIcon"

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" },
}

export default function BikeShowcase({ showcase }) {
  if (!showcase) return null
  const { title, image, features } = showcase

  return (
    <section className="overflow-hidden bg-white py-16 text-neutral-900 md:py-24">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <motion.h2 {...fadeUp} className="text-xl font-semibold tracking-tight md:text-2xl">
          {title}
        </motion.h2>

        <motion.img
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
          src={image}
          alt={title}
          className="mx-auto mt-4 w-full"
        />

        <motion.ul
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.2 }}
          className="mt-4 grid grid-cols-2 gap-x-6 gap-y-8 md:mt-8 md:grid-cols-4"
        >
          {features.map((feature) => (
            <li key={feature} className="flex flex-col items-center gap-6">
              <SparkIcon className="size-7" />
              <span className="max-w-[20rem] text-xl font-semibold leading-snug text-[#181E22] md:text-[28px]">
                {feature}
              </span>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}

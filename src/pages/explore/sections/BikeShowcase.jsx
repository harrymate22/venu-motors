import { motion } from "motion/react"
import { Sparkle } from "lucide-react"

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
      <div className="mx-auto max-w-6xl px-6 text-center">
        <motion.h2 {...fadeUp} className="text-xl font-semibold tracking-tight md:text-2xl">
          {title}
        </motion.h2>

        <motion.img
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
          src={image}
          alt={title}
          className="mx-auto mt-4 w-full max-w-4xl"
        />

        <motion.ul
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.2 }}
          className="mt-4 grid grid-cols-2 gap-x-6 gap-y-8 md:mt-8 md:grid-cols-4"
        >
          {features.map((feature) => (
            <li key={feature} className="flex flex-col items-center gap-3">
              <Sparkle className="size-5 fill-red-500 text-red-500" />
              <span className="max-w-[12rem] text-sm font-medium text-neutral-700 md:text-base">
                {feature}
              </span>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}

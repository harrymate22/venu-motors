import { motion } from "motion/react"
import { ArrowRight } from "lucide-react"

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" },
}

export default function BikeService({ service }) {
  if (!service?.cards?.length) return null
  const { heading, subtitle, cards } = service

  return (
    <section className="bg-[#F8FBFF] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div {...fadeUp}>
          <h2 className="text-4xl font-bold leading-[1.1] tracking-tight text-neutral-900 sm:text-5xl lg:text-[54px]">
            {heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-5 max-w-xl text-base text-neutral-500 md:text-lg">{subtitle}</p>
        </motion.div>

        <div className="mt-12 grid gap-8 sm:grid-cols-3 md:mt-16">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 + i * 0.08 }}
            >
              <img
                src={card.image}
                alt={card.title}
                className="aspect-[402/330] w-full rounded-2xl object-cover"
              />
              <h3 className="mt-5 text-lg font-semibold text-neutral-900">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">{card.desc}</p>
              <a
                href={card.href}
                className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#D42A2A]"
              >
                {card.linkLabel}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

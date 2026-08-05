import { motion } from "motion/react"
import { ArrowRight } from "lucide-react"
import { NEWS } from "./news"

/** Below this many stories there's nothing worth linking on to. */
const READ_MORE_THRESHOLD = 4

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" },
}

function NewsItem({ item }) {
  const meta = [item.source, item.year].filter(Boolean).join(" · ")

  return (
    <a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-start gap-5 md:gap-6"
    >
      {/* Publication mark — contained on white so a square logo stays whole */}
      <div className="w-[110px] shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-black/[0.06] sm:w-[140px] md:w-[165px]">
        <img
          src={item.logo}
          alt={item.source}
          loading="lazy"
          decoding="async"
          className="aspect-[3/2] w-full object-contain p-3"
        />
      </div>

      <div className="min-w-0">
        <p className="text-sm text-neutral-500">{meta}</p>
        <h3 className="mt-1.5 line-clamp-3 text-base font-medium leading-snug text-neutral-900 transition-colors group-hover:text-neutral-600 md:text-lg">
          {item.title}
        </h3>
      </div>
    </a>
  )
}

export default function NewsroomSection() {
  return (
    <section id="newsroom" className="scroll-mt-20 bg-[#F3F7F9] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.h2
          {...fadeUp}
          className="text-2xl font-bold tracking-tight text-neutral-900 md:text-4xl"
        >
          Newsroom
        </motion.h2>

        <div className="mt-10 grid gap-x-10 gap-y-8 md:mt-12 md:grid-cols-2">
          {NEWS.map((item, i) => (
            <motion.div
              key={item.id}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.06 * i }}
              /* Rule off between rows: every item past the first, then undo it
                 for the second card once the grid splits into two columns. */
              className={[
                i >= 1 ? "border-t border-black/[0.08] pt-8" : "",
                i < 2 ? "md:border-t-0 md:pt-0" : "",
              ].join(" ")}
            >
              <NewsItem item={item} />
            </motion.div>
          ))}
        </div>

        {NEWS.length >= READ_MORE_THRESHOLD && (
          <a
            href="#"
            className="group mt-10 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
          >
            Read More
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </a>
        )}
      </div>
    </section>
  )
}

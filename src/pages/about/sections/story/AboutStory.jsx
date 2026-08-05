import { useRef } from "react"
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react"

/**
 * Condensed from the client's About Us copy on venumotors.com — the
 * Dharmavaram facility, the in-house chassis/motor/controller/suspension
 * engineering, and the "high value for money" promise from the vision
 * statement, rewritten as one statement that reads aloud cleanly.
 *
 * Split into a lead line and a supporting paragraph so the block has a shape
 * to read into, rather than one uniform slab of large type.
 */
const RAW_BLOCKS = [
  {
    text: "We are an electric two-wheeler manufacturer building for Indian roads.",
    className:
      "text-[1.75rem] font-semibold leading-[1.3] sm:text-4xl md:text-[2.75rem] md:leading-[1.25]",
  },
  {
    text:
      "Our engineers design the chassis, motor, controller and suspension in-house " +
      "at Dharmavaram - because a vehicle made for India should be proven in India.",
    className: "mt-8 text-lg font-normal leading-[1.6] sm:text-xl md:mt-10 md:text-2xl",
  },
  {
    text:
      "The result is transport that is affordable, built to last and genuinely " +
      "clean: value that earns its place in every Indian household.",
    className: "mt-5 text-lg font-normal leading-[1.6] sm:text-xl md:mt-6 md:text-2xl",
  },
]

/**
 * Flatten to one continuous word sequence so the reveal reads straight through
 * the blocks instead of restarting at each paragraph.
 */
let cursor = 0
const BLOCKS = RAW_BLOCKS.map((block) => {
  const words = block.text.split(" ")
  const start = cursor
  cursor += words.length
  return { ...block, words, start }
})
const TOTAL_WORDS = cursor

/** Last word lands at 85% of the window, leaving a beat of fully-inked text. */
const REVEAL_SPAN = 0.85

/**
 * One word, darkening from near-invisible to full ink across its slice of scroll.
 * The gap is a real space rather than a margin — a margin would survive at line
 * ends and knock centred lines off-axis.
 */
function Word({ children, progress, range, alwaysInk }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return (
    <>
      <span className="inline-block">
        <motion.span style={{ opacity: alwaysInk ? 1 : opacity }}>{children}</motion.span>
      </span>{" "}
    </>
  )
}

export default function AboutStory() {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()

  // Reveal starts as the block enters from the bottom and finishes while it is
  // still fully in view — never chasing text that has scrolled past.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.75"],
  })

  return (
    <section id="story" className="scroll-mt-20 bg-white py-24 md:py-36 lg:py-44">
      <div ref={ref} className="mx-auto max-w-3xl px-6 text-center text-neutral-900">
        <p className="mb-10 text-[11px] font-semibold tracking-[0.32em] text-neutral-400 md:mb-14">
          OUR STORY
        </p>

        {BLOCKS.map((block, b) => (
          <p key={b} className={`tracking-tight text-balance ${block.className}`}>
            {block.words.map((word, i) => (
              <Word
                key={`${word}-${i}`}
                progress={scrollYProgress}
                range={[
                  ((block.start + i) / TOTAL_WORDS) * REVEAL_SPAN,
                  ((block.start + i + 1) / TOTAL_WORDS) * REVEAL_SPAN,
                ]}
                alwaysInk={reduceMotion}
              >
                {word}
              </Word>
            ))}
          </p>
        ))}
      </div>
    </section>
  )
}

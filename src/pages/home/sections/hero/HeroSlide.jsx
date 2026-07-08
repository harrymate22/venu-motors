import { Fragment } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import HeroButton from "./HeroButton"

/** Staggered fade-up that (re)plays whenever the slide becomes active. */
const rise = (active, delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
})

/** Brand-style eyebrow ("VENU INSIDERS") with the first word emphasised. */
function BrandEyebrow({ text }) {
  const [first, ...rest] = text.split(" ")
  return (
    <>
      <span className="font-bold">{first}</span>
      {rest.length > 0 && ` ${rest.join(" ")}`}
    </>
  )
}

export default function HeroSlide({ slide, active }) {
  const { image, alt, eyebrow, title, description, buttons, specs, footnote, align } = slide
  const isLeft = align === "left"

  return (
    <div className="relative h-svh min-h-[640px] w-full overflow-hidden">
      <img src={image} alt={alt} className="absolute inset-0 size-full object-cover" />

      {/* Legibility overlay — biased to the text side */}
      <div
        className={cn(
          "absolute inset-0",
          isLeft
            ? "bg-gradient-to-r from-black/75 via-black/35 to-transparent"
            : "bg-gradient-to-b from-black/45 via-black/10 to-black/30"
        )}
      />

      {/* Content block */}
      <div
        className={cn(
          "relative z-10 flex h-full flex-col px-6 text-white",
          isLeft
            ? "items-start justify-center text-left md:px-16 lg:px-24"
            : "items-center pt-16 text-center md:pt-20"
        )}
      >
        {eyebrow && (
          <motion.p
            {...rise(active)}
            className={cn(
              isLeft
                ? "text-xl tracking-wide md:text-2xl"
                : "text-xs font-semibold tracking-[0.25em] text-white/90 md:text-sm"
            )}
          >
            {isLeft ? <BrandEyebrow text={eyebrow} /> : eyebrow}
          </motion.p>
        )}

        <motion.h1
          {...rise(active, 0.08)}
          className={cn(
            "mt-4 font-semibold tracking-tight",
            isLeft
              ? "text-4xl leading-[1.08] sm:text-5xl md:text-6xl"
              : "text-4xl leading-tight md:text-5xl"
          )}
        >
          {title.map((line, i) => (
            <Fragment key={i}>
              {line}
              {i < title.length - 1 && <br />}
            </Fragment>
          ))}
        </motion.h1>

        {description && (
          <motion.p
            {...rise(active, 0.16)}
            className={cn(
              "max-w-xl leading-relaxed text-white/90",
              isLeft ? "mt-6 text-base md:text-lg" : "mt-5 text-base font-normal md:text-lg"
            )}
          >
            {description.map((line, i) => (
              <Fragment key={i}>
                {line}
                {i < description.length - 1 && <br />}
              </Fragment>
            ))}
          </motion.p>
        )}

        <motion.div
          {...rise(active, 0.24)}
          className={cn(
            "mt-8 flex flex-wrap items-center gap-4",
            isLeft ? "justify-start" : "justify-center"
          )}
        >
          {buttons.map((btn) => (
            <HeroButton key={btn.label} label={btn.label} variant={btn.variant} />
          ))}
        </motion.div>
      </div>

      {/* Bottom spec bar */}
      {specs && (
        <motion.div
          {...rise(active, 0.32)}
          className="absolute inset-x-0 bottom-20 z-10 flex flex-col items-center gap-3 px-6 text-white md:bottom-24"
        >
          <h2 className="text-xl font-semibold md:text-2xl">{specs.name}</h2>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-white/85 md:text-base">
            {specs.items.map((item, i) => (
              <Fragment key={item}>
                {i > 0 && <span className="text-white/30">|</span>}
                <span>{item}</span>
              </Fragment>
            ))}
          </div>
        </motion.div>
      )}

      {footnote && (
        <span className="absolute bottom-8 right-6 z-10 text-xs text-white/60">
          {footnote}
        </span>
      )}
    </div>
  )
}

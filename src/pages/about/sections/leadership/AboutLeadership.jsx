import { motion } from "motion/react"

/**
 * The founder's profile, supplied by the client. Kept close to the original
 * wording — only the duplicated recap and sign-off at the end of the source
 * copy are dropped, since the portrait's nameplate and the closing quote
 * already carry his name and title.
 *
 * "Venu Motors" is spelled as two words throughout the site (see AboutPeople,
 * DealershipHero, faqs.js), so the client's "Venumotors" is normalised here.
 */
const CEO = {
  name: "Devisetti Venu Gopal",
  role: "CEO, Venu Motors",
  image: "/about-us/ceo_img1.png",
  alt: "Devisetti Venu Gopal, CEO of Venu Motors",
}

const JOURNEY = [
  "Mr. Devisetti Venu Gopal, CEO of Venu Motors, is an inspiring example of how vision, determination and relentless hard work can transform humble beginnings into extraordinary achievements.",
  "Coming from an ordinary family, his entrepreneurial journey began with a small shop and a big dream. With limited resources but strong determination, he embraced every challenge as an opportunity to learn, grow and move forward.",
  "His success was not built overnight. It was shaped by years of hard work, perseverance, calculated decisions and an unwavering belief in his vision.",
  "From those humble beginnings, he expanded into the electric mobility sector and became the driving force behind Venu Motors, an electric two-wheeler manufacturer with a growing presence across South India.",
]

const VISION = [
  "Mr. Venu Gopal believes that success is not defined by where you start, but by how far you are willing to go. His leadership is driven by innovation, quality, customer satisfaction and continuous growth.",
  "His vision goes beyond manufacturing electric vehicles — it is about building a strong, trusted and sustainable future in electric mobility.",
  "Today, he continues to lead with the same ambition that started his journey: to dream bigger, work harder and build a better future.",
]

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" },
}

export default function AboutLeadership() {
  return (
    // Tinted so the page keeps alternating: Story (white) → Leadership → the
    // Dharmavaram facility (white) → Our People (tinted).
    <section id="leadership" className="scroll-mt-20 bg-[#F3F7F9] py-16 md:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header spans both columns so the headline sets up the portrait and
            the copy at once, rather than sitting inside one of them. */}
        <motion.div {...fadeUp} className="max-w-3xl">
          <p className="text-[11px] font-semibold tracking-[0.32em] text-neutral-400">
            LEADERSHIP
          </p>
          <h2 className="mt-5 text-2xl font-semibold leading-[1.3] tracking-tight text-neutral-900 text-balance sm:text-3xl md:text-4xl">
            From a small shop to a visionary leader.
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12 md:gap-12 lg:gap-16">
          {/* Portrait leads on mobile — you meet him before reading about him —
              and moves to the right column from md up. The sticky wrapper is
              kept free of transforms, so the reveal animates the frame inside. */}
          <div className="order-1 self-start md:order-2 md:col-span-5 md:sticky md:top-24">
            <motion.figure {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
              {/* White frame reads against the tinted section while the photo loads */}
              <div className="overflow-hidden rounded-2xl bg-white">
                <img
                  src={CEO.image}
                  alt={CEO.alt}
                  loading="lazy"
                  decoding="async"
                  /* Framed from the top: he sits high in the source photo, so a
                     centre crop would take the top of his head off. */
                  className="aspect-[3/4] w-full object-cover object-top"
                />
              </div>
              <figcaption className="mt-5">
                <p className="text-base font-semibold tracking-tight text-neutral-900">
                  {CEO.name}
                </p>
                <p className="mt-1 text-sm text-neutral-500">{CEO.role}</p>
              </figcaption>
            </motion.figure>
          </div>

          {/* The story — the long column, which is what the portrait sticks past */}
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.05 }}
            className="order-2 md:order-1 md:col-span-7"
          >
            <div className="space-y-5 text-base leading-[1.7] text-neutral-700 md:text-lg">
              {JOURNEY.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <h3 className="mt-10 text-lg font-semibold tracking-tight text-neutral-900 md:mt-12 md:text-xl">
              Leadership with a vision
            </h3>
            <div className="mt-5 space-y-5 text-base leading-[1.7] text-neutral-700 md:text-lg">
              {VISION.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </motion.div>
        </div>

        {/* His own words close the section, clear of both columns */}
        <motion.figure
          {...fadeUp}
          className="mt-16 border-t border-neutral-200 pt-10 md:mt-20 md:pt-14"
        >
          <blockquote className="mx-auto max-w-3xl text-center text-xl font-medium leading-[1.45] tracking-tight text-neutral-900 text-balance sm:text-2xl md:text-[28px]">
            &ldquo;Your beginning does not define your destination. Your vision, determination and
            actions do.&rdquo;
          </blockquote>
          <figcaption className="mt-6 text-center text-sm text-neutral-500">
            {CEO.name} &middot; {CEO.role}
          </figcaption>
        </motion.figure>
      </div>
    </section>
  )
}

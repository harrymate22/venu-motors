import { motion } from "motion/react"
import { Wrench, IndianRupee, FileCheck, Ruler, Signpost, PanelTop } from "lucide-react"

/**
 * The six criteria a partner must meet, stated plainly before the form rather
 * than after it — a candidate who can't meet them finds out here instead of
 * three conversations in.
 */
const REQUIREMENTS = [
  {
    icon: Wrench,
    title: "A qualified technician",
    detail: "A trained service technician on your team from the day you open.",
  },
  {
    icon: IndianRupee,
    title: "₹10 lakh minimum investment",
    detail: "Covers initial stock, showroom setup and working capital.",
  },
  {
    icon: FileCheck,
    title: "Valid GST registration",
    detail: "Registered in your business name before onboarding begins.",
  },
  {
    icon: Ruler,
    title: "Showroom of 15 × 40 ft",
    detail: "The minimum floor area to display and demo the full range.",
  },
  {
    icon: Signpost,
    title: "Road-facing premises",
    detail: "Direct street frontage, so walk-in customers can find you.",
  },
  {
    icon: PanelTop,
    title: "Company-standard name board",
    detail: "Signage built to the Venu Motors design specification.",
  },
]

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" },
}

export default function DealershipRequirements() {
  return (
    <section id="requirements" className="scroll-mt-20 bg-white py-16 text-[#2b2b2b] md:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        {/* Lead — centred and unhurried, so the requirements read as candour
            rather than a checklist thrown at the reader. */}
        <motion.div
          {...fadeUp}
          className="mx-auto max-w-3xl space-y-6 text-center text-base leading-relaxed md:text-lg"
        >
          <p>
            Venu Motors builds every scooter in-house at Dharmavaram, then hands it to
            partners who know their own city far better than we do. That only works when
            both sides are properly set up — so we'd rather be upfront about what a
            dealership takes.
          </p>
          <p>
            These are the six things every Venu dealership starts with. Check them
            against your plans before you apply; there is nothing here that will surprise
            you later.
          </p>
        </motion.div>

        <motion.h2
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.08 }}
          className="mt-14 text-center text-xl font-semibold tracking-tight md:mt-20 md:text-2xl"
        >
          What a Venu dealership needs
        </motion.h2>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 md:mt-10 lg:grid-cols-3">
          {REQUIREMENTS.map(({ icon: Icon, title, detail }, i) => (
            <motion.div
              key={title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 + i * 0.06 }}
              className="rounded-2xl p-6 ring-1 ring-[#2b2b2b]/10 transition-shadow hover:shadow-md"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-[#2b2b2b]/[0.06]">
                <Icon className="size-5 text-[#2b2b2b]" strokeWidth={1.75} />
              </span>
              <h3 className="mt-5 text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#2b2b2b]/70">{detail}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.15 }}
          className="mt-14 text-center md:mt-20"
        >
          <p className="mx-auto max-w-2xl text-base leading-relaxed md:text-lg">
            If that lines up with where you are, share your details and our team will take
            it from there.
          </p>

          <a
            href="#apply"
            className="mt-8 inline-flex h-13 items-center justify-center rounded-sm border border-[#2b2b2b] px-10 text-sm font-semibold text-[#2b2b2b] transition-colors hover:bg-[#2b2b2b] hover:text-white"
          >
            Take the next step
          </a>
        </motion.div>
      </div>
    </section>
  )
}

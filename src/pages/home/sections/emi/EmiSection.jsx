import { motion } from "motion/react"
import { ArrowRight, CalendarClock, Percent, Wallet, ReceiptText } from "lucide-react"
import { Button } from "@/components/ui/button"

const STATS = [
  { icon: CalendarClock, label: "Tenure up to", value: "60 Months" },
  { icon: Percent, label: "Lowest rate of interest", value: "6.99%" },
  { icon: Wallet, label: "Downpayment", value: "Starts at ₹0" },
  { icon: ReceiptText, label: "Processing fee", value: "Zero" },
]

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" },
}

export default function EmiSection() {
  return (
    <section className="bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 py-16 text-neutral-800 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        {/* Left — copy + CTA */}
        <motion.div {...fadeUp}>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-neutral-900 md:text-4xl lg:text-5xl">
            Plan your ride with{" "}
            <span className="text-emerald-600">Easy EMIs</span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-neutral-600 md:text-lg">
            Use our EMI calculator to estimate your monthly payments and find the
            Venu Thunder that fits your budget.
          </p>
          <Button className="mt-8 h-12 gap-2 bg-neutral-900 px-8 text-base hover:bg-neutral-800">
            Calculate your EMI
            <ArrowRight className="size-5" />
          </Button>
        </motion.div>

        {/* Right — elevated stats card */}
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
          className="overflow-hidden rounded-3xl border border-emerald-100"
        >
          <div className="grid gap-px bg-emerald-100 sm:grid-cols-2">
            {STATS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4 bg-white p-6">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">{label}</p>
                  <p className="mt-1 text-lg font-semibold text-emerald-600">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

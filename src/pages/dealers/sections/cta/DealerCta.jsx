import { Link } from "react-router-dom"
import { motion } from "motion/react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DEALERS } from "../../dealers"

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" },
}

/**
 * Closes the locator by pointing anyone who couldn't find a showroom near them
 * at the existing dealership application form, rather than leaving the page on
 * "we're not in your town yet".
 */
export default function DealerCta() {
  return (
    <section className="bg-[#F3F7F9] py-16 md:py-24">
      <motion.div {...fadeUp} className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-[11px] font-semibold tracking-[0.32em] text-neutral-400">
          PARTNER WITH US
        </p>
        <h2 className="mt-5 text-2xl font-semibold leading-[1.3] tracking-tight text-neutral-900 text-balance sm:text-3xl md:text-4xl">
          No showroom near you yet? Open one.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-[1.65] text-neutral-600 md:text-lg">
          We&rsquo;re {DEALERS.length} showrooms in and still growing. If you know your town and
          want to put Venu Motors in it, we&rsquo;d like to hear from you.
        </p>

        <Button asChild className="group mt-8 h-12 gap-2 px-6 text-base">
          <Link to="/dealership">
            Apply for a dealership
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </motion.div>
    </section>
  )
}

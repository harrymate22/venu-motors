import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Plus, Minus } from "lucide-react"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { FAQS } from "./faqs"

export default function FaqSection() {
  const [open, setOpen] = useState(true)

  return (
    <section className="bg-[#F5F6F7] py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm md:p-10">
          {/* Whole-section toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex w-full items-center justify-between gap-4 text-left"
          >
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 md:text-2xl">
              Frequently asked questions
            </h2>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full text-neutral-700">
              {open ? <Minus className="size-5" /> : <Plus className="size-5" />}
            </span>
          </button>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <Accordion type="single" collapsible className="mt-4 md:mt-6">
                  {FAQS.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id} className="border-neutral-200">
                      <AccordionTrigger className="py-5 text-base font-semibold text-neutral-900 hover:no-underline md:text-lg">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="pb-5 pr-8 text-[15px] leading-relaxed text-neutral-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

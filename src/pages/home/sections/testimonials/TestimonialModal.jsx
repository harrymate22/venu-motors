import { useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { X } from "lucide-react"

export default function TestimonialModal({ testimonial, onClose }) {
  useEffect(() => {
    if (!testimonial) return
    const onKey = (e) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [testimonial, onClose])

  return (
    <AnimatePresence>
      {testimonial && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
            initial={{ scale: 0.9, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 8 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
          >
            <div className="relative aspect-[4/3] w-full bg-neutral-950">
              {testimonial.video ? (
                <video
                  src={testimonial.video}
                  controls
                  autoPlay
                  className="size-full object-cover"
                />
              ) : (
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="size-full object-cover"
                />
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70"
            >
              <X className="size-5" />
            </button>

            <div className="p-6 text-center">
              <blockquote className="text-base leading-relaxed text-neutral-700">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="mx-auto mt-4 h-0.5 w-8 rounded-full bg-emerald-500" />
              <p className="mt-4 font-semibold text-neutral-900">{testimonial.name}</p>
              <p className="text-sm text-neutral-500">{testimonial.location}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

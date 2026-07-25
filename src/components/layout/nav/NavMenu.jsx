import { useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "motion/react"
import { ChevronRight, Phone, X } from "lucide-react"
import { E_SCOOTERS, MENU_LINKS, PHONE, PHONE_HREF } from "./navigation"

const SectionLabel = ({ children }) => (
  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">{children}</p>
)

export default function NavMenu({ open, onClose }) {
  const { key } = useLocation()

  // Close on Escape and lock background scroll while the overlay is up.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  // Any navigation dismisses the menu — including a repeat click on the link
  // for the page you're already on, which `onClick` alone wouldn't catch.
  useEffect(() => {
    if (open) onClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="nav-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-0 z-[60] overflow-y-auto bg-neutral-950 text-white"
        >
          {/* Top bar — mirrors the site header so the swap feels in place */}
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
            <Link
              to="/"
              onClick={onClose}
              className="select-none text-xl font-extrabold tracking-[0.18em] text-white"
            >
              VENU<span className="font-medium text-white/70"> MOTORS</span>
            </Link>
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="flex size-11 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="size-6" />
            </button>
          </div>

          <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-16 md:grid-cols-[minmax(0,1fr)_20rem] md:gap-14 md:px-10 lg:gap-20">
            {/* ---- Our bikes ---- */}
            <div>
              <SectionLabel>E-Scooters</SectionLabel>

              {/* Thumbnails from md up */}
              <div className="mt-6 hidden gap-x-6 gap-y-8 md:grid md:grid-cols-3 lg:grid-cols-5">
                {E_SCOOTERS.map((bike) => (
                  <Link key={bike.id} to={bike.href} onClick={onClose} className="group text-center">
                    <div className="overflow-hidden rounded-2xl bg-white/[0.04] ring-1 ring-white/10 transition-all group-hover:ring-white/30">
                      <img
                        src={bike.image}
                        alt={`Venu ${bike.name}`}
                        className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-3 text-sm font-medium text-white/90 transition-colors group-hover:text-white">
                      {bike.name}
                    </p>
                  </Link>
                ))}
              </div>

              {/* Text-only list on phones — images are dead weight at this size */}
              <ul className="mt-3 divide-y divide-white/10 md:hidden">
                {E_SCOOTERS.map((bike) => (
                  <li key={bike.id}>
                    <Link
                      to={bike.href}
                      onClick={onClose}
                      className="flex items-center justify-between py-3.5 text-lg font-medium text-white/90 transition-colors hover:text-white"
                    >
                      {bike.name}
                      <ChevronRight className="size-4 shrink-0 text-white/40" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ---- Pages + contact ---- */}
            <div className="md:border-l md:border-white/10 md:pl-14 lg:pl-20">
              <SectionLabel>Menu</SectionLabel>
              <ul className="mt-4 md:mt-6">
                {MENU_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      onClick={onClose}
                      className="block py-2.5 text-lg text-white/80 transition-colors hover:text-white md:py-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3">
                <Link
                  to="/#enquire"
                  onClick={onClose}
                  className="flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-neutral-900 transition-colors hover:bg-white/90"
                >
                  Book a Test Ride
                </Link>
                <a
                  href={PHONE_HREF}
                  className="flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold text-white ring-1 ring-white/20 transition-colors hover:bg-white/10"
                >
                  <Phone className="size-4" />
                  {PHONE}
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

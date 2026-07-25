import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import { ChevronDown, Menu } from "lucide-react"
import NavMenu from "./nav/NavMenu"
import { MENU_LINKS } from "./nav/navigation"

/** Inline links for the scrolled bar — Home lives on the wordmark. */
const BAR_LINKS = MENU_LINKS.filter((link) => link.href !== "/")

function Logo() {
  return (
    <Link to="/" className="select-none text-xl font-extrabold tracking-[0.18em] text-white">
      VENU<span className="font-medium text-white/70"> MOTORS</span>
    </Link>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <AnimatePresence mode="wait" initial={false}>
          {scrolled ? (
            /* ---- Scrolled: solid dark bar with full navigation ---- */
            <motion.nav
              key="full"
              initial={{ y: -72, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -72, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex h-16 items-center justify-between gap-6 border-b border-white/10 bg-neutral-950/95 px-6 backdrop-blur-md md:px-10"
            >
              <div className="flex items-center gap-10">
                <Logo />
                <ul className="hidden items-center gap-8 lg:flex">
                  {/* E-Scooters opens the full menu, where the bikes live */}
                  <li>
                    <button
                      onClick={() => setMenuOpen(true)}
                      className="flex items-center gap-1 text-sm font-medium text-white/90 transition-colors hover:text-white"
                    >
                      E-Scooters
                      <ChevronDown className="size-4 text-white/60" />
                    </button>
                  </li>
                  {BAR_LINKS.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-sm font-medium text-white/90 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-8">
                <Link
                  to="/#enquire"
                  className="hidden text-sm font-medium text-white/90 transition-colors hover:text-white lg:inline"
                >
                  Test Ride
                </Link>
                <Link
                  to="/thunder/book"
                  className="text-sm font-semibold text-emerald-400 transition-colors hover:text-emerald-300"
                >
                  Order now
                </Link>
                <button
                  onClick={() => setMenuOpen(true)}
                  aria-label="Open menu"
                  className="text-white transition-colors hover:text-white/70"
                >
                  <Menu className="size-6" />
                </button>
              </div>
            </motion.nav>
          ) : (
            /* ---- Top: transparent, minimal (logo + circular menu) ---- */
            <motion.nav
              key="minimal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex h-20 items-center justify-between px-6 md:px-10"
            >
              <Logo />
              <button
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                className="flex size-11 items-center justify-center rounded-full bg-white text-neutral-900 shadow-md transition-transform hover:scale-105"
              >
                <Menu className="size-5" />
              </button>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <NavMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}

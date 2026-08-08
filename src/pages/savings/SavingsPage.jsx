import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu } from "lucide-react"
import NavMenu from "@/components/layout/nav/NavMenu"
import SavingsCalculator from "./sections/SavingsCalculator"

/** Same wordmark treatment as the configurator, light for the photo behind it. */
function Logo() {
  return (
    <Link to="/" className="select-none text-xl font-extrabold tracking-[0.18em] text-white">
      VENU<span className="font-medium text-white/70"> MOTORS</span>
    </Link>
  )
}

/**
 * Focused tool page, laid out like the booking configurator: locked to the
 * viewport from `lg` up with the photo fixed on the left and the calculator
 * scrolling inside its own column. Below `lg` it falls back to a normal
 * document scroll — pinning a tall form on a phone would trap the user.
 *
 * There's no site navbar here, so the page carries its own menu trigger: over
 * the photo on small screens where it stays in reach, and in the panel header
 * on desktop, matching the split-screen reference.
 */
export default function SavingsPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  const menuButton = (className, iconClass) => (
    <button
      onClick={() => setMenuOpen(true)}
      aria-label="Open menu"
      className={className}
    >
      <Menu className={iconClass} />
    </button>
  )

  return (
    <>
      {/* `lg:fixed inset-0` pins the whole screen: the body then has no height
          of its own, so no stray descendant can give the document scroll. */}
      <div className="flex min-h-svh flex-col lg:fixed lg:inset-0 lg:h-svh lg:flex-row lg:overflow-hidden">
        {/* Left — photo */}
        <div className="relative h-[38svh] min-h-[240px] bg-neutral-100 lg:h-auto lg:flex-1">
          <img
            src="/dealership/designbikes_img.png"
            alt="Two Venu Motors electric scooters"
            className="absolute inset-0 size-full object-cover"
          />
          {/* Scrim so the wordmark holds against the sky */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/45 to-transparent" />

          <div className="absolute inset-x-6 top-6 flex items-center justify-between lg:inset-x-8 lg:top-8 lg:justify-start">
            <Logo />
            {menuButton(
              "flex size-11 items-center justify-center rounded-full bg-white text-neutral-900 shadow-md transition-transform hover:scale-105 lg:hidden",
              "size-5"
            )}
          </div>
        </div>

        {/* Right — the only scrolling region on desktop */}
        <div className="w-full border-t border-neutral-200 bg-white lg:w-[560px] lg:overflow-y-auto lg:border-l lg:border-t-0">
          {/* Panel header — stays put while the calculator scrolls under it */}
          <div className="sticky top-0 z-10 hidden justify-end bg-white px-12 pb-4 pt-8 lg:flex">
            {menuButton(
              "text-neutral-900 transition-colors hover:text-neutral-500",
              "size-6"
            )}
          </div>

          <div className="px-6 pb-12 pt-10 lg:px-12 lg:pb-16 lg:pt-2">
            <SavingsCalculator />
          </div>
        </div>
      </div>

      <NavMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}

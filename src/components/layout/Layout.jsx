import { useEffect, Suspense } from "react"
import { Outlet, useLocation } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import RouteFallback from "./RouteFallback"

/**
 * Scroll management for client-side routing — the browser only does this for
 * real document loads. Land at the top of a new page, or on the anchor target
 * when the URL carries a hash (e.g. the nav's /#about, /#enquire).
 *
 * `key` is in the deps so clicking the same link twice scrolls again rather than
 * appearing to do nothing.
 */
function ScrollManager() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }

    // Wait a frame so the target is mounted after a route change.
    const raf = requestAnimationFrame(() => {
      let target = null
      try {
        target = document.querySelector(hash)
      } catch {
        // Not a usable selector — nothing to scroll to.
      }
      target?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
    return () => cancelAnimationFrame(raf)
  }, [pathname, hash, key])

  return null
}

export default function Layout() {
  return (
    <>
      <ScrollManager />
      <Navbar />
      {/* Nav and footer stay mounted while the route's chunk downloads */}
      <Suspense fallback={<RouteFallback />}>
        <Outlet />
      </Suspense>
      <Footer />
    </>
  )
}

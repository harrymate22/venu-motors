import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "@/components/layout/Layout"
import RouteFallback from "@/components/layout/RouteFallback"

/**
 * Routes are split so a visitor only downloads the page they asked for. The
 * configurator in particular carries its own weight and most visitors never
 * open it. Layout renders its own <Suspense> around the outlet, so the navbar
 * and footer stay put while a page chunk loads.
 */
const HomePage = lazy(() => import("@/pages/home/HomePage"))
const AboutPage = lazy(() => import("@/pages/about/AboutPage"))
const DealershipPage = lazy(() => import("@/pages/dealership/DealershipPage"))
const BikePage = lazy(() => import("@/pages/explore/BikePage"))
const BookingPage = lazy(() => import("@/pages/explore/BookingPage"))

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about-us" element={<AboutPage />} />
          <Route path="dealership" element={<DealershipPage />} />
          {/* Catch-all bike slug — keep last so static routes win */}
          <Route path=":slug" element={<BikePage />} />
        </Route>
        {/* Standalone booking/configurator — no site nav/footer */}
        <Route
          path=":slug/book"
          element={
            <Suspense fallback={<RouteFallback />}>
              <BookingPage />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App

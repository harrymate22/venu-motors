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
const DealersPage = lazy(() => import("@/pages/dealers/DealersPage"))
const SavingsPage = lazy(() => import("@/pages/savings/SavingsPage"))
const BikePage = lazy(() => import("@/pages/explore/BikePage"))
const BookingPage = lazy(() => import("@/pages/explore/BookingPage"))
const OrderConfirmedPage = lazy(() => import("@/pages/explore/OrderConfirmedPage"))

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about-us" element={<AboutPage />} />
          <Route path="dealership" element={<DealershipPage />} />
          <Route path="locate-venu-dealer" element={<DealersPage />} />
          {/* Catch-all bike slug — keep last so static routes win */}
          <Route path=":slug" element={<BikePage />} />
        </Route>
        {/* Standalone full-screen tools — no site nav/footer, locked to the
            viewport with their own internal scroll region */}
        <Route
          path="savings"
          element={
            <Suspense fallback={<RouteFallback />}>
              <SavingsPage />
            </Suspense>
          }
        />
        {/* The shop (shop.venumotors.in) sends buyers here after checkout */}
        <Route
          path="order-confirmed"
          element={
            <Suspense fallback={<RouteFallback />}>
              <OrderConfirmedPage />
            </Suspense>
          }
        />
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

import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "@/components/layout/Layout"
import HomePage from "@/pages/home/HomePage"
import AboutPage from "@/pages/about/AboutPage"
import DealershipPage from "@/pages/dealership/DealershipPage"
import BikePage from "@/pages/explore/BikePage"
import BookingPage from "@/pages/explore/BookingPage"

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
        <Route path=":slug/book" element={<BookingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

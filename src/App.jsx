import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "@/components/layout/Layout"
import HomePage from "@/pages/home/HomePage"
import BikePage from "@/pages/explore/BikePage"
import BookingPage from "@/pages/explore/BookingPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path=":slug" element={<BikePage />} />
        </Route>
        {/* Standalone booking/configurator — no site nav/footer */}
        <Route path=":slug/book" element={<BookingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

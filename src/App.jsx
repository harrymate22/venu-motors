import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "@/components/layout/Layout"
import HomePage from "@/pages/home/HomePage"
import BikePage from "@/pages/explore/BikePage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path=":slug" element={<BikePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

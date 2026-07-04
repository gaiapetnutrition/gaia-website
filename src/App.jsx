import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home          from './pages/Home'
import Calculator            from './pages/Calculator'
import ChocolateCalculator       from './pages/ChocolateCalculator'
import NaturalCalorieCalculator  from './pages/NaturalCalorieCalculator'
import AafcoBalanceCheck         from './pages/AafcoBalanceCheck'
import Consultations from './pages/Consultations'
import About         from './pages/About'
import Articles      from './pages/Articles'

/* Scroll to top on route change */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function Layout() {
  const location = useLocation()
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/calculator"           element={<Calculator key={location.key} />} />
          <Route path="/chocolate-calculator"       element={<ChocolateCalculator      key={location.key} />} />
          <Route path="/natural-calorie-calculator" element={<NaturalCalorieCalculator key={location.key} />} />
          <Route path="/aafco-balance-check"        element={<AafcoBalanceCheck        key={location.key} />} />
          <Route path="/consultations" element={<Consultations />} />
          <Route path="/about"         element={<About />} />
          <Route path="/articles"      element={<Articles />} />
          <Route path="/articles/:id"  element={<Articles />} />
          {/* 404 fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout />
    </BrowserRouter>
  )
}

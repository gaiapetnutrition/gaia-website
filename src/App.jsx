import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home          from './pages/Home'
import Calculator            from './pages/Calculator'
import ChocolateCalculator       from './pages/ChocolateCalculator'
import NaturalCalorieCalculator  from './pages/NaturalCalorieCalculator'
import AafcoBalanceCheck         from './pages/AafcoBalanceCheck'
import Calculators           from './pages/Calculators'
import Consultations from './pages/Consultations'
import About         from './pages/About'
import Articles      from './pages/Articles'

/* Scroll to top on route change */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

/* Keep canonical + og:url pointing at the current page (unknown paths render Home, so they point at /) */
const SITE_URL = 'https://www.gaiapetnutrition.co.il'
const CANONICAL_PATHS = /^\/(calculators?|chocolate-calculator|natural-calorie-calculator|aafco-balance-check|consultations|about|articles(\/\d+)?)?$/

function CanonicalUrl() {
  const { pathname } = useLocation()
  useEffect(() => {
    const path = pathname.replace(/\/+$/, '') || '/'
    const url = SITE_URL + (CANONICAL_PATHS.test(path) ? path : '/')
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', url)
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', url)
  }, [pathname])
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
          <Route path="/calculators"   element={<Calculators />} />
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
      <CanonicalUrl />
      <Layout />
    </BrowserRouter>
  )
}

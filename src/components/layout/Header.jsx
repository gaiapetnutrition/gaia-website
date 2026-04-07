import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import clsx from 'clsx'
import Button from '../ui/Button'

const NAV = [
  { label: 'בית',            path: '/' },
  { label: 'מחשבון תזונה',  path: '/calculator' },
  { label: 'ייעוץ',          path: '/consultations' },
  { label: 'מאמרים',         path: '/articles' },
  { label: 'אודות',          path: '/about' },
]

export default function Header() {
  const [open,      setOpen]      = useState(false)
  const [scrolled,  setScrolled]  = useState(false)
  const { pathname }              = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header
      className={clsx(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-cream/95 backdrop-blur-md border-b border-stone shadow-sm'
          : 'bg-transparent',
      )}
    >
      <div className="container-gaia">
        <nav className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img
              src="/gaia-logo.png"
              alt="GAiA"
              className="h-12 w-auto"
              onError={e => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
            {/* Fallback wordmark */}
            <div
              className="hidden items-center gap-0.5"
              style={{ display: 'none' }}
            >
              <span className="text-2xl font-serif font-bold text-forest tracking-tight">
                GA<em className="not-italic text-olive">i</em>A
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'relative px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  pathname === item.path
                    ? 'text-forest'
                    : 'text-bark hover:text-forest hover:bg-forest/[5%]',
                )}
              >
                {item.label}
                {pathname === item.path && (
                  <span className="absolute bottom-0 right-3 left-3 h-0.5 bg-olive rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              as={Link}
              to="/calculator"
              variant="ghost"
              size="sm"
              onClick={() => {}}
            >
              מחשבון חינמי
            </Button>
            <Button
              as={Link}
              to="/consultations"
              variant="primary"
              size="sm"
              onClick={() => {}}
            >
              קביעת ייעוץ
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-bark hover:text-forest hover:bg-forest/[5%] transition-colors"
            onClick={() => setOpen(o => !o)}
            aria-label="תפריט"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-cream border-b border-stone shadow-lg animate-fade-in">
          <div className="container-gaia py-4 flex flex-col gap-1">
            {NAV.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'px-4 py-3 text-sm font-medium rounded-xl transition-colors',
                  pathname === item.path
                    ? 'bg-forest/[8%] text-forest'
                    : 'text-bark hover:bg-forest/[5%] hover:text-forest',
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-stone flex flex-col gap-2">
              <Button as={Link} to="/consultations" variant="primary" size="md" className="w-full">
                קביעת ייעוץ
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

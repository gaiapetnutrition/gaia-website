import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'

const NAV = [
  { label: 'בית',    path: '/' },
  {
    label: 'מחשבונים',
    dropdown: [
      { label: 'מחשבון האכלה',           path: '/calculator' },
      { label: 'מחשבון שוקולד',          path: '/chocolate-calculator' },
    ],
  },
  { label: 'ייעוץ',   path: '/consultations' },
  { label: 'מאמרים', path: '/articles' },
  { label: 'אודות',  path: '/about' },
]

export default function Header() {
  const [scrolled,      setScrolled]      = useState(false)
  const [bannerVisible, setBannerVisible] = useState(true)
  const [openDropdown,  setOpenDropdown]  = useState(null)   // label of open dropdown
  const { pathname } = useLocation()
  const closeTimer = useRef(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // helpers for delayed close (so mouse can travel into the menu)
  const openMenu  = (label) => { clearTimeout(closeTimer.current); setOpenDropdown(label) }
  const scheduleClose = () => { closeTimer.current = setTimeout(() => setOpenDropdown(null), 120) }

  return (
    <header
      className={clsx(
        'sticky top-0 z-50 transition-shadow duration-300',
        scrolled ? 'shadow-[0_1px_12px_rgba(61,26,10,0.1)]' : '',
      )}
    >
      {/* ── Announcement banner ───────────────────────────── */}
      {bannerVisible && (
        <div className="relative bg-[#2D1206] text-white">
          <div className="flex items-center justify-center gap-4 px-10 py-2.5">
            <span className="text-sm font-medium text-white/80 tracking-wide">
              קבעו ייעוץ תזונתי אישי לכלבכם
            </span>
            <Link
              to="/consultations"
              className="flex-shrink-0 bg-forest hover:bg-forest-light border border-forest text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded transition-colors duration-150"
            >
              לקביעת פגישה
            </Link>
          </div>
        </div>
      )}

      {/* ── Main nav row ─────────────────────────────────── */}
      <div className="bg-[#FAF5E4] border-b border-[#3D1A0A]/6">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start h-12 md:h-14 gap-1">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img src="/gaia-logo.png" alt="GAiA" className="h-12 w-auto rounded-xl" />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-0.5" aria-label="ניווט ראשי">
              {NAV.map(item => {
                if (item.dropdown) {
                  const active = item.dropdown.some(d => pathname === d.path)
                  const isOpen = openDropdown === item.label
                  return (
                    <div
                      key={item.label}
                      className="relative"
                      onMouseEnter={() => openMenu(item.label)}
                      onMouseLeave={scheduleClose}
                    >
                      <button
                        className={clsx(
                          'relative flex items-center gap-1 px-4 py-2.5 text-[15px] font-bold tracking-wide transition-colors duration-150 rounded-lg',
                          active ? 'text-forest' : 'text-[#3D1A0A]/65 hover:text-[#3D1A0A]',
                        )}
                      >
                        {item.label}
                        <ChevronDown
                          className={clsx('w-3.5 h-3.5 transition-transform duration-200', isOpen && 'rotate-180')}
                        />
                        {active && (
                          <span className="absolute bottom-0.5 right-4 left-4 h-[2.5px] bg-forest rounded-full" />
                        )}
                      </button>

                      {/* Dropdown panel */}
                      <div
                        className={clsx(
                          'absolute top-full right-0 mt-1 bg-white border border-[#3D1A0A]/8 rounded-2xl shadow-lg py-1.5 min-w-[160px] transition-all duration-150 origin-top-right',
                          isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none',
                        )}
                        onMouseEnter={() => openMenu(item.label)}
                        onMouseLeave={scheduleClose}
                      >
                        {item.dropdown.map(sub => (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            onClick={() => setOpenDropdown(null)}
                            className={clsx(
                              'block px-4 py-2 text-sm font-semibold transition-colors duration-100',
                              pathname === sub.path
                                ? 'text-forest bg-forest/5'
                                : 'text-[#3D1A0A]/70 hover:text-forest hover:bg-forest/5',
                            )}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )
                }

                // Regular link
                const active = pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={clsx(
                      'relative px-4 py-2.5 text-[15px] font-bold tracking-wide transition-colors duration-150 rounded-lg',
                      active ? 'text-forest' : 'text-[#3D1A0A]/65 hover:text-[#3D1A0A]',
                    )}
                  >
                    {item.label}
                    {active && (
                      <span className="absolute bottom-0.5 right-4 left-4 h-[2.5px] bg-forest rounded-full" />
                    )}
                  </Link>
                )
              })}
            </nav>

          </div>
        </div>

        {/* ── Mobile nav — horizontal scrollable tabs ─────── */}
        <div className="md:hidden border-t border-[#3D1A0A]/6 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 px-3 py-2 w-max min-w-full justify-end">
            {NAV.flatMap(item =>
              item.dropdown
                ? item.dropdown.map(sub => ({ label: sub.label, path: sub.path }))
                : [{ label: item.label, path: item.path }]
            ).map(item => {
              const active = pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    'flex-shrink-0 px-4 py-1.5 text-sm font-bold rounded-2xl whitespace-nowrap transition-all duration-150',
                    active
                      ? 'bg-forest text-white shadow-sm'
                      : 'text-[#3D1A0A]/65 hover:text-[#3D1A0A] hover:bg-[#3D1A0A]/5',
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </header>
  )
}

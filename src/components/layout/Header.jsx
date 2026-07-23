import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'

const NAV = [
  { label: 'בית',    path: '/' },
  {
    label: 'מחשבונים',
    dropdown: [
      { label: 'מחשבון האכלה',                path: '/calculator', icon: '/feed_icon2.webp', iconSize: 19 },
      { label: 'בדיקת מלא ומאוזן לפי AAFCO',  path: '/aafco-balance-check', icon: '/scales_icon5.png', iconStyle: { position: 'relative', top: '-2px', marginRight: '5px' } },
      { label: 'מחשבון קלוריות לתזונה טבעית', path: '/natural-calorie-calculator', icon: '/calorie_icon.png', iconSize: 14 },
      { label: 'מחשבון שוקולד', path: '/chocolate-calculator', icon: '/choco_icon2.png' },
    ],
  },
  { label: 'מאמרים', path: '/articles' },
  { label: 'ייעוץ',   path: '/consultations' },
  { label: 'אודות',  path: '/about' },
]

export default function Header() {
  const [scrolled,        setScrolled]        = useState(false)
  const [hidden,          setHidden]          = useState(false)
  const [openDropdown,    setOpenDropdown]    = useState(null)
  const [mobileMenuOpen,  setMobileMenuOpen]  = useState(false)
  const [backdropMounted, setBackdropMounted] = useState(false)
  const { pathname } = useLocation()
  const closeTimer       = useRef(null)
  const lastScrollY      = useRef(0)
  const menuOpenedAt     = useRef(0)
  const mobileMenuOpenRef = useRef(false)

  // Keep ref in sync so the scroll handler (stale closure) can read current value
  useEffect(() => { mobileMenuOpenRef.current = mobileMenuOpen }, [mobileMenuOpen])

  // Scroll shadow + hide-on-scroll-down / show-on-scroll-up
  useEffect(() => {
    const handler = () => {
      const y = window.scrollY
      setScrolled(y > 8)
      // Never hide the header while the mobile menu is open — the menu panel
      // lives inside the header, so translateY(-100%) would yank it off-screen
      if (mobileMenuOpenRef.current) { lastScrollY.current = y; return }
      if (y < 60) {
        setHidden(false)
      } else if (y > lastScrollY.current + 6) {
        setHidden(true)
      } else if (y < lastScrollY.current - 4) {
        setHidden(false)
      }
      lastScrollY.current = y
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Mount backdrop when menu opens; unmount after fade-out completes
  useEffect(() => {
    if (mobileMenuOpen) {
      setBackdropMounted(true)
    } else {
      const t = setTimeout(() => setBackdropMounted(false), 320)
      return () => clearTimeout(t)
    }
  }, [mobileMenuOpen])

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false) }, [pathname])

  // Scroll-lock while mobile menu is open — touchmove prevention keeps scroll
  // position exactly in place without any position/top hacks that can drift
  useEffect(() => {
    if (!mobileMenuOpen) return
    const prevent = (e) => e.preventDefault()
    document.addEventListener('touchmove', prevent, { passive: false })
    return () => document.removeEventListener('touchmove', prevent)
  }, [mobileMenuOpen])

  // Close mobile menu on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setMobileMenuOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const openMenu      = (label) => { clearTimeout(closeTimer.current); setOpenDropdown(label) }
  const scheduleClose = ()      => { closeTimer.current = setTimeout(() => setOpenDropdown(null), 120) }

  return (
    <>
    {/* Backdrop — only mounted while menu is open or fading out */}
    {backdropMounted && (
      <div
        className={clsx(
          'md:hidden fixed inset-0 z-40 bg-black/30 transition-opacity duration-300',
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />
    )}
    <header
      className={clsx(
        'sticky top-0 z-50',
        'transition-[box-shadow,background-color,transform] duration-300',
        scrolled ? 'shadow-[0_1px_16px_rgba(90,60,30,0.10)]' : '',
      )}
      style={{ transform: hidden ? 'translateY(-100%)' : 'translateY(0)' }}
    >
      {/* ── Forest accent line ─────────────────────────── */}
      <div className="h-[3px] bg-gradient-to-l from-forest-dark via-forest to-moss" />

      {/* ── Announcement banner ────────────────────────── */}
      <div className="relative overflow-hidden bg-forest-dark text-white">
        <div className="absolute right-0 top-0 bottom-0 w-24 pointer-events-none opacity-[0.07]"
          style={{ backgroundImage: 'url(/gaia-paw.png)', backgroundRepeat: 'no-repeat', backgroundPosition: 'center right 8px', backgroundSize: '36px' }}
        />
        <div className="relative flex items-center justify-center gap-3 px-10 py-2">
          <img src="/gaia-paw.png" alt="" className="w-4 h-4 opacity-70 flex-shrink-0 mr-1" style={{ filter: 'brightness(0) invert(1)' }} />
          <span className="text-[13px] font-medium text-white/75 tracking-wide">
            קבעו ייעוץ תזונתי אישי לכלבכם
          </span>
          <Link
            to="/consultations"
            className="flex-shrink-0 bg-white/12 hover:bg-white/22 border border-white/25 text-white text-[13px] font-semibold px-3.5 py-1 rounded-lg transition-colors duration-150 cursor-pointer"
          >
            לייעוץ
          </Link>
        </div>
      </div>

      {/* ── Main nav row ───────────────────────────────── */}
      <div
        onClick={() => mobileMenuOpen && setMobileMenuOpen(false)}
        className={clsx(
          'border-b transition-colors duration-300',
          scrolled
            ? 'bg-cream border-earth/[0.09]'
            : 'bg-cream border-earth/[0.06]',
        )}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start h-14 md:h-[62px] gap-1">

            {/* Logo */}
            <Link
              to="/"
              className="flex-shrink-0 ml-4"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <img src="/gaia-logo.png" alt="GAiA" className="h-11 w-auto rounded-xl" />
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
                          'relative flex items-center gap-1.5 px-3.5 py-2 text-[13.5px] font-medium tracking-wide rounded-xl cursor-pointer',
                          'transition-[color,background-color] duration-150',
                          active
                            ? 'text-forest bg-forest/[0.07]'
                            : 'text-earth/55 hover:text-earth hover:bg-earth/[0.04]',
                        )}
                      >
                        {item.label}
                        <ChevronDown
                          className={clsx(
                            'w-3.5 h-3.5 transition-transform duration-200',
                            isOpen && 'rotate-180',
                          )}
                        />
                      </button>
                      <div
                        className={clsx(
                          'absolute top-full right-0 mt-1.5 border border-stone rounded-2xl shadow-warm-sm py-1.5 min-w-[260px] origin-top-right',
                          'bg-linen',
                          'transition-[opacity,transform] duration-[140ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)]',
                          isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none',
                        )}
                        style={{ backgroundColor: '#F5F1E8' }}
                        onMouseEnter={() => openMenu(item.label)}
                        onMouseLeave={scheduleClose}
                      >
                        {item.dropdown.map(sub => (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            onClick={() => setOpenDropdown(null)}
                            className={clsx(
                              'block px-4 py-2 text-[13px] font-medium transition-colors duration-100 cursor-pointer whitespace-nowrap',
                              pathname === sub.path
                                ? 'text-forest bg-forest/[0.07]'
                                : 'text-earth/65 hover:text-forest hover:bg-forest/[0.05]',
                            )}
                          >
                            {sub.label}
                            {sub.icon && (
                              <img src={sub.icon} alt="" className="inline-block object-contain align-middle mr-1" style={{ width: sub.iconSize ?? 17, height: sub.iconSize ?? 17, ...sub.iconStyle }} />
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )
                }

                const active = pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={clsx(
                      'px-3.5 py-2 text-[13.5px] font-medium tracking-wide rounded-xl cursor-pointer',
                      'transition-[color,background-color] duration-150',
                      active
                        ? 'text-forest bg-forest/[0.07]'
                        : 'text-earth/55 hover:text-earth hover:bg-earth/[0.04]',
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Hamburger button — mobile only */}
            <button
              className="md:hidden ml-auto p-2.5 rounded-xl text-earth/60 hover:text-earth hover:bg-earth/[0.05] transition-colors duration-150 cursor-pointer"
              onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(v => !v) }}
              aria-label="פתח תפריט"
              aria-expanded={mobileMenuOpen}
            >
              {/* Three bars — always hamburger */}
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className="block h-0.5 bg-current rounded-full" />
                <span className="block h-0.5 bg-current rounded-full" />
                <span className="block h-0.5 bg-current rounded-full" />
              </div>
            </button>

          </div>
        </div>

        {/* ── Mobile menu panel ─────────────────────────── */}
        <div
          className={clsx(
            'md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out',
            mobileMenuOpen ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0',
          )}
          style={{ transitionTimingFunction: mobileMenuOpen ? 'cubic-bezier(0.23,1,0.32,1)' : 'cubic-bezier(0.77,0,0.175,1)' }}
        >
          <nav className="border-t border-earth/[0.06] pb-3" aria-label="ניווט נייד">

            {/* Simple links */}
            {NAV.filter(item => !item.dropdown).map(item => {
              const active = pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    'flex items-center px-5 py-3.5 text-[15px] font-medium border-b border-earth/[0.05] transition-colors duration-150',
                    active ? 'text-forest bg-forest/[0.04]' : 'text-earth/70 hover:text-earth hover:bg-earth/[0.03]',
                  )}
                >
                  {item.label}
                  {active && <span className="mr-auto w-1.5 h-1.5 rounded-full bg-forest" />}
                </Link>
              )
            })}

            {/* Calculators group */}
            {NAV.filter(item => item.dropdown).map(group => (
              <div key={group.label}>
                <p className="px-5 pt-4 pb-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase text-mist">
                  {group.label}
                </p>
                {group.dropdown.map(sub => {
                  const active = pathname === sub.path
                  return (
                    <Link
                      key={sub.path}
                      to={sub.path}
                      className={clsx(
                        'flex items-center gap-2.5 px-5 py-3 text-[14px] font-medium border-b border-earth/[0.05] transition-colors duration-150',
                        active ? 'text-forest bg-forest/[0.04]' : 'text-earth/65 hover:text-earth hover:bg-earth/[0.03]',
                      )}
                    >
                      {sub.icon && (
                        <img src={sub.icon} alt="" className="flex-shrink-0 object-contain"
                          style={{ width: sub.iconSize ?? 17, height: sub.iconSize ?? 17 }} />
                      )}
                      {sub.label}
                      {active && <span className="mr-auto w-1.5 h-1.5 rounded-full bg-forest" />}
                    </Link>
                  )
                })}
              </div>
            ))}

          </nav>

          {/* Close button — bottom right of menu */}
          <div className="flex justify-start px-4 pb-4 pt-1">
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="סגור תפריט"
              className="flex items-center gap-2 text-earth/50 hover:text-earth text-sm font-medium transition-colors duration-150 cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="4" x2="14" y2="14" />
                <line x1="14" y1="4" x2="4" y2="14" />
              </svg>
              סגירה
            </button>
          </div>
        </div>

      </div>
    </header>
    </>

  )
}

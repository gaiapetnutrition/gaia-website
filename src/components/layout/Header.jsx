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
  const [scrolled,     setScrolled]     = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const { pathname } = useLocation()
  const closeTimer = useRef(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const openMenu      = (label) => { clearTimeout(closeTimer.current); setOpenDropdown(label) }
  const scheduleClose = ()      => { closeTimer.current = setTimeout(() => setOpenDropdown(null), 120) }

  return (
    <header
      className={clsx(
        'sticky top-0 z-50',
        'transition-[box-shadow,background-color] duration-300',
        scrolled ? 'shadow-[0_1px_16px_rgba(90,60,30,0.10)]' : '',
      )}
    >
      {/* ── Forest accent line — brand anchor at very top ── */}
      <div className="h-[3px] bg-gradient-to-l from-forest-dark via-forest to-moss" />

      {/* ── Announcement banner ──────────────────────────── */}
      <div className="relative overflow-hidden bg-forest-dark text-white">
{/* Faint leaf motif — right edge, decorative only */}
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
            לקביעת פגישה
          </Link>
        </div>
      </div>

      {/* ── Main nav row ─────────────────────────────────── */}
      <div
        className={clsx(
          'border-b transition-colors duration-300',
          scrolled
            ? 'bg-cream/95 backdrop-blur-sm border-earth/[0.09]'
            : 'bg-cream border-earth/[0.06]',
        )}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start h-14 md:h-[62px] gap-1">

            {/* Logo — extra margin-end so it breathes away from nav */}
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

                      {/* Dropdown panel */}
                      <div
                        className={clsx(
                          'absolute top-full right-0 mt-1.5 border border-stone rounded-2xl shadow-warm-sm py-1.5 min-w-[172px] origin-top-right',
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
                              'block px-4 py-2 text-[13px] font-medium transition-colors duration-100 cursor-pointer',
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

                // Regular link — pill active state
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

          </div>
        </div>

        {/* ── Mobile nav ──────────────────────────────────── */}
        <div className="md:hidden border-t border-earth/[0.06] overflow-x-auto scrollbar-none">
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
                    'flex-shrink-0 px-4 py-1.5 text-[13px] font-semibold rounded-2xl whitespace-nowrap',
                    'transition-[background-color,color] duration-150',
                    active
                      ? 'bg-forest text-white shadow-sm'
                      : 'text-earth/55 hover:text-earth hover:bg-earth/[0.05]',
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

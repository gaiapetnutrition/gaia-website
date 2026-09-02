import { Link, useLocation } from 'react-router-dom'
import { Instagram, Mail, Phone } from 'lucide-react'

const NAV_LINKS = [
  { label: 'בית',            path: '/' },
  { label: 'מחשבון תזונה',  path: '/calculator' },
  { label: 'ייעוץ תזונתי',  path: '/consultations' },
  { label: 'מאמרים',         path: '/articles' },
  { label: 'אודות',          path: '/about' },
]

export default function Footer() {
  const { pathname } = useLocation()

  function handleLogoClick(e) {
    if (pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-earth text-white/75">
      <div className="container-gaia py-16 md:py-20">

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 pb-12 border-b border-white/10">

          {/* Brand column */}
          <div className="md:col-span-2 space-y-5">
            <div className="flex items-center">
              <Link to="/" onClick={handleLogoClick}>
                <img
                  src="/gaia-logo.png"
                  alt="GAiA"
                  className="h-14 w-auto rounded-xl"
                />
              </Link>
            </div>
            <p className="text-sm leading-relaxed max-w-xs text-white/60">
              ידע על תזונה טבעית לכלבים מבוססת מדע - שילוב ייחודי של ידע מדעי עם פילוסופיית מזון מלא ובריאות הוליסטית.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href="mailto:hello@gaia-nutrition.com"
                className="w-9 h-9 rounded-xl bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="tel:+972-50-0000000"
                className="w-9 h-9 rounded-xl bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav column */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">ניווט</h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map(item => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community column */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">קהילה</h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://www.instagram.com/gaia.petnutrition/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <Instagram className="w-4 h-4 flex-shrink-0" />
                  Instagram
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2.5 text-sm text-white/30 cursor-default select-none">
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.554 4.107 1.523 5.832L.057 23.568a.75.75 0 0 0 .921.921l5.736-1.466A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.523-5.183-1.433l-.371-.222-3.853.985.985-3.853-.222-.371A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                  WhatsApp
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-white/40 leading-relaxed max-w-md">
            * המידע באתר למטרות חינוכיות בלבד ואינו מהווה תחליף לייעוץ וטרינרי מקצועי.
            תמיד התייעצו עם וטרינר לגבי בריאות כלבכם.
          </p>
          <p className="text-xs text-white/30 flex-shrink-0">
            © {new Date().getFullYear()} GAiA. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  )
}

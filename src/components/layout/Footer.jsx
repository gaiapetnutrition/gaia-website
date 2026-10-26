import { Link, useLocation } from 'react-router-dom'
import { Instagram, Phone } from 'lucide-react'
import EmailCopy from '../ui/EmailCopy'
import WhatsAppIcon from '../ui/WhatsAppIcon'

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
        <div className="grid grid-cols-1 md:flex gap-10 md:gap-20 lg:gap-28 pb-12 border-b border-white/10">

          {/* Brand column */}
          <div className="space-y-5">
            <div className="flex items-center">
              <Link to="/" onClick={handleLogoClick}>
                <img
                  src="/gaia-logo.webp"
                  alt="GAiA"
                  className="h-14 w-auto rounded-xl"
                />
              </Link>
            </div>
            <p className="text-sm leading-relaxed max-w-xs text-white/60">
              תזונה טבעית לכלבים -
              <br />
              מותאמת, מלאה ומאוזנת.
            </p>
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

          {/* Contact column */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">יצירת קשר</h4>
            <ul className="space-y-2.5">
              <li>
                <EmailCopy variant="footer" />
              </li>
              <li>
                <a
                  href="tel:+972547565603"
                  className="flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span dir="ltr">054-756-5603</span>
                </a>
              </li>
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
                <a
                  href="https://wa.me/972547565603"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4 flex-shrink-0" />
                  WhatsApp – דברו איתנו
                </a>
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

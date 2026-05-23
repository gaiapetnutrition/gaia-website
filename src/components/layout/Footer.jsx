import { Link } from 'react-router-dom'
import { Instagram, Mail, Phone } from 'lucide-react'

const LINKS = {
  'ניווט': [
    { label: 'בית',            path: '/' },
    { label: 'מחשבון תזונה',  path: '/calculator' },
    { label: 'ייעוץ תזונתי',  path: '/consultations' },
    { label: 'מאמרים',         path: '/articles' },
    { label: 'אודות',          path: '/about' },
  ],
  'שירותים': [
    { label: 'ייעוץ ראשוני',          path: '/consultations' },
    { label: 'תוכנית תזונה מלאה',      path: '/consultations' },
    { label: 'מעקב תזונתי',           path: '/consultations' },
    { label: 'מחשבון צרכים יומיים',   path: '/calculator' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-earth text-white/75">
      <div className="container-gaia py-16 md:py-20">

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 pb-12 border-b border-white/10">

          {/* Brand column */}
          <div className="md:col-span-2 space-y-5">
            <div className="flex items-center">
              <img
                src="/gaia-logo.png"
                alt="GAiA"
                className="h-14 w-auto rounded-xl"
              />
            </div>
            <p className="text-sm leading-relaxed max-w-xs text-white/60">
              תזונה טבעית לכלבים מבוססת מדע — שילוב ייחודי של ידע מדעי עם פילוסופיית מזון מלא ובריאות הוליסטית.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
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

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading} className="space-y-4">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">{heading}</h4>
              <ul className="space-y-2.5">
                {items.map(item => (
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
          ))}
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

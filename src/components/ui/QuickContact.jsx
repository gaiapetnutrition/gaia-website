import { ArrowLeft, Phone } from 'lucide-react'
import clsx from 'clsx'
import WhatsAppIcon from './WhatsAppIcon'

/* Colors per surface: light background (forest text) or forest-green background (white text) */
const tones = {
  light: {
    text: 'text-forest',
    icon: 'bg-forest/10 text-forest hover:bg-forest hover:text-cream',
  },
  dark: {
    text: 'text-white',
    icon: 'bg-white/10 text-white hover:bg-white hover:text-forest focus-visible:outline-white',
  },
}

/* Bold label with an arrow, followed by call and WhatsApp icon links */
export default function QuickContact({ label, tone = 'light', className }) {
  const t = tones[tone]
  const iconClass = clsx(
    'inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200',
    t.icon,
  )

  return (
    <div className={clsx('flex flex-wrap items-center gap-x-3 gap-y-2', className)}>
      <p className={clsx('inline-flex items-center gap-2 font-semibold text-sm', t.text)}>
        {label}
        <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
      </p>
      <div className="flex items-center gap-2">
        <a
          href="tel:+972547565603"
          aria-label="התקשרו אלינו: 054-756-5603"
          title="התקשרו אלינו"
          className={iconClass}
        >
          <Phone className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
        <a
          href="https://wa.me/972547565603"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="שליחת הודעה בוואטסאפ (נפתח בחלון חדש)"
          title="WhatsApp"
          className={iconClass}
        >
          <WhatsAppIcon className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  )
}

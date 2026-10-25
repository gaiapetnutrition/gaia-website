import { useEffect, useRef, useState } from 'react'
import { Mail, Copy, Check, X } from 'lucide-react'
import clsx from 'clsx'

export const CONTACT_EMAIL = 'info@gaiapetnutrition.co.il'

/* Styles per surface: footer (dark earth) and the consultations CTA (forest green) */
const variants = {
  footer: {
    link:   'text-white/75 hover:text-white',
    button: 'bg-white/[0.08] hover:bg-white/15 text-white/75 hover:text-white',
  },
  cta: {
    link:   'text-white/80 hover:text-white focus-visible:outline-white',
    button: 'border border-white/30 hover:bg-white/[0.08] text-white focus-visible:outline-white',
  },
}

const MESSAGES = {
  copied: { visible: 'הכתובת הועתקה', announce: 'הכתובת הועתקה' },
  failed: { visible: 'ההעתקה נכשלה', announce: 'ההעתקה נכשלה. אפשר לסמן את הכתובת ולהעתיק אותה ידנית.' },
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Permission denied or unsupported: fall through to the legacy method
    }
  }
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }
  textarea.remove()
  return ok
}

export default function EmailCopy({ email = CONTACT_EMAIL, variant = 'footer', className }) {
  const [status, setStatus] = useState('idle') // idle | copied | failed
  const timerRef = useRef(null)
  const styles = variants[variant]

  useEffect(() => () => clearTimeout(timerRef.current), [])

  async function handleCopy() {
    const ok = await copyText(email)
    setStatus(ok ? 'copied' : 'failed')
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setStatus('idle'), ok ? 2000 : 4000)
  }

  const message = MESSAGES[status]
  const StatusIcon = status === 'copied' ? Check : status === 'failed' ? X : Copy

  return (
    <div className={clsx('flex flex-wrap items-center gap-2', className)}>
      <a
        href={`mailto:${email}`}
        aria-label={`שליחת מייל אל ${email}`}
        className={clsx('inline-flex items-center gap-2 text-sm rounded-lg transition-colors', styles.link)}
      >
        <Mail className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        <span dir="ltr">{email}</span>
      </a>

      {/* Icon-only while idle (label kept for screen readers and as a tooltip); shows the result text briefly after a click */}
      <button
        type="button"
        onClick={handleCopy}
        title="העתקת כתובת"
        className={clsx(
          'inline-flex items-center justify-center gap-1.5 h-8 rounded-xl text-xs font-semibold transition-colors',
          message ? 'px-3' : 'w-8',
          styles.button,
        )}
      >
        <StatusIcon className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
        {message ? message.visible : <span className="sr-only">העתקת כתובת</span>}
      </button>

      <span role="status" aria-live="polite" className="sr-only">
        {message?.announce ?? ''}
      </span>
    </div>
  )
}

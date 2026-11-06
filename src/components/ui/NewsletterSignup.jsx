import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* Styles per placement:
   card    — the original green card (articles page)
   compact — light, secondary strip above the footer (home, consultations) */
const variants = {
  card: {
    title:    'text-xl font-serif text-white mb-2',
    subtitle: 'text-white/60 text-sm mb-6',
    form:     'flex flex-col sm:flex-row gap-3 max-w-md mx-auto',
    button:   'px-6 py-3 bg-white text-forest font-semibold text-sm rounded-xl hover:bg-cream transition-colors flex-shrink-0 disabled:opacity-60 disabled:cursor-not-allowed',
    success:  'text-white',
    error:    'text-white',
    reset:    'text-sm text-white/70 underline hover:text-white transition-colors mt-2',
    paw:      { filter: 'brightness(0) invert(1)' },
  },
  compact: {
    title:    'text-lg font-serif text-earth mb-1',
    subtitle: 'text-mist text-sm',
    form:     'flex flex-col sm:flex-row gap-3',
    button:   'px-6 py-3 bg-forest text-white font-semibold text-sm rounded-xl hover:bg-forest-light transition-colors flex-shrink-0 disabled:opacity-60 disabled:cursor-not-allowed',
    success:  'text-forest',
    error:    'text-red-700',
    reset:    'text-sm text-forest underline hover:text-forest-dark transition-colors mt-2',
    paw:      undefined,
  },
}

export default function NewsletterSignup({ variant = 'card', className }) {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState('idle') // idle | loading | success | error | rate-limited
  const [newsletterHoneypot, setNewsletterHoneypot] = useState('')
  const newsletterInputRef = useRef(null)
  const [newsletterFocusToken, setNewsletterFocusToken] = useState(0)
  const s = variants[variant]

  useEffect(() => {
    if (newsletterFocusToken > 0) newsletterInputRef.current?.focus()
  }, [newsletterFocusToken])

  async function handleNewsletterSubmit(e) {
    e.preventDefault()
    if (newsletterStatus === 'loading') return

    if (!EMAIL_RE.test(newsletterEmail.trim())) {
      setNewsletterStatus('error')
      return
    }

    setNewsletterStatus('loading')
    try {
      const res = await fetch('/api/newsletter-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail.trim(), website: newsletterHoneypot }),
      })
      if (res.status === 429) {
        setNewsletterStatus('rate-limited')
        return
      }
      if (!res.ok) throw new Error('subscribe failed')
      setNewsletterStatus('success')
      setNewsletterEmail('')
    } catch {
      setNewsletterStatus('error')
    }
  }

  function handleNewsletterReset() {
    setNewsletterStatus('idle')
    setNewsletterEmail('')
    setNewsletterFocusToken(t => t + 1)
  }

  const heading = (
    <>
      <h2 className={s.title}>
        רוצים לקבל בכל שבוע מאמר בחינם על תזונה טבעית ורווחת הכלב מתזונאי כלבים{' '}
        {/* nowrap keeps the paw on the same line as the last word */}
        <span className="whitespace-nowrap">
          מוסמך?
          <img src="/gaia-paw.png" alt="" aria-hidden="true" className="inline-block w-[1.2em] h-[1.2em] align-middle opacity-80 ms-2" style={s.paw} />
        </span>
      </h2>
      <p className={s.subtitle}>הצטרפו לרשימת הדיוור ותקבלו אותו ישירות למייל.</p>
    </>
  )

  const body = (
    <>
      {newsletterStatus !== 'success' && (
        <form onSubmit={handleNewsletterSubmit} noValidate className={s.form}>
          {/* Honeypot: hidden from people and screen readers; bots that fill every field get filtered server-side */}
          <input
            type="text"
            name="website"
            value={newsletterHoneypot}
            onChange={e => setNewsletterHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="sr-only"
          />
          <input
            ref={newsletterInputRef}
            type="email"
            value={newsletterEmail}
            onChange={e => {
              setNewsletterEmail(e.target.value)
              if (newsletterStatus !== 'idle' && newsletterStatus !== 'loading') setNewsletterStatus('idle')
            }}
            placeholder="your@email.com"
            required
            maxLength={254}
            aria-label="כתובת אימייל להרשמה לניוזלטר"
            aria-invalid={newsletterStatus === 'error'}
            disabled={newsletterStatus === 'loading'}
            className="input-base flex-1 text-right"
            dir="ltr"
          />
          <button
            type="submit"
            disabled={newsletterStatus === 'loading'}
            className={s.button}
          >
            {newsletterStatus === 'loading' ? 'נרשם...' : 'הרשמה'}
          </button>
        </form>
      )}
      <p role="status" aria-live="polite" className="text-sm mt-3">
        {newsletterStatus === 'success' && (
          <span className={s.success}>תודה! נרשמתם בהצלחה לעדכונים של Gaia Pet Nutrition.</span>
        )}
        {newsletterStatus === 'error' && (
          <span className={s.error}>לא הצלחנו להשלים את ההרשמה כרגע. נסו שוב בעוד רגע.</span>
        )}
        {newsletterStatus === 'rate-limited' && (
          <span className={s.error}>היו כמה ניסיונות הרשמה ברצף. נסו שוב בעוד דקה.</span>
        )}
      </p>
      {newsletterStatus === 'success' && (
        <button
          type="button"
          onClick={handleNewsletterReset}
          className={s.reset}
        >
          להרשמה עם כתובת אחרת
        </button>
      )}
    </>
  )

  if (variant === 'compact') {
    return (
      <section className={clsx('bg-parchment py-10 md:py-12', className)}>
        <div className="container-gaia">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center gap-5 md:gap-10">
            <div className="md:flex-1 text-center md:text-right">{heading}</div>
            <div className="md:flex-1 w-full text-center md:text-right">{body}</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className={clsx(className, 'bg-green-gradient rounded-3xl p-8 md:p-12 text-center')}>
      {heading}
      {body}
    </div>
  )
}

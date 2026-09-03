import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import {
  FlaskConical, Leaf, Heart, ArrowLeft,
  Calculator, Calendar, BookOpen, Star,
  Users
} from 'lucide-react'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'

/* ─── Intersection Observer hook for reveal animations ──── */
function useReveal(threshold = 0.1) {
  const ref        = useRef(null)
  const hasPlayed  = useRef(false)
  const [visible, setVisible] = useState(false)
  const [done,    setDone]    = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const show = () => {
      if (hasPlayed.current) return
      hasPlayed.current = true
      setVisible(true)
      setTimeout(() => setDone(true), 750) // slightly longer than transition
    }

    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { obs.disconnect(); show() } },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(el)
    return () => { obs.disconnect() }
  }, [threshold])

  return [ref, visible, done]
}

/* ─── Hero ───────────────────────────────────────────────── */
// Concept A — "Immersive Frame":
// Full-bleed photo on the left. A linen panel with an angled left edge (clip-path parallelogram)
// sits over the right ~64% of the hero, fading from transparent → solid cream.
// The angle (~5°) makes the boundary feel crafted rather than template-generic.
// Text elements sequence in with individual fade-up delays (eyebrow → h1 line 1 → line 2 → body → CTAs → social proof).
function Hero() {
  return (
    <section
      className="relative flex items-end md:items-center md:overflow-hidden bg-cream mb-16 md:mb-0"
      style={{ height: 'calc(100svh - 204px)', minHeight: 520, maxHeight: 860 }}
    >
      {/* Full-bleed photo — cover + left-center anchors bowl/ingredients */}
      <div
        className="absolute inset-0 z-0 hero-bg"
        style={{
          backgroundImage: 'url(/long_image_chat_new.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'left center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-cream to-transparent z-[1]" />

      {/* Mobile overlay — image shows at top, solid cream rises from bottom where text sits */}
      <div
        className="absolute inset-0 z-[1] md:hidden pointer-events-none"
        style={{ background: 'linear-gradient(to top, #FAF7F0 30%, rgba(250,247,240,0.75) 48%, rgba(250,247,240,0) 68%)' }}
      />

      {/* Desktop right-side gradient panel (unchanged) */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none hidden md:block"
        style={{
          background: 'linear-gradient(to right, rgba(250,247,240,0) 0%, rgba(250,247,240,0) 40%, rgba(250,247,240,0.5) 52%, rgba(250,247,240,0.9) 62%, #FAF7F0 72%)',
        }}
      />

      {/* Decorative paw — bottom-left, barely visible */}
      <img
        src="/gaia-paw.png"
        alt=""
        className="absolute bottom-4 left-6 w-14 md:bottom-10 md:w-36 opacity-[4%] mix-blend-multiply pointer-events-none select-none rotate-12 z-[2]"
      />

      {/* ── Text block ────────────────────────────────────── */}
      <div className="relative z-10 pb-6 md:py-24 flex w-full mt-auto md:mt-0 translate-y-32 md:translate-y-0">
        <div className="w-full px-5 md:w-[44%] md:min-w-[300px] md:mr-[4%] md:ml-auto text-right md:pr-4">

          {/* Eyebrow — first in the sequence */}
          <span
            className="hidden md:inline-flex items-center gap-2 mb-5 text-xs font-semibold tracking-[0.1em] uppercase text-forest bg-forest/[0.08] px-3 py-1.5 rounded-full animate-fade-up"
            style={{ animationFillMode: 'both' }}
          >
            <img src="/gaia-paw.png" alt="" className="w-3.5 h-3.5 opacity-80" style={{ filter: 'hue-rotate(0deg) saturate(0.8)' }} />
            קהילת המאכילים במזון טבעי לכלבים
          </span>

          {/* H1 — each line enters independently, 80ms apart */}
          <h1 className="text-display-xl font-serif text-earth text-balance leading-[1.08] mb-4">
            <span
              className="block animate-fade-up"
              style={{ animationDelay: '80ms', animationFillMode: 'both' }}
            >
              הבית לתזונה טבעית לכלבים -{' '}
              <span className="text-forest italic">מלאה ומאוזנת</span>
            </span>
          </h1>

          {/* Body text */}
          <p
            className="text-base md:text-lg text-earth/70 mb-3 md:mb-7 -mt-2 md:mt-0 animate-fade-up"
            style={{
              animationDelay: '260ms',
              animationFillMode: 'both',
              textShadow: '0 1px 8px rgba(250,247,240,0.9), 0 0 20px rgba(250,247,240,0.6)',
            }}
          >
            הידע, הכלים, והליווי לתזונה שהכלב שלך באמת צריך. מבוסס מחקרים, כלים טכנולוגיים והוליסטיות.<br className="hidden md:block" /> בלי ניחושים, להאכיל בביטחון.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col gap-1 md:gap-4 animate-fade-up -mt-1 md:mt-0"
            style={{ animationDelay: '340ms', animationFillMode: 'both' }}
          >
            <Button
              as={Link}
              to="/aafco-balance-check"
              variant="primary"
              size="lg"
              icon={<Calculator className="w-4 h-4" />}
              onClick={() => {}}
            >
              בדקו את התפריט של הכלב שלכם
            </Button>
            <Link
              to="/consultations"
              className="flex items-center justify-center gap-2 text-sm font-semibold text-earth/65 hover:text-forest transition-colors duration-200 cursor-pointer py-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              קבעו ייעוץ
            </Link>
          </div>

          {/* Paw divider */}
          <div
            className="flex items-center justify-center gap-4 mt-9 pt-7 border-t border-earth/10 animate-fade-up"
            style={{ animationDelay: '420ms', animationFillMode: 'both' }}
          >
            <img src="/gaia-paw.png" alt="" aria-hidden="true" className="hidden md:block w-10 h-10 opacity-60" />
          </div>

        </div>
      </div>
    </section>
  )
}

/* ─── Trust Bar ──────────────────────────────────────────── */
function TrustBar() {
  const PAW = <img src="/gaia-paw.png" alt="" className="w-3.5 h-3.5 opacity-80" />
  const ITEMS = [
    { icon: PAW, label: 'מבוסס AAFCO/NRC' },
    { icon: PAW, label: 'מחשבונים חינמיים' },
    { icon: PAW, label: 'תזונה טבעית' },
    { icon: PAW, label: 'קהילה' },
    { icon: PAW, label: 'בשיתוף תזונאי כלבים מוסמך' },
  ]
  return (
    <div className="relative bg-forest-dark text-white overflow-hidden">
      {/* Dot texture — consistent with header banner and CTA */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
      <div className="relative container-gaia py-3">
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
          {ITEMS.map((item, i) => (
            <div key={item.label} className="flex items-center gap-x-6">
              <div className="flex items-center gap-2 text-[11.5px] font-medium text-white/65 tracking-wide">
                <span className="text-sage opacity-90 flex-shrink-0">{item.icon}</span>
                {item.label}
              </div>
              {i < ITEMS.length - 1 && (
                <span className="text-white/15 hidden sm:block select-none text-[10px]">◆</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Scroll-split bowl animation ───────────────────────── */
// Module-level: survives React remounts (tab switch) but resets on page reload
let bowlHasPlayed = false

function ScrollSplitBowl() {
  const containerRef = useRef(null)
  const frontRef     = useRef(null)
  const dividerRef   = useRef(null)
  const [played, setPlayed] = useState(bowlHasPlayed)

  // Detect touch at render time so heights are correct on first paint (no flash)
  const isTouch = typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0

  function markPlayed() {
    bowlHasPlayed = true
    setPlayed(true)
  }

  useEffect(() => {
    function applyClip(p) {
      const clip = p * 100
      if (frontRef.current)   frontRef.current.style.clipPath    = `inset(0 ${clip}% 0 0)`
      if (dividerRef.current) dividerRef.current.style.transform = `translateX(-${clip}%)`
    }

    // Already played this session — show fully revealed immediately
    if (bowlHasPlayed) {
      applyClip(1)
      return
    }

    const WHEEL_SCALE = 350
    let animProgress  = 0
    let hasPlayed     = false

    const isTouch = navigator.maxTouchPoints > 0

    if (isTouch) {
      // Touch: scroll-driven reveal — maps bowl's viewport position to clip progress
      const el = containerRef.current
      if (!el) return
      applyClip(0)

      function onScrollTouch() {
        const rect  = el.getBoundingClientRect()
        const vh    = window.innerHeight
        // progress 0 when element top hits viewport bottom; 1 when top reaches 25% from top
        const start = vh * 0.60
        const end   = vh * 0.40
        const p     = Math.max(0, Math.min(1, (start - rect.top) / (start - end)))
        if (!hasPlayed) applyClip(p)
        if (p >= 1 && !hasPlayed) { hasPlayed = true; markPlayed(); applyClip(1) }
      }

      onScrollTouch()
      window.addEventListener('scroll', onScrollTouch, { passive: true })
      return () => window.removeEventListener('scroll', onScrollTouch)
    }

    // Desktop: scroll-jacking wheel reveal
    // Trigger point is wherever the bowl first fully fits on screen — i.e.
    // when the pinned section's bottom edge reaches the viewport bottom —
    // not a hardcoded guess (goes stale whenever content above it changes)
    // and not a full top-pin (requires scrolling further than needed).
    // Measured against the inner section, not the outer container — the
    // container is deliberately taller to give the wheel-jack scroll room,
    // but that extra height isn't part of what's visually on screen.
    const sectionRect = containerRef.current?.querySelector('.bowl-scroll-section')?.getBoundingClientRect()
    const sectionTop  = sectionRect?.top ?? 0
    const sectionH    = sectionRect?.height ?? 0
    const LOCK_Y = Math.round(sectionTop + window.scrollY - Math.max(0, window.innerHeight - sectionH))
    let locked   = false
    let lockedAt = 0

    function lockPage() {
      if (locked) return
      locked   = true
      lockedAt = window.scrollY
      const sbw = window.innerWidth - document.documentElement.clientWidth
      document.documentElement.style.overflow     = 'hidden'
      document.documentElement.style.paddingRight = sbw + 'px'
    }
    function unlockPage(targetScrollY) {
      if (!locked) return
      locked = false
      document.documentElement.style.overflow     = ''
      document.documentElement.style.paddingRight = ''
      if (targetScrollY != null) window.scrollTo({ top: targetScrollY, behavior: 'instant' })
    }
    function onScroll() {
      if (locked) return
      const sy = window.scrollY
      if (sy >= LOCK_Y && animProgress < 1) { lockPage(); return }
      if (sy <= LOCK_Y && animProgress >= 1 && !hasPlayed) { lockPage(); return }
      if (sy < LOCK_Y - 50 && animProgress > 0 && !hasPlayed) { animProgress = 0; applyClip(0) }
    }
    function onWheel(e) {
      if (!locked) return
      const delta = e.deltaMode === 1 ? e.deltaY * 18 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY
      if (delta > 0 && animProgress >= 1) { hasPlayed = true; markPlayed(); unlockPage(lockedAt); return }
      if (delta < 0 && animProgress <= 0) { unlockPage(LOCK_Y - 1); return }
      if (delta < 0 && hasPlayed)         { return }
      animProgress = Math.max(0, Math.min(1, animProgress + delta / WHEEL_SCALE))
      applyClip(animProgress)
      if      (animProgress >= 1) { hasPlayed = true; markPlayed(); unlockPage(lockedAt) }
      else if (animProgress <= 0) unlockPage(LOCK_Y - 1)
    }

    applyClip(0)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel',  onWheel,  { passive: false })
    return () => {
      unlockPage()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel',  onWheel)
    }
  }, [])

  return (
    <div>
      {/* Section heading — scrolls in before bowl pins */}
      <div className="bg-cream text-center px-4 pt-14 pb-4">
        <span className="eyebrow block mb-3 text-display-md normal-case tracking-normal font-semibold" style={{ fontFamily: '"Secular One", system-ui, sans-serif' }}>
          החלטתם לעבור לתזונה טבעית - מצוין!
        </span>
        <span className="eyebrow block mb-3 text-[1.006rem]" style={{ fontFamily: '"Secular One", system-ui, sans-serif' }}>
          אבל...
        </span>
        <h2 className="text-display-md font-serif text-earth" style={{ fontFamily: '"Secular One", system-ui, sans-serif' }}>
          טבעי זה לא מספיק ויכול גם לפגוע - צריך גם<br />
          <span className="text-forest font-bold not-italic inline-block mt-1">נכון.</span>
        </h2>
        <p className="text-mist mt-3 max-w-xl mx-auto text-[1.218rem] leading-relaxed" style={{ fontFamily: '"Secular One", system-ui, sans-serif' }}>
          אנחנו בוחרים מה להאכיל את הכלבים שלנו <strong className="font-semibold text-earth/80">כל יום לשארית ימי חייהם</strong>.<br />בלי <strong className="font-semibold text-earth/80">האיזון</strong> הנכון - אנחנו עלולים להזיק יותר מאשר להועיל.
        </p>
      </div>

      <div ref={containerRef} className="bowl-scroll-container" style={{ height: (isTouch || played) ? 'auto' : 'calc(100svh - 91px)' }}>
        <section
          className={`bowl-scroll-section ${(!isTouch && !played) ? 'sticky top-0' : 'relative'} flex flex-col items-center justify-start bg-cream overflow-hidden pt-4 pb-12`}
          style={{ height: (!isTouch && !played) ? 'min(calc(100svh - 95px), calc(min(480px, 90vw) + 80px))' : 'auto' }}
        >
          {/* Bowl */}
          <div
            className="relative flex-shrink-0"
            style={{ width: 'min(480px, 90vw)', height: 'min(480px, 90vw)', clipPath: 'circle(47% at 50% 50%)' }}
          >
            <img src="/newbowl_nobg.png" alt="קערת מזון טבעי"
              style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '100%', height: '100%', objectFit: 'contain' }}
            />
            <img ref={frontRef} src="/kibblebowl4_nobg.png" alt="קיבל"
              style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '100%', height: '100%', objectFit: 'contain', clipPath: 'inset(0 0% 0 0)' }}
            />
            <div ref={dividerRef}
              style={{ position: 'absolute', inset: 0, borderRight: '2px solid rgba(255,255,255,0.85)', clipPath: 'circle(47% at 50% 50%)', filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.15))', pointerEvents: 'none', transform: 'translateX(0%)' }}
            />
          </div>

        </section>
      </div>
    </div>
  )
}

/* ─── Philosophy pillars ─────────────────────────────────── */
function Philosophy() {
  const [ref, visible, done] = useReveal(0.08)

  const PILLARS = [
    {
      icon: <FlaskConical className="w-6 h-6" />,
      title: 'מבוסס על מחקר',
      desc: <>כל תוכן והמלצה מבוססים על תקני AAFCO ו-NRC - <strong className="font-semibold text-earth/80">הסטנדרטים המובילים בעולם</strong> לתזונת כלבים מלאה. בלי טרנדים, בלי תחושות בטן, בלי ניחושים.</>,
      accent: 'border-t-[3px] border-t-honey',
      iconBg: 'bg-honey/10 text-honey',
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      title: 'טבעי הוליסטי',
      desc: <>דגש מרכזי על אוכל <strong className="font-semibold text-earth/80">אמיתי, שלם ומגוון</strong> מאוד כמקור ראשון, עם כמה שפחות תוספים סינטטיים - כבסיס יומיומי מזין לבריאות ואריכות ימים.</>,
      accent: 'border-t-[3px] border-t-olive',
      iconBg: 'bg-olive/10 text-olive',
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'מותאם לכלב שלך',
      desc: <>כל כלב שונה - גיל, משקל, רמת פעילות, מצב בריאותי. המידע, הכלים והייעוצים משרתים את <strong className="font-semibold text-earth/80">הכלב הספציפי שלך</strong>.</>,
      accent: 'border-t-[3px] border-t-[#502814]',
      iconBg: 'bg-[#502814]/10 text-[#502814]',
    },
  ]

  const revealClass = (i) =>
    done ? '' :
    `transition-[opacity,transform] duration-[450ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
    }`

  return (
    <section className="pt-8 pb-section-sm md:pt-12 md:pb-section bg-parchment relative overflow-hidden">
      <img src="/gaia-paw.png" alt="" aria-hidden="true" className="absolute -top-4 -right-4 w-20 h-20 md:-top-8 md:-right-8 md:w-64 md:h-64 opacity-[0.07] pointer-events-none select-none" style={{ transform: 'rotate(35deg)' }} />
      <div className="container-gaia">
        {/* Heading */}
        <div
          ref={ref}
          className={`text-center max-w-2xl mx-auto mb-14 ${
            done ? '' : `transition-[opacity,transform] duration-500 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`
          }`}
        >
          <span className="eyebrow inline-flex items-center gap-2">
            הגישה שלנו:
          </span>
          <p className="text-display-md text-forest font-bold mb-3 mt-1" style={{ fontFamily: '"Secular One", system-ui, sans-serif' }}>הגשר בין מחקר להוליסטיות</p>
          <div className="w-10 border-t border-earth/20 mx-auto my-3" />
          <div className="flex justify-center my-3">
            <h2 className="text-display-md font-serif text-earth md:whitespace-nowrap text-balance text-center">
              נקודת התחלה של מלא ומאוזן - לפי תקנים בינלאומיים
            </h2>
          </div>
          <p className="font-serif text-earth font-bold text-[calc(1rem*1.2*1.1)] mb-4 tracking-wide">
            בלי ניחושים.
          </p>
          <p className="text-mist leading-relaxed max-w-lg mx-auto">
            תזונה מבוססת מדע ותזונה טבעית הוליסטית לא סותרות -
            <span className="block font-semibold text-earth/75 mt-1 text-[1.15em]">הן משלימות.</span>

          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS.map((p, i) => (
            <div
              key={p.title}
              className={revealClass(i)}
              style={!done ? { transitionDelay: `${100 + i * 110}ms` } : undefined}
            >
              <Card className={`text-center h-full group hover:-translate-y-1 transition-transform duration-300 ${p.accent}`}>
                <div className={`w-14 h-14 rounded-full ${p.iconBg} flex items-center justify-center mx-auto mb-5 group-hover:[animation:floatY_2s_ease-in-out_infinite]`}>
                  {p.icon}
                </div>
                <h3 className="text-base font-semibold text-earth mb-2 tracking-tight">{p.title}</h3>
                <p className="text-mist text-sm leading-[1.85]">{p.desc}</p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── How it works ───────────────────────────────────────── */
function WhatYouFind() {
  const [ref, visible, done] = useReveal(0.08)

  const ITEMS = [
    {
      icon: <Calculator className="w-5 h-5" />,
      color: 'bg-forest/[0.08] text-forest',
      title: 'מחשבונים',
      desc: 'כלים חינמיים לחישוב כמויות האכלה, קלוריות, ובניית תפריט לפי תקני AAFCO.',
      cta: { label: 'למחשבונים', path: '/calculators' },
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      color: 'bg-honey/10 text-honey',
      title: 'מאמרים',
      desc: 'תוכן מקצועי על תזונה טבעית - מבוסס מחקר, נגיש ומעשי.',
      cta: { label: 'לקריאת המאמרים', path: '/articles' },
    },
    {
      icon: <Users className="w-5 h-5" />,
      color: 'bg-olive/10 text-olive',
      title: 'ייעוץ אישי',
      desc: 'ליווי מותאם לצרכי הכלב שלכם - תפריט מדויק, מחושב ומאוזן.',
      cta: { label: 'לתיאום ייעוץ', path: '/consultations' },
    },
  ]

  return (
    <section className="pt-10 pb-section-sm md:pt-14 md:pb-section bg-cream relative overflow-hidden">
      <img src="/gaia-paw.png" alt="" aria-hidden="true"
        className="absolute -top-4 -left-4 w-20 h-20 md:-top-8 md:-left-8 md:w-64 md:h-64 opacity-[0.07] pointer-events-none select-none"
        style={{ transform: 'rotate(-12deg)' }}
      />
      <div className="container-gaia max-w-4xl">
        <div
          ref={ref}
          className={`text-center max-w-xl mx-auto mb-10 ${
            done ? '' : `transition-[opacity,transform] duration-500 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`
          }`}
        >
          <h2 className="text-display-sm text-forest mt-1">מה תמצאו פה?</h2>
          <p className="text-mist text-sm mt-3 leading-relaxed">
            כלים פרקטיים, ידע מקצועי וליווי אישי - לתזונה טבעית, מדויקת ומאוזנת.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ITEMS.map((item, i) => (
            <div
              key={item.title}
              className={`card p-6 flex flex-col gap-3 ${
                done ? '' : `transition-[opacity,transform] duration-[450ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
              }`}
              style={!done ? { transitionDelay: `${120 + i * 110}ms` } : undefined}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  {item.icon}
                </div>
                <h3 className="font-semibold text-earth text-sm">{item.title}</h3>
              </div>
              <p className="text-mist text-sm leading-relaxed">{item.desc}</p>
              <Link
                to={item.cta.path}
                className="mt-auto text-sm font-semibold text-forest hover:text-forest-dark flex items-center gap-1.5 transition-colors cursor-pointer group/link"
              >
                {item.cta.label}
                <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:-translate-x-0.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const [ref, visible, done] = useReveal(0.08)

  const STEPS = [
    {
      num: '01',
      icon: <Calculator className="w-5 h-5" />,
      title: 'בדקו מה יש עכשיו',
      desc: <>השתמשו ב<strong className="font-semibold text-earth/80">מחשבון חינמי</strong> כדי לראות אם התפריט הנוכחי של הכלב שלכם עומד בדרישות התזונתיות המינימליות.</>,
      cta: { label: 'לבדיקת איזון בסיסי חינמית', path: '/aafco-balance-check' },
    },
    {
      num: '02',
      icon: <BookOpen className="w-5 h-5" />,
      title: 'הבינו מה חסר',
      desc: <>קבלו <strong className="font-semibold text-earth/80">תמונה ברורה</strong> של מה התפריט נותן - ומה הוא מפספס.</>,
      cta: null,
    },
    {
      num: '03',
      icon: <Calendar className="w-5 h-5" />,
      title: 'בנו תפריט שעובד',
      desc: <>לבד עם הכלים, או איתנו בייעוץ אישי - תצאו עם תפריט שאתם יכולים <strong className="font-semibold text-earth/80">לסמוך עליו</strong>.</>,
      cta: { label: 'צריכים עזרה? אנחנו פה', path: '/consultations' },
    },
  ]

  return (
    <section className="section-padding bg-parchment relative overflow-hidden">
      <img src="/gaia-paw.png" alt="" aria-hidden="true" className="absolute -top-4 -right-4 w-20 h-20 md:-top-8 md:-right-8 md:w-64 md:h-64 opacity-[0.07] pointer-events-none select-none" style={{ transform: 'rotate(15deg)' }} />
      <div className="container-gaia">
        {/* Heading */}
        <div
          ref={ref}
          className={`text-center max-w-xl mx-auto mb-14 ${
            done ? '' : `transition-[opacity,transform] duration-500 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`
          }`}
        >
          <span className="eyebrow inline-flex items-center gap-2 text-[1.15em]">
            מאיפה מתחילים?
          </span>
          <h2 className="text-display-md font-serif text-earth mt-1 text-[1.15em]">
            מאיפה שאתם היום.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Animated connector line */}
          <div
            className="hidden md:block absolute top-[2.25rem] right-[20%] left-[20%] h-px bg-forest/20 origin-right"
            style={visible ? { animation: 'growRight 700ms cubic-bezier(0.23,1,0.32,1) 300ms both' } : { transform: 'scaleX(0)' }}
          />

          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className={`relative flex flex-col items-center text-center group ${
                done ? '' : `transition-[opacity,transform] duration-[450ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
              }`}
              style={!done ? { transitionDelay: `${180 + i * 130}ms` } : undefined}
            >
              {/* Step circle — organic, not square */}
              <div className="relative z-10 w-[4.5rem] h-[4.5rem] rounded-full bg-gradient-to-br from-forest to-forest-dark shadow-cta flex flex-col items-center justify-center mb-5 group-hover:[animation:floatY_2s_ease-in-out_infinite] transition-shadow duration-300 group-hover:shadow-[0_8px_24px_rgba(59,94,65,0.4)]">
                <span className="text-[9px] font-bold text-white/40 mb-0.5 tracking-[0.15em]">{step.num}</span>
                <span className="text-white">{step.icon}</span>
              </div>
              <h3 className="text-base font-semibold text-earth mb-2">{step.title}</h3>
              <p className="text-mist text-sm leading-relaxed mb-4 max-w-[240px]">{step.desc}</p>
              {step.cta && (
                <Link
                  to={step.cta.path}
                  className="text-sm font-semibold text-forest hover:text-forest-dark flex items-center gap-1.5 transition-colors cursor-pointer group/link"
                >
                  {step.cta.label}
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:-translate-x-0.5" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Testimonials ───────────────────────────────────────── */
function Testimonials() {
  const [ref, visible, done] = useReveal(0.08)

  const REVIEWS = [
    {
      name: 'נועה מ.',
      dog:  'הבעלים של שון, לברדור בן 5',
      text: 'האכלתי את שון במזון ביתי מבושל במשך שנתיים בלי לדעת שחסר לו יוד, סידן ועוד נוטריאנטים. הכלי גילה את זה תוך דקה ונתן לי בסיס לעבוד איתו. גאיה דייקו לי את התפריט עד הרכיב האחרון כדי שלא יהיו חוסרים. מקצועיים מאוד!!',
      stars: 5,
      accentColor: 'border-r-olive',
    },
    {
      name: 'דניאל ר.',
      dog:  'הבעלים של לונה, גורת גולדן בת 8 חודשים',
      text: 'לא הבנתי בכלל כמה קריטי האיזון בתקופת הגדילה עד שהשתמשתי במחשבון. הייעוץ נתן לי תפריט מדויק ומדוד שאני סומך עליו, בלי תחושה שאני מנחש או מסכן את הכלב שלי.',
      stars: 5,
      accentColor: 'border-r-forest',
    },
    {
      name: 'שירה מ.',
      dog:  'הבעלים של ברונו, בוקסר בן 8',
      text: 'ברונו כבר מבוגר ועם בעיות מפרקים. מעבר לזה שהבנתי שהתפריט שלנו לא מלא ומאוזן, נחשפתי להמון מרכיבים מבוססי מחקר שעזרו לו לתפקד והוא הרבה יותר טוב! הסבירו לי למה כל רכיב חשוב ובנינו משהו שבאמת מתאים לו.',
      stars: 5,
      accentColor: 'border-r-[#502814]',
    },
  ]

  return (
    <section className="pt-10 pb-section bg-cream">
      <div className="container-gaia">
        {/* Heading */}
        <div
          ref={ref}
          className={`text-center mb-10 ${
            done ? '' : `transition-[opacity,transform] duration-500 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`
          }`}
        >
          <h2 className="text-display-md font-serif text-earth inline-flex items-center gap-3">
            מה אומרים{' '}
            <span className="text-forest">בעלי הכלבים</span>
            <img src="/gaia-paw.png" alt="" className="w-[1em] h-[1em] opacity-70" />
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((r, i) => (
            <div
              key={r.name}
              className={
                done ? '' : `transition-[opacity,transform] duration-[450ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
              }
              style={!done ? { transitionDelay: `${100 + i * 110}ms` } : undefined}
            >
              <Card className={`flex flex-col justify-between h-full border-r-[3px] ${r.accentColor} hover:-translate-y-1 transition-transform duration-300`}>
                <div>
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(r.stars)].map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-[#B8882A] text-[#B8882A]" />
                    ))}
                  </div>
                  <p className="text-bark text-sm leading-[1.85] mb-5">{r.text}</p>
                </div>
                {/* Attribution */}
                <div className="flex items-center gap-3 pt-4 border-t border-stone/50">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sage/60 to-forest flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-warm-sm">
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-earth leading-tight">{r.name}</p>
                    <p className="text-[10px] text-mist leading-tight mt-0.5 whitespace-nowrap">{r.dog}</p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── CTA Banner ─────────────────────────────────────────── */
function CTABanner() {
  const [ref, visible, done] = useReveal(0.1)

  return (
    <section className="section-padding bg-parchment" ref={ref}>
      <div className="container-gaia">
        <div
          className={`relative overflow-hidden rounded-4xl bg-green-gradient p-10 md:p-16 text-center ${
            done ? '' : `transition-[opacity,transform] duration-500 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] ${visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-[0.97] translate-y-4'}`
          }`}
        >
          {/* Radial vignette — darkens edges slightly for depth */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.18) 100%)' }} />
          {/* Paw */}
          <img src="/gaia-paw.png" alt="" className="absolute bottom-0 left-4 w-16 md:w-40 opacity-[0.08] rotate-[-8deg] mix-blend-screen pointer-events-none select-none" />

          <div className="relative z-10 max-w-lg mx-auto">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.08em] uppercase text-white/55 border border-white/20 px-3 py-1 rounded-full mb-6">
              <img src="/gaia-paw.png" alt="" className="w-3 h-3 opacity-80" style={{ filter: 'brightness(0) invert(1)' }} />
              מתחילים היום - בחינם
            </span>
            <h2 className="text-display-sm md:text-display-md font-serif text-white mb-3 text-balance leading-tight">
              לא בטוחים שהתפריט של הכלב שלכם מלא ומאוזן?
            </h2>
            <p className="text-white/55 text-[calc(0.875rem*1.1)] leading-[1.85] mb-8 max-w-md mx-auto">
              תוך כמה דקות בלבד תדעו בדיוק.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                as={Link}
                to="/aafco-balance-check"
                size="lg"
                variant="ghost"
                className="font-bold shadow-lg shadow-black/10 hover:shadow-xl"
                style={{ backgroundColor: '#FAF7F0', color: '#2C4731' }}
                icon={<Calculator className="w-4 h-4" />}
                onClick={() => {}}
              >
                בדיקה חינמית עכשיו
              </Button>
              <Link
                to="/consultations"
                className="flex items-center justify-center gap-2 text-sm font-semibold text-white/55 hover:text-white transition-colors duration-200 cursor-pointer py-2 px-4"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                דברו איתנו
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Page ───────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      {/* Scroll cue arrow — sits just below the TrustBar, centred, flashes to invite scrolling */}
      <div className="flex justify-center bg-cream pt-2 pb-0">
        <img
          src="/arrow.png"
          alt="גללו למטה"
          onClick={() => {
            // Same target the bowl's scroll-lock uses — wherever the bowl
            // first fully fits on screen (see ScrollSplitBowl).
            const el = document.querySelector('.bowl-scroll-section')
            let targetY = 747
            if (el) {
              const rect = el.getBoundingClientRect()
              targetY = Math.round(rect.top + window.scrollY - Math.max(0, window.innerHeight - rect.height))
            }
            window.scrollTo({ top: targetY, behavior: 'smooth' })
          }}
          style={{
            width: 28,
            height: 28,
            opacity: 0.45,
            animation: 'scrollArrowPulse 1.6s ease-in-out infinite',
            cursor: 'pointer',
          }}
        />
      </div>
      <ScrollSplitBowl />
      <Philosophy />
      <WhatYouFind />
      <HowItWorks />
      <Testimonials />
      <CTABanner />
    </>
  )
}

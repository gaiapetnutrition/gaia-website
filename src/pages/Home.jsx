import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import {
  FlaskConical, Leaf, Heart, ShieldCheck, ArrowLeft,
  Calculator, Calendar, BookOpen, Star, ChevronDown,
  Microscope, Award, Users
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
function Hero() {
  return (
    <section className="relative flex items-center overflow-hidden bg-[#FAF5E4]" style={{ height: 'calc(100svh - 204px)', minHeight: 520, maxHeight: 860 }}>

      {/* ── Food photo — sized to height, natural width, never cropped ── */}
      {/* Image is 1128×1023 (near-square). Sizing by height keeps aspect ratio
          stable across all viewport widths: no zoom mismatch between screens. */}
      {/* Dedicated desktop hero image (1536×1024, landscape).
          cover + left center: anchors composition to the left,
          minimal zoom at any desktop width, bowl/ingredients stay visible. */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/long_image.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'left center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Gradient fades image → cream on the right, text side */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent from-[38%] via-[#FAF5E4]/50 via-[58%] to-[#FAF5E4]/85 to-[72%]" />
        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#FAF5E4] to-transparent" />
      </div>

      {/* Decorative paw — bottom-left, barely visible */}
      <img
        src="/gaia-paw.png"
        alt=""
        className="absolute bottom-10 left-6 w-36 opacity-[5%] mix-blend-multiply pointer-events-none select-none rotate-12 z-10"
      />

      {/* ── Text — right side, no box ─────────────────────── */}
      <div className="relative z-10 py-14 md:py-24 flex w-full">
        <div className="mr-[4%] ml-auto w-[38%] min-w-[280px] animate-fade-up text-right pr-2 md:pr-4">

          <span className="inline-block mb-6 text-xs font-semibold tracking-[0.12em] uppercase text-[#3D1A0A] bg-[#FAF5E4]/80 backdrop-blur-sm px-3 py-1 rounded-full border border-[#3D1A0A]/15">
            מבוסס מדע AAFCO ו-NRC
          </span>

          <h1 className="text-display-xl font-serif text-[#3D1A0A] text-balance leading-[1.08] mb-5">
            תזונה שמבינה
            <br />
            את{' '}
            <span className="text-forest italic">הכלב שלכם</span>
          </h1>

          <p
            className="text-base md:text-lg text-[#3D1A0A]/80 leading-relaxed mb-8 animate-fade-up delay-100"
            style={{ textShadow: '0 1px 8px rgba(250,245,228,0.9), 0 0 20px rgba(250,245,228,0.7)' }}
          >
            שילוב ייחודי של מחקר מדעי עדכני עם פילוסופיית מזון מלא וטבעי.
            ייעוץ תזונתי מותאם אישית — כי כל כלב שונה.
          </p>

          <div className="flex flex-col gap-3 animate-fade-up delay-200">
            <Button
              as={Link}
              to="/calculator"
              variant="primary"
              size="lg"
              icon={<Calculator className="w-4 h-4" />}
              onClick={() => {}}
            >
              מחשבון תזונה חינמי
            </Button>
            <Button
              as={Link}
              to="/consultations"
              variant="primary"
              size="lg"
              onClick={() => {}}
            >
              קביעת ייעוץ
            </Button>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-5 mt-10 animate-fade-up delay-300">
            <div className="flex -space-x-2 space-x-reverse">
              {[1,2,3,4].map(i => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-[#FAF5E4] bg-gradient-to-br from-sage to-forest flex items-center justify-center text-white text-xs font-bold"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-forest text-forest" />
                ))}
              </div>
              <p className="text-[#3D1A0A]/45 text-xs">+200 בעלי כלבים מרוצים</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
    </section>
  )
}

/* ─── Trust Bar ──────────────────────────────────────────── */
function TrustBar() {
  const ITEMS = [
    { icon: <Microscope className="w-4 h-4" />, label: 'מבוסס AAFCO & NRC' },
    { icon: <ShieldCheck className="w-4 h-4" />, label: 'ידע מדעי עדכני' },
    { icon: <Leaf className="w-4 h-4" />,       label: 'מזון מלא וטבעי' },
    { icon: <Award className="w-4 h-4" />,      label: 'ייעוץ מקצועי' },
    { icon: <Users className="w-4 h-4" />,      label: '+200 כלבים בריאים' },
  ]
  return (
    <div className="bg-forest text-white">
      <div className="container-gaia py-4">
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3">
          {ITEMS.map((item, i) => (
            <div key={item.label} className="flex items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <span className="text-olive-light">{item.icon}</span>
                {item.label}
              </div>
              {i < ITEMS.length - 1 && (
                <img
                  src="/gaia-paw.png"
                  alt=""
                  className="h-4 w-4 opacity-30 mix-blend-screen hidden sm:block"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Scroll-split bowl animation ───────────────────────── */
// BEFORE image: whole ingredients in a bowl (bowl_try.png)
// AFTER image:  ground / blended version of the same food
// Sticky scroll-jacking bowl reveal.
// Scroll-jacked bowl reveal:
//   • Page scrolls normally until scrollY hits LOCK_Y, then page hard-locks.
//   • Wheel/trackpad drives the clip animation forward OR backward.
//   • Once fully revealed, lock releases and page scrolls normally again.
//   • Scrolling back up re-locks and reverses the animation.
function ScrollSplitBowl() {
  const containerRef = useRef(null)
  const frontRef     = useRef(null)
  const dividerRef   = useRef(null)
  const [played, setPlayed] = useState(false)

  useEffect(() => {
    const INITIAL_CLIP = 0
    const WHEEL_SCALE  = 350

    let animProgress = 0
    let hasPlayed    = false

    function applyClip(p) {
      const clip = INITIAL_CLIP + p * (100 - INITIAL_CLIP)
      if (frontRef.current)   frontRef.current.style.clipPath    = `inset(0 ${clip}% 0 0)`
      if (dividerRef.current) dividerRef.current.style.transform = `translateX(-${clip}%)`
    }

    const LOCK_Y = 747

    let locked   = false
    let lockedAt = 0

    function lockPage() {
      if (locked) return
      locked   = true
      lockedAt = window.scrollY
      const sbw = window.innerWidth - document.documentElement.clientWidth
      document.documentElement.style.overflow    = 'hidden'
      document.documentElement.style.paddingRight = sbw + 'px'
    }

    function unlockPage(targetScrollY) {
      if (!locked) return
      locked = false
      document.documentElement.style.overflow    = ''
      document.documentElement.style.paddingRight = ''
      if (targetScrollY != null) {
        window.scrollTo({ top: targetScrollY, behavior: 'instant' })
      }
    }

    function onScroll() {
      if (locked) return
      const sy = window.scrollY

      if (sy >= LOCK_Y && animProgress < 1) { lockPage(); return }
      if (sy <= LOCK_Y && animProgress >= 1 && !hasPlayed) { lockPage(); return }

      if (sy < LOCK_Y - 50 && animProgress > 0 && !hasPlayed) {
        animProgress = 0
        applyClip(0)
      }
    }

    function onWheel(e) {
      if (!locked) return

      const delta = e.deltaMode === 1 ? e.deltaY * 18
                  : e.deltaMode === 2 ? e.deltaY * window.innerHeight
                  : e.deltaY

      if (delta > 0 && animProgress >= 1) { hasPlayed = true; setPlayed(true); unlockPage(lockedAt);   return }
      if (delta < 0 && animProgress <= 0) { unlockPage(LOCK_Y - 1); return }
      if (delta < 0 && hasPlayed)         { return }

      animProgress = Math.max(0, Math.min(1, animProgress + delta / WHEEL_SCALE))
      applyClip(animProgress)

      if      (animProgress >= 1) { hasPlayed = true; setPlayed(true); unlockPage(lockedAt) }
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
      {/* Headline scrolls in normally — user sees it, THEN bowl pins below */}
      <div className="bg-cream text-center px-4 pt-10 pb-2">
        <span className="eyebrow block mb-2">הטרנספורמציה שבקערה</span>
        <h2 className="text-display-sm font-serif text-earth">
          מרכיבים שלמים →{' '}
          <span className="gradient-text">תזונה מושלמת</span>
        </h2>
        <p className="text-mist mt-3 max-w-md mx-auto text-sm leading-relaxed">
          גללו כדי לראות כיצד המרכיבים הטבעיים הופכים לארוחה מאוזנת ומותאמת אישית
        </p>
      </div>

      <div ref={containerRef} style={{ height: played ? 'auto' : 'calc(100svh - 91px)' }}>
        <section
          className={`${played ? 'relative' : 'sticky top-0'} flex flex-col items-center justify-start gap-6 bg-cream overflow-hidden pt-6`}
          style={{ height: played ? 'auto' : 'min(calc(100svh - 95px), calc(min(480px, 90vw) + 60px))' }}
        >
          {/* Bowl container */}
          <div
            className="relative flex-shrink-0"
            style={{ width: 'min(480px, 90vw)', height: 'min(480px, 90vw)', clipPath: 'circle(47% at 50% 50%)' }}
          >
            <img
              src="/newbowl_nobg.png"
              alt="קערה חדשה"
              style={{
                position: 'absolute', left: '50%', top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%', height: '100%', objectFit: 'contain',
              }}
            />
            <img
              ref={frontRef}
              src="/kibblebowl4_nobg.png"
              alt="קערת קיבל"
              style={{
                position: 'absolute', left: '50%', top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%', height: '100%', objectFit: 'contain',
                clipPath: 'inset(0 12% 0 0)',
              }}
            />
            <div
              ref={dividerRef}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                borderRight: '3px solid rgba(255,255,255,0.92)',
                boxSizing: 'border-box',
                clipPath: 'circle(47% at 50% 50%)',
                filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.18))',
                pointerEvents: 'none',
                transform: 'translateX(-12%)',
              }}
            />
          </div>

        </section>
      </div>
    </div>
  )
}

/* ─── Philosophy pillars ─────────────────────────────────── */
function Philosophy() {
  const [ref, visible, done] = useReveal()

  const PILLARS = [
    {
      icon: <FlaskConical className="w-7 h-7" />,
      title: 'מבוסס מדע',
      desc: 'כל המלצה נשענת על מחקר עדכני ועל תקני AAFCO ו-NRC. ללא טרנדים חולפים — רק עובדות ומספרים.',
      color: 'bg-forest/[8%] text-forest',
    },
    {
      icon: <Leaf className="w-7 h-7" />,
      title: 'מזון מלא וטבעי',
      desc: 'דגש על מזונות שלמים ואיכותיים עם מינימום עיבוד. תזונה שהגוף מזהה ויודע לנצל בצורה מיטבית.',
      color: 'bg-olive/10 text-olive-dark',
    },
    {
      icon: <Heart className="w-7 h-7" />,
      title: 'מותאם אישית',
      desc: 'כל כלב הוא ייחודי. הייעוץ מתחשב בגיל, גזע, מצב בריאותי, רמת פעילות ואורח חיים.',
      color: 'bg-clay/[8%] text-clay-dark',
    },
  ]

  return (
    <section className="pt-6 pb-section-sm md:pt-8 md:pb-section bg-cream">
      <div className="container-gaia">
        <div
          ref={ref}
          className={done ? '' : `transition-[opacity,transform] duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {/* Heading */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="flex items-center justify-center gap-3 mb-1">
              <img src="/gaia-paw.png" alt="" className="h-6 w-6 mix-blend-multiply opacity-60" />
              <span className="eyebrow">הגישה שלנו</span>
              <img src="/gaia-paw.png" alt="" className="h-6 w-6 mix-blend-multiply opacity-60" />
            </div>
            <h2 className="text-display-md font-serif text-earth mb-4">
              שלושה עקרונות,&nbsp;
              <span className="gradient-text">כלב אחד בריא</span>
            </h2>
            <p className="text-mist leading-relaxed">
              GAiA נולדה מהאמונה שתזונה מדעית ותזונה טבעית אינן סותרות —
              הן משלימות. יחד הן יוצרות את הבסיס לאריכות ימים ואיכות חיים.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PILLARS.map((p, i) => (
              <Card
                key={p.title}
                className="text-center"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className={`w-16 h-16 rounded-2xl ${p.color} flex items-center justify-center mx-auto mb-5`}>
                  {p.icon}
                </div>
                <h3 className="text-lg font-semibold text-earth mb-3">{p.title}</h3>
                <p className="text-mist text-sm leading-relaxed">{p.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── How it works ───────────────────────────────────────── */
function HowItWorks() {
  const [ref, visible, done] = useReveal()

  const STEPS = [
    {
      num: '01',
      icon: <Calculator className="w-5 h-5" />,
      title: 'מחשבון תזונה',
      desc: 'הזינו את פרטי הכלב שלכם — משקל, גיל, רמת פעילות ועוד. קבלו את הצרכים הקלוריים המדויקים תוך שניות.',
      cta: { label: 'לכלי החינמי', path: '/calculator' },
    },
    {
      num: '02',
      icon: <BookOpen className="w-5 h-5" />,
      title: 'הבינו את התוצאות',
      desc: 'קבלו פירוט חזותי של הצרכים התזונתיים — חלבון, שומן, פחמימות, מינרלים וויטמינים — עם הסברים ברורים.',
      cta: null,
    },
    {
      num: '03',
      icon: <Calendar className="w-5 h-5" />,
      title: 'ייעוץ אישי',
      desc: 'רוצים להעמיק? קבעו ייעוץ עם מומחית התזונה של GAiA וקבלו תוכנית מזון מותאמת אישית לכלב שלכם.',
      cta: { label: 'לקביעת ייעוץ', path: '/consultations' },
    },
  ]

  return (
    <section className="section-padding bg-parchment">
      <div className="container-gaia">
        <div
          ref={ref}
          className={done ? '' : `transition-[opacity,transform] duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="eyebrow">איך זה עובד</span>
            <h2 className="text-display-md font-serif text-earth">
              תזונה נכונה ב-3 צעדים
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-10 right-[16.66%] left-[16.66%] h-px bg-stone" />

            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className="relative flex flex-col items-center text-center"
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="relative z-10 w-20 h-20 rounded-2xl bg-white border border-stone shadow-card flex flex-col items-center justify-center mb-5">
                  <span className="text-xs font-bold text-mist mb-1">{step.num}</span>
                  <span className="text-forest">{step.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-earth mb-2">{step.title}</h3>
                <p className="text-mist text-sm leading-relaxed mb-4 max-w-xs">{step.desc}</p>
                {step.cta && (
                  <Link
                    to={step.cta.path}
                    className="text-sm font-semibold text-forest hover:text-olive-dark flex items-center gap-1 transition-colors"
                  >
                    {step.cta.label}
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Testimonials ───────────────────────────────────────── */
function Testimonials() {
  const [ref, visible, done] = useReveal()

  const REVIEWS = [
    {
      name: 'מיכל כ.',
      dog:  'בעלת מקס, לברדור 5 שנים',
      text: 'לאחר שנתיים של בעיות עיכול, מצאתי את התשובות כאן. מקס עלה במשקל הנכון ועורו נוצץ. ממליצה בחום לכל בעלי כלבים.',
      stars: 5,
    },
    {
      name: 'דניאל ר.',
      dog:  'בעל לונה, גולדן גור 8 חודשים',
      text: 'המחשבון עזר לי להבין כמה אוכל לתת ללונה בתקופת הגדילה. הייעוץ היה מפורט ומדויק. שירות מקצועי ברמה גבוהה.',
      stars: 5,
    },
    {
      name: 'שירה מ.',
      dog:  'בעלת ברונו, בוקסר 8 שנים',
      text: 'ברונו מבוגר ויש לו צרכים מיוחדים. המומחית הסבירה לי בדיוק מה הוא צריך ובנינו יחד תוכנית שמתאימה לו.',
      stars: 5,
    },
  ]

  return (
    <section className="section-padding bg-cream">
      <div className="container-gaia">
        <div
          ref={ref}
          className={done ? '' : `transition-[opacity,transform] duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-1">
              <img src="/gaia-paw.png" alt="" className="h-5 w-5 mix-blend-multiply opacity-50" />
              <span className="eyebrow">מה אומרים</span>
              <img src="/gaia-paw.png" alt="" className="h-5 w-5 mix-blend-multiply opacity-50" />
            </div>
            <h2 className="text-display-md font-serif text-earth">
              כלבים בריאים, בעלים מרוצים
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <Card key={r.name} style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(r.stars)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-olive text-olive" />
                  ))}
                </div>
                <p className="text-bark text-sm leading-relaxed mb-5">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sage to-forest flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-earth">{r.name}</p>
                    <p className="text-xs text-mist">{r.dog}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── CTA Banner ─────────────────────────────────────────── */
function CTABanner() {
  const [ref, visible, done] = useReveal()

  return (
    <section className="section-padding" ref={ref}>
      <div className="container-gaia">
        <div
          className={`
            relative overflow-hidden rounded-4xl bg-green-gradient
            p-10 md:p-16 text-center
            ${done ? '' : `transition-[opacity,transform] duration-700 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          `}
        >
          {/* Decorative blobs */}
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-black/10 translate-x-1/3 translate-y-1/3 pointer-events-none" />
          {/* Paw decorations */}
          <img src="/gaia-paw.png" alt="" className="absolute top-4 right-6 w-20 opacity-10 rotate-[-20deg] mix-blend-screen pointer-events-none select-none" />
          <img src="/gaia-paw.png" alt="" className="absolute bottom-4 left-6 w-14 opacity-10 rotate-[15deg] mix-blend-screen pointer-events-none select-none" />

          <div className="relative z-10 max-w-xl mx-auto">
            <Badge variant="white" className="mb-5">מתחילים היום</Badge>
            <h2 className="text-display-md font-serif text-white mb-4">
              הכלב שלכם מגיע לתזונה הטובה ביותר
            </h2>
            <p className="text-white/70 leading-relaxed mb-8">
              הצטרפו למאות בעלי כלבים שכבר גילו את ההבדל שתזונה נכונה עושה —
              באנרגיה, בעור, בבריאות הכללית.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
<Button
                as={Link}
                to="/consultations"
                size="lg"
                className="bg-transparent border-2 border-white/40 text-white hover:bg-white/10"
                onClick={() => {}}
              >
                קביעת ייעוץ
              </Button>
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
          onClick={() => window.scrollTo({ top: 747, behavior: 'smooth' })}
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
      <HowItWorks />
      <Testimonials />
      <CTABanner />
    </>
  )
}

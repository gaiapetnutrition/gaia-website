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
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Fallback: show after 400ms if observer never fires (SSR / iframe contexts)
    const timer = setTimeout(() => setVisible(true), 400)
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); clearTimeout(timer); obs.disconnect() } },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(el)
    return () => { obs.disconnect(); clearTimeout(timer) }
  }, [threshold])
  return [ref, visible]
}

/* ─── Hero ───────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-earth">

      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-dog.jpg"
          alt=""
          className="w-full h-full object-cover object-center opacity-50"
          onError={e => { e.target.style.display = 'none' }}
        />
        {/* Gradient overlay — stronger on content side (RTL = right) */}
        <div className="absolute inset-0 bg-gradient-to-l from-earth/20 via-earth/60 to-earth/90" />
        {/* Subtle bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-earth to-transparent" />
      </div>

      {/* Decorative circle */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-olive/10 blur-3xl pointer-events-none" />

      <div className="container-gaia relative z-10 py-20 md:py-32">
        <div className="max-w-2xl">

          <Badge variant="olive" className="mb-6 text-xs animate-fade-in" dot>
            מבוסס מדע AAFCO ו-NRC
          </Badge>

          <h1 className="text-display-xl font-serif text-white text-balance leading-[1.08] mb-6 animate-fade-up">
            תזונה שמבינה
            <br />
            את{' '}
            <span className="text-olive-light italic">הכלב שלכם</span>
          </h1>

          <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-10 max-w-xl animate-fade-up delay-100">
            שילוב ייחודי של מחקר מדעי עדכני עם פילוסופיית מזון מלא וטבעי.
            ייעוץ תזונתי מותאם אישית — כי כל כלב שונה.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 animate-fade-up delay-200">
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
              variant="ghost"
              size="lg"
              className="border-2 border-white/40 text-white hover:bg-white hover:text-forest bg-transparent"
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
                  className="w-9 h-9 rounded-full border-2 border-earth bg-gradient-to-br from-sage to-forest flex items-center justify-center text-white text-xs font-bold"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-olive text-olive" />
                ))}
              </div>
              <p className="text-white/60 text-xs">+200 בעלי כלבים מרוצים</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <ChevronDown className="w-5 h-5 text-white/40" />
      </div>
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
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {ITEMS.map(item => (
            <div key={item.label} className="flex items-center gap-2 text-sm text-white/80">
              <span className="text-olive-light">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Philosophy pillars ─────────────────────────────────── */
function Philosophy() {
  const [ref, visible] = useReveal()

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
    <section className="section-padding bg-cream">
      <div className="container-gaia">
        <div
          ref={ref}
          className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {/* Heading */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="eyebrow">הגישה שלנו</span>
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
  const [ref, visible] = useReveal()

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
          className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
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
  const [ref, visible] = useReveal()

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
          className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center mb-12">
            <span className="eyebrow">מה אומרים</span>
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
  const [ref, visible] = useReveal()

  return (
    <section className="section-padding" ref={ref}>
      <div className="container-gaia">
        <div
          className={`
            relative overflow-hidden rounded-4xl bg-green-gradient
            p-10 md:p-16 text-center
            transition-all duration-700
            ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          `}
        >
          {/* Decorative blobs */}
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-black/10 translate-x-1/3 translate-y-1/3 pointer-events-none" />

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
                to="/calculator"
                variant="primary"
                size="lg"
                className="bg-white text-forest hover:bg-cream shadow-lg"
                onClick={() => {}}
              >
                מחשבון חינמי
              </Button>
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
      <Philosophy />
      <HowItWorks />
      <Testimonials />
      <CTABanner />
    </>
  )
}

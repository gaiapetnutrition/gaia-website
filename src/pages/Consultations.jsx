import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle, ChevronDown, ChevronUp, Clock, ArrowLeft,
  FlaskConical, FileText, Heart, AlertCircle,
} from 'lucide-react'

/* ─── Scroll reveal hook ─────────────────────────────────────── */
function useReveal(threshold = 0.1) {
  const ref       = useRef(null)
  const hasPlayed = useRef(false)
  const [visible, setVisible] = useState(false)
  const [done,    setDone]    = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const show = () => {
      if (hasPlayed.current) return
      hasPlayed.current = true
      setVisible(true)
      setTimeout(() => setDone(true), 750)
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

/* ─── ADF Video Showcase ─────────────────────────────────────── */
const ADF_VIDEOS = [
  { src: '/ADF_videos/ADF_1.mov', caption: 'ניסוח מתכון לפי פרופיל תזונתי מלא - כל רכיב מחושב ומתועד.' },
  { src: '/ADF_videos/ADF_2.mov', caption: 'הגדרת יחסים בין חלבון, שומן ופחמימות לפי משקל ושלב החיים.' },
  { src: '/ADF_videos/ADF_3.mov', caption: 'בדיקת עמידה בדרישות AAFCO/NRC לפני אישור סופי של המתכון.' },
  { src: '/ADF_videos/ADF_4.mov', caption: 'תוצר מוגמר - מתכון כתוב עם כמויות, תוספים ורשימת מרכיבים.' },
]
const PREVIEW_MS = 4200

/*
 * Tuning knobs:
 *   EXPAND_RATIO   - how much wider the active card becomes (inactive = 1, active = this)
 *   EXPAND_MS      - card expand/shrink animation duration in ms
 *   PREVIEW_MS     - how long each card plays before advancing
 */
const EXPAND_RATIO = 1.75
const EXPAND_MS    = 420
const EXPAND_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)'

// Module-level: survives React remounts (tab switch) but resets on page reload
let adfSequencePlayed = false

function ADFShowcase() {
  const alreadyPlayed = adfSequencePlayed

  // -1 = not yet started, 0–3 = active card index, null = sequence done
  // If already played this session, skip straight to final card (static state)
  const [activeIdx, setActiveIdx] = useState(alreadyPlayed ? ADF_VIDEOS.length - 1 : -1)
  const [inView, setInView]       = useState(false)

  const sectionRef     = useRef(null)
  const videoRefsDesk  = useRef([])  // desktop flex row refs
  const videoRefsMob   = useRef([])  // mobile grid refs
  const timerRef       = useRef(null)
  const pendingObsRef  = useRef(null)

  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const autoEnabled   = !reducedMotion && !alreadyPlayed

  // Start the sequence once all cards are visible.
  // On mobile the last card (index 3) is in the bottom row - observe it so the
  // sequence only kicks off after the user has scrolled the full grid into view.
  useEffect(() => {
    if (alreadyPlayed) return  // sequence already ran this session
    // On desktop: wait for first video card to be visible (not the whole section, which includes heading above the cards).
    // On mobile: wait for the last card (bottom of 2×2 grid).
    const waitFor = () => {
      const firstDeskVid = videoRefsDesk.current[0]
      if (firstDeskVid && firstDeskVid.offsetParent !== null) return firstDeskVid
      const lastMobCard = videoRefsMob.current[ADF_VIDEOS.length - 1]?.closest('[aria-label]')
      if (lastMobCard && lastMobCard.offsetParent !== null) return lastMobCard
      return sectionRef.current
    }
    // Defer slightly so refs are populated after first render
    const t = setTimeout(() => {
      const el = waitFor()
      if (!el) return
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { setInView(true); obs.disconnect() }
      }, { threshold: 0.5 })
      obs.observe(el)
    }, 50)
    return () => clearTimeout(t)
  }, [])

  // Kick off sequence when inView flips true
  useEffect(() => {
    if (!autoEnabled || !inView) return
    setActiveIdx(0)
  }, [autoEnabled, inView])

  // Returns the visible video element for a given index
  const getVid = (idx) => {
    const desk = videoRefsDesk.current[idx]
    // offsetParent is null when an element or ancestor has display:none
    if (desk && desk.offsetParent !== null) return desk
    return videoRefsMob.current[idx] || null
  }

  // Advance through cards 0→1→2→3, then stop (activeIdx stays at 3)
  useEffect(() => {
    if (activeIdx < 0 || activeIdx === null) return

    // Cancel any previous pending-visibility observer
    if (pendingObsRef.current) { pendingObsRef.current.disconnect(); pendingObsRef.current = null }

    const vid = getVid(activeIdx)
    if (!vid) return

    const playAndSchedule = () => {
      vid.currentTime = 0; vid.muted = true; vid.play().catch(() => {})
      if (activeIdx === ADF_VIDEOS.length - 1) {
        adfSequencePlayed = true
        return
      }
      timerRef.current = setTimeout(() => {
        vid.pause(); vid.currentTime = 0
        setActiveIdx(i => i + 1)
      }, PREVIEW_MS)
    }

    // If the video card isn't in the viewport yet, wait until it is
    const rect = vid.getBoundingClientRect()
    const visible = rect.top < window.innerHeight && rect.bottom > 0
    if (visible) {
      playAndSchedule()
    } else {
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { obs.disconnect(); pendingObsRef.current = null; playAndSchedule() }
      }, { threshold: 0.3 })
      obs.observe(vid)
      pendingObsRef.current = obs
    }

    return () => {
      clearTimeout(timerRef.current)
      if (pendingObsRef.current) { pendingObsRef.current.disconnect(); pendingObsRef.current = null }
      if (!vid.paused) { vid.pause(); vid.currentTime = 0 }
    }
  }, [activeIdx])

  return (
    <section
      ref={sectionRef}
      className="pt-10 pb-section bg-cream relative overflow-hidden"
      aria-label="סרטוני הדגמה - Animal Diet Formulator"
    >
      <img src="/gaia-paw.png" alt="" aria-hidden="true"
        className="absolute -top-3 -right-4 w-20 h-20 md:-top-6 md:-right-8 md:w-64 md:h-64 opacity-[0.07] pointer-events-none select-none"
        style={{ transform: 'rotate(15deg)' }}
      />
      <div className="container-gaia max-w-5xl">

        {/* Heading */}
        <div className="text-center mb-8">
          <span className="eyebrow block mb-3">כלי מקצועי לכתיבת מתכונים</span>
          <h2 className="text-display-sm font-serif text-earth">
            Animal Diet Formulator - כלי דיוק מתכונים לפני תקנים ברורים המשמש וטרינרים ותזונאים ברחבי העולם
          </h2>
          <p className="text-mist text-sm max-w-xs mx-auto mt-2 leading-relaxed">
            כך נראית עבודת הניסוח מאחורי הקלעים - מדידה, בדיקה ואיזון.
          </p>
        </div>

        {/* ── Desktop: expanding flex row (no pointer interaction on cards) ── */}
        {/* Card height: edit `height` below (default 230px)                   */}
        <div
          className="hidden sm:flex gap-3 items-stretch"
          style={{ height: '230px' }}
        >
          {ADF_VIDEOS.map((v, i) => {
            const isActive = i === activeIdx
            return (
              <div
                key={i}
                aria-label={`סרטון ${i + 1}: ${v.caption}`}
                className="relative flex flex-col rounded-2xl overflow-hidden bg-white pointer-events-none select-none"
                style={{
                  flexGrow: isActive ? EXPAND_RATIO : 1,
                  flexShrink: 1,
                  flexBasis: 0,
                  minWidth: 0,
                  boxShadow: isActive
                    ? '0 6px 28px rgba(0,0,0,0.11)'
                    : '0 1px 6px rgba(0,0,0,0.06)',
                  transition: `flex-grow ${EXPAND_MS}ms ${EXPAND_EASING}, box-shadow 300ms ease`,
                }}
              >
                {/* Video fills all space above caption */}
                <div className="relative overflow-hidden flex-1 min-h-0">
                  <video
                    ref={el => { videoRefsDesk.current[i] = el }}
                    src={v.src}
                    className="absolute inset-0 w-full h-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                    tabIndex={-1}
                  />

                  {/* Dim overlay on inactive cards */}
                  <div
                    className="absolute inset-0 bg-bark/25 pointer-events-none transition-opacity duration-300"
                    style={{ opacity: isActive ? 0 : 1 }}
                  />
                </div>

                {/* Caption - auto height so text is always fully visible */}
                <div className="px-3 py-2.5 flex-shrink-0">
                  <p
                    className="text-[11px] leading-[1.45] transition-colors duration-300 font-semibold"
                    style={{ color: isActive ? '#5a4637' : '#b0a096' }}
                  >
                    {v.caption}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Mobile: 2-col grid with auto-play sequence ── */}
        <div className="grid grid-cols-2 gap-3 sm:hidden">
          {ADF_VIDEOS.map((v, i) => {
            const isActive = i === activeIdx
            return (
              <div
                key={i}
                className="flex flex-col rounded-xl overflow-hidden bg-white shadow-card"
                aria-label={`סרטון ${i + 1}: ${v.caption}`}
                style={{ boxShadow: isActive ? '0 6px 28px rgba(0,0,0,0.11)' : '0 1px 6px rgba(0,0,0,0.06)', transition: 'box-shadow 300ms ease' }}
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <video
                    ref={el => { videoRefsMob.current[i] = el }}
                    src={v.src}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                    tabIndex={-1}
                  />
                  <div
                    className="absolute inset-0 bg-bark/25 pointer-events-none transition-opacity duration-300"
                    style={{ opacity: isActive ? 0 : 1 }}
                  />
                </div>
                <div className="px-2.5 py-2.5">
                  <p className="text-[11px] leading-snug transition-colors duration-300 font-semibold"
                    style={{ color: isActive ? '#5a4637' : '#b0a096' }}>
                    {v.caption}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

/* ─── Data ───────────────────────────────────────────────────── */

const FAQS = [
  {
    q: 'האם אתה וטרינר?',
    a: 'אני תזונאי כלבים מוסמך - אני לא וטרינר ולא מאבחן מחלות. הייעוץ שלי מתמקד בתזונה בלבד: בניית תפריטים, ניסוח מתכונים מלאים ומאוזנים והכוונה להאכלה נכונה. יותר מזה - התזונה מותאמת תמיד בהתאם למצב הרפואי של הכלב והמלצות הוטרינר. לכל שאלה רפואית, פנו לוטרינר המטפל שלכם.',
  },
  {
    q: 'האם הייעוץ מתאים אם הכלב שלי אוכל מזון יבש?',
    a: 'בהחלט. חלק גדול מהמתייעצים שלי מגיעים עם כלבים שאוכלים מזון יבש ורוצים להבין אם יש אלטרנטיבה, או לשלב בין השניים. נתאים את התזונה בהתאם ליכולות שלכם ואם תרצו - נעשה יחד את המעבר בצורה הדרגתית ומחושבת.',
  },
  {
    q: 'האם אני צריך בדיקות דם לפני הייעוץ?',
    a: 'לא חובה, אבל אם יש בדיקות עדכניות - מאוד מומלץ להביא. הן עוזרות לי לתת המלצות מדויקות יותר. לכלבים עם בעיות רפואיות, בדיקות דם עשויות להיות חיוניות.',
  },
  {
    q: 'האם אקבל מתכונים ספציפיים עם כמויות?',
    a: 'בחבילות 2, 3 ו-4 - כן. אני עובד עם תוכנת Animal Diet Formulator ומנסח מתכונים מלאים ומאוזנים בהתאם לנתוני הכלב שלכם, כולל כמויות מדויקות ורשימת תוספים. לא "המלצה כללית", אלא מתכון מחושב.',
  },
  {
    q: 'האם אתם עוזרים גם עם אוכל נא?',
    a: 'כן, בהחלט. מהניסיון שלנו מזון נא לא מתאים לכל הכלבים, כן בא עם סיכונים ועדיף כשיש חשיפה מגיל צעיר כמה שיותר, אך בהחלט יכול להתאים להרבה כלבים אם עושים את זה נכון.',
  },
  {
    q: 'האם כל אחד יכול להשתמש בתוכנה?',
    a: 'כן, אבל לא מומלץ. כל אחד יכול טכנית להשתמש בתוכנה (בתשלום), אבל לא מומלץ לבנות תפריטים לגמרי לבד בלי ידע מקצועי בתזונת בעלי חיים.\nהכנת מתכון מלא ומאוזן דורשת הבנה של צרכים תזונתיים, מינונים בטוחים של רכיבים, יחס נכון בין חלבון, שומן, ויטמינים ומינרלים ועוד - זו ממש תורה בפני עצמה. טעות קטנה במינונים או בהרכב עלולה להוביל לאורך זמן לחוסרים או לעומסים תזונתיים, שגם אם לא רואים מיד – יכולים לפגוע בבריאות הכלב.\nלכן התוכנה מיועדת בעיקר לבעלי מקצוע מוסמכים, ואחרת ככלי עזר וחשיבה, שרצוי להשתמש בו יחד עם מתכונים שנבדקו מראש או בליווי איש מקצוע (וטרינר/יועץ תזונה), במיוחד אצל גורים, כלבים מבוגרים או כלבים עם בעיות רפואיות.',
  },
  {
    q: 'מה אם לכלב שלי יש מצב רפואי?',
    a: 'אני יכול לעבוד עם תזונה תומכת לכלבים עם אלרגיות, בעיות עיכול, מחלת כליות ועוד - תמיד בתיאום עם הוטרינר המטפל. חבילה 4 מיועדת בדיוק למקרים כאלה. אני לא מאבחן ולא מחליף טיפול רפואי בשום פנים.',
  },
  {
    q: 'האם הייעוץ מתאים לגורים?',
    a: 'כן. דרישות התזונה של גורים שונות משל כלבים בוגרים, ובניית בסיס תזונתי נכון בשלב הגדילה היא קריטית.',
  },
  {
    q: 'כמה זמן לוקח לקבל את המתכון?',
    a: 'את המתכון אנחנו בונים ביחד במהלך הפגישה. לאחר שיחת הייעוץ (עד 3 ימי עסקים) יישלח אליכם המתכון עם הסברים מלאים, כמויות ורשימת תוספים מומלצים במידת הצורך.',
  },
]

const PLANS = [
  {
    id: 'initial',
    name: 'שיחת ייעוץ',
    subtitle: 'ייעוץ',
    duration: 'שיחה של כ-45 דקות',
    price: '250',
    badge: null,
    flagship: false,
    desc: 'שיחה ממוקדת, סקירה של התפריט הנוכחי, תשובות לשאלות, תוספים, המלצות נקודתיות לבעיות בריאותיות.',
    features: [
      'סקירת התזונה הנוכחית',
      'תשובות לשאלות ממוקדות',
      'המלצות על מזון ותוספי מזון',
      'סיכום כתוב',
    ],
    note: 'לא כולל ניסוח מתכון',
  },
  {
    id: 'transition',
    name: 'מעבר לתזונה טבעית',
    subtitle: 'תוכנית מעבר',
    duration: '60 דקות ייעוץ + תוכנית + מתכונים + ליווי ותמיכה',
    price: '520',
    badge: null,
    flagship: false,
    desc: 'תוכנית מעבר הדרגתית, 2 מתכונים עם בסיס מלא ומאוזן, הסברים פרקטיים על מצרכים, דרכי הכנה, ציוד, תוספים, ותמיכה לאחר השיחה.',
    features: [
      'שיחת ייעוץ של כ-60 דקות',
      'תוכנית מעבר הדרגתית מתזונה יבשה',
      '2 מתכונים עם בסיס מלא ומאוזן מותאמים אישית',
      'ניסוח עם Animal Diet Formulator',
      '2 מתכונים מלאים ומאוזנים',
      'המלצות תוספים מותאמות',
      'תוכנית כתובה מלאה',
      'תמיכה בווטסאפ לאחר השיחה ל-3 שבועות הרגלה',
    ],
    note: null,
  },
  {
    id: 'formulation',
    name: 'ייעוץ וניסוח מתכונים או שיפור מתכונים קיימים',
    subtitle: 'ייעוץ + מתכונים',
    duration: '60 דקות ייעוץ + מתכונים',
    price: '590',
    badge: 'הכי מקיף',
    flagship: true,
    desc: 'שיחת ייעוץ, 2 מתכונים מותאמים אישית עם בסיס מלא ומאוזן, הסברים פרקטיים, דרכי הכנה, תוספים לפי הצורך.',
    features: [
      'שאלון קליטה מפורט',
      'שיחת ייעוץ של כ-60 דקות',
      'ניסוח עם Animal Diet Formulator',
      '2 מתכונים מלאים ומאוזנים',
      'המלצות תוספים מותאמות',
      'תוכנית כתובה מלאה',
    ],
    note: null,
  },
  {
    id: 'complex',
    name: 'תמיכה תזונתית מורכבת',
    subtitle: 'לצרכים מיוחדים',
    duration: '60 דקות + ניסוח מעמיק',
    price: '690',
    badge: null,
    flagship: false,
    desc: 'לכלבים עם אלרגיות, בעיות עיכול, מחלת כליות, או כל מצב שדורש התאמה תזונתית מדוקדקת בתיאום עם הוטרינר.',
    features: [
      'שאלון קליטה מורחב',
      'שיחת ייעוץ של כ-60 דקות',
      '2 מתכונים מותאמות למצב הרפואי',
      'תיאום עם הגישה הווטרינרית',
    ],
    note: 'אינו מחליף אבחון או טיפול וטרינרי',
  },
]

const WHO_FOR = [
  {
    icon: '🔄',
    title: 'רוצים לעבור מתזונה יבשה לטבעית',
    desc: 'ורוצים לעשות את זה נכון - בצורה הדרגתית, מחושבת ובטוחה.',
  },
  {
    icon: '🍳',
    title: 'מכינים אוכל ביתי',
    desc: 'ולא בטוחים אם התפריט שלהם עומד בסטנדרטים הנכונים.',
  },
  {
    icon: '🐕',
    title: 'רוצים לתסף מזון טבעי קנוי',
    desc: 'מה חסר במזון הטבעי הקנוי שלכם, ואיך לתסף אותו בצורה בטוחה ומאוזנת לפי צרכי הכלב.',
  },
  {
    icon: '🩺',
    title: 'כלב עם צרכים מיוחדים',
    desc: 'אלרגיות, עיכול, כליות - ורוצים תמיכה תזונתית מקצועית לצד הוטרינר.',
  },
  {
    icon: '❓',
    title: 'מבולבלים ממידע סותר',
    desc: 'ורוצים מקור אחד, מהימן, מבוסס מחקר - לא מיתוסים ולא טרנדים.',
  },
  {
    icon: '🔬',
    title: 'מחפשים גישה מדעית',
    desc: 'ניסוח מחושב לפי AAFCO/NRC - לא "ארוחה טבעית" כללית.',
  },
]

const STEPS = [
  {
    n: '01',
    title: 'שאלון קליטה קצר',
    desc: 'לאחר קביעת תור תקבלו שאלון מפורט על הכלב: גיל, משקל, מצב בריאותי, אוכל נוכחי, והיסטוריה רלוונטית.',
  },
  {
    n: '02',
    title: 'סקירה וניתוח',
    desc: 'אנחנו בוחנים את הנתונים, מנתחים את התפריט הנוכחי, ומכינים את עצמנו לשיחה עם הבנה מלאה של המקרה.',
  },
  {
    n: '03',
    title: 'שיחת ייעוץ',
    desc: 'שיחת וידאו (או טלפון אם לא מתאפשר) בה נעבור ביחד על הממצאים, נענה על שאלות ונגדיר ביחד תוכנית ואת הכיוון הנכון לכם.',
  },
  {
    n: '04',
    title: 'ניסוח ודיוק התפריט',
    desc: 'ייעוץ כולל מתכון אחד - עבודה עם Animal Diet Formulator לניסוח מתכון מלא ומאוזן עם כמויות מדויקות.',
  },
  {
    n: '05',
    title: 'פגישת מעקב',
    desc: 'פגישת מעקב קצרה (15 דק\') חינם – כי התוצאה חשובה לנו כמו לכם.',
  },
]

const ADDONS = [
  { name: 'שיחת מעקב חוזרת', price: '200 ₪' },
  { name: 'מתכון נוסף', price: '220 ₪' },
  { name: 'מתכון נוסף - התאמה רפואית מורכבת', price: '280 ₪' },
]

/* ─── FAQ accordion item ─────────────────────────────────────── */
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-stone last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-5 text-right gap-4 group"
      >
        <span className="font-semibold text-earth text-sm leading-snug group-hover:text-forest transition-colors duration-150">
          {q}
        </span>
        <span className="flex-shrink-0 text-mist">
          {open
            ? <ChevronUp className="w-4 h-4" />
            : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>
      {open && (
        <div className="pb-5 text-mist text-sm leading-relaxed flex flex-col gap-3">
          {a.split('\n').map((line, i) => <p key={i}>{line}</p>)}
        </div>
      )}
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function Consultations() {
  const [certOpen, setCertOpen] = useState(false)

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') setCertOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Calendly popup: close on Escape or click-outside (overlay)
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') window.Calendly?.closePopupWidget()
    }
    const onOverlay = e => {
      const popup = document.querySelector('.calendly-popup')
      if (!popup || popup.contains(e.target)) return
      window.Calendly?.closePopupWidget()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onOverlay)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onOverlay)
    }
  }, [])

  // Replace Calendly's X with a custom "לסגירה" button at bottom-center of popup
  useEffect(() => {
    let customBtn = null

    function syncCalendly() {
      const closeBtn = document.querySelector('.calendly-popup-close')
      const popup    = document.querySelector('.calendly-popup')
      if (closeBtn) closeBtn.style.display = 'none'
      if (popup && !customBtn) {
        customBtn = document.createElement('button')
        customBtn.textContent = 'לסגירה ✕'
        customBtn.setAttribute('aria-label', 'סגור')
        Object.assign(customBtn.style, {
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: '9999',
          background: '#FAF7F0',
          color: '#3b5e41',
          border: '1.5px solid #3b5e41',
          borderRadius: '999px',
          padding: '8px 22px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
          direction: 'rtl',
        })
        customBtn.addEventListener('click', () => window.Calendly?.closePopupWidget())
        document.body.appendChild(customBtn)
      }
      if (!popup && customBtn) {
        customBtn.remove()
        customBtn = null
      }
    }

    syncCalendly() // handle already-open popup
    const obs = new MutationObserver(syncCalendly)
    obs.observe(document.body, { childList: true, subtree: true })
    return () => { obs.disconnect(); customBtn?.remove() }
  }, [])

  const [refProblem,  visProblem,  doneProblem]  = useReveal(0.08)
  const [refHelp,     visHelp,     doneHelp]     = useReveal(0.08)
  const [refBio,      visBio,      doneBio]      = useReveal(0.08)
  const [refDiff,     visDiff,     doneDiff]     = useReveal(0.08)
  const [refWhoFor,   visWhoFor,   doneWhoFor]   = useReveal(0.08)
  const [refProcess,  visProcess,  doneProcess]  = useReveal(0.08)
  const [refPricing,  visPricing,  donePricing]  = useReveal(0.08)
  const [refFaq,      visFaq,      doneFaq]      = useReveal(0.08)
  const [refCta,      visCta,      doneCta]      = useReveal(0.08)

  const rx = (visible, done) =>
    done ? '' : `transition-[opacity,transform] duration-500 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`

  return (
    <>
    <div className="min-h-screen bg-cream" dir="rtl">

      {/* ══════════════════════════════════════════════════════
          §1 HERO
      ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-parchment border-b border-stone">
        {/* Background paw */}
        <img
          src="/gaia-paw.png" alt="" aria-hidden="true"
          className="absolute top-4 left-2 w-20 h-20 md:-top-8 md:-left-8 md:w-72 md:h-72 opacity-[0.18] pointer-events-none select-none"
          style={{ transform: 'rotate(-12deg)' }}
        />

        <div className="container-gaia py-16 md:py-24 max-w-3xl relative">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 mb-6 text-xs font-semibold tracking-[0.1em] text-forest bg-forest/[0.08] px-3 py-1.5 rounded-full border border-forest/20">
            <img src="/gaia-paw.png" alt="" className="w-3.5 h-3.5 opacity-80" />
            ייעוץ אישי
          </span>

          <h1 className="text-display-lg font-serif text-earth mb-5 leading-[1.1]">
            תזונה טבעית לכלב שלכם -{' '}
            <em className="text-forest not-italic">מותאמת, מלאה ומאוזנת.</em>
          </h1>

          <p className="text-bark text-lg leading-[1.75] max-w-xl mb-9" style={{ fontFamily: '"Secular One", system-ui, sans-serif' }}>
            אם אתם רוצים לעבור מגרגרים יבשים לתזונה ביתית, לשפר תפריט קיים, או לבנות מתכון מלא ומאוזן לכלב שלכם - אתם במקום הנכון.
          </p>

          <div className="flex flex-col items-start gap-4 mt-1">
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-forest text-cream font-bold rounded-xl hover:bg-forest/90 transition-colors duration-200 text-sm"
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                window.Calendly?.initPopupWidget({ url: 'https://calendly.com/gaiapetnutrition/meet-with-me?background_color=faf7f0&text_color=1e1e1b&primary_color=3b5e41' })
              }}
            >
              לקביעת פגישה
            </a>
            <a
              id="intro-call-button"
              href="#contact"
              className="inline-flex items-center gap-2 text-forest font-semibold text-sm hover:text-forest-dark transition-colors duration-200"
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                window.Calendly?.initPopupWidget({ url: 'https://calendly.com/gaiapetnutrition/30min?background_color=faf7f0&text_color=1e1e1b&primary_color=3b5e41' })
              }}
            >
              רוצים לדבר קודם? שיחת היכרות חינם
              <ArrowLeft className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §2 TRUST BAR
      ══════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-stone/60 py-4">
        <div className="container-gaia">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2.5">
            {[
              'תזונאי כלבים מוסמך - Southern Illinois University',
              'הרכבת מתכונים עם תוכנה ייעודית',
              'מבוסס תקני AAFCO / NRC',
              'ליווי פרקטי ויסודי בכל צעד',
            ].map((text) => (
              <span key={text} className="flex items-center gap-2 text-[13px] text-mist font-medium">
                <img src="/gaia-paw.png" alt="" style={{ width: 13, height: 13, opacity: 0.45 }} />
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §3 THE PROBLEM
      ══════════════════════════════════════════════════════ */}
      <section className="py-section-sm bg-forest">
        <div ref={refProblem} className={`container-gaia max-w-5xl text-center ${rx(visProblem, doneProblem)}`}>
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.12em] uppercase mb-5 text-white/50">
            האתגר
          </span>
          <h2 className="text-display-md font-serif text-white mb-5 leading-[1.2]">
            מחקר של UC Davis ניתח מעל 200 דיאטות ביתיות לכלבים -{' '}
            <em className="not-italic text-olive-light">95% מהן לא היו מלאות ומאוזנות.</em>
          </h2>
          <p className="text-white/65 leading-relaxed text-base mb-8 max-w-xl mx-auto">
            זה לא בעיה של כוונות - זו בעיה של ידע. תזונה ביתית בלי ניסוח מחושב יוצרת חוסרים שמצטברים לאורך זמן, בלי שרואים את זה מיד.
          </p>

          <h2 className="text-display-md font-serif text-white mb-5 leading-[1.2]">
            המצב בישראל -{' '}
            <em className="not-italic text-olive-light">אין חובה לעמוד בתקנים של מלא ומאוזן.</em>
          </h2>
          <p className="text-white/65 leading-relaxed text-base mb-10 max-w-xl mx-auto">
            כשזה נוגע למוצרי מזון טבעי, אין בישראל צורך בעמידה בתקנים של מלא ומאוזן לפי תקנים בינלאומיים כמו AAFCO או NRC, מה שמחסיר מהציבור ידע - ובעיקר מחסיר נוטריאנטים מהכלבים שלנו.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-right">
            {[
              {
                title: 'תפריטים אינטואיטיביים',
                desc: 'ארוחות שנבנות לפי "הגיון" ולא לפי נתונים - יוצרות חוסרים בנוטריאנטים לאורך זמן.',
              },
              {
                title: 'מידע סותר',
                desc: 'קבוצות פייסבוק, אינסטגרם, יוטיוב - כולם אומרים משהו אחר. קשה לדעת מה נכון.',
              },
              {
                title: '"מגוון" ≠ מלא ומאוזן',
                desc: 'גיוון הוא חשוב ומצוין, אך אם כל אחד מהמתכונים לא מלא ומאוזן, גיוון לא יעזור וחוסרים יכולים להיווצר שבסופו של דבר עלולים לפגוע בבריאות הכלבים.',
              },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-white/[0.08] rounded-2xl p-5">
                <h3 className="font-semibold text-white text-sm mb-2">{title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §4 WHAT I HELP WITH
      ══════════════════════════════════════════════════════ */}
      <section className="pt-8 pb-section bg-cream relative overflow-hidden">
        <img src="/gaia-paw.png" alt="" aria-hidden="true"
          className="absolute -top-3 -right-4 w-20 h-20 md:-top-6 md:-right-8 md:w-64 md:h-64 opacity-[0.07] pointer-events-none select-none"
          style={{ transform: 'rotate(15deg)' }}
        />
        <div ref={refHelp} className={`container-gaia max-w-3xl ${rx(visHelp, doneHelp)}`}>
          <div className="text-center mb-10">
            <h2 className="text-display-md font-serif text-forest mb-5 mt-2 flex items-center justify-center gap-3">
              עם מה אנחנו עוזרים
            </h2>
            <p className="text-mist text-base max-w-md mx-auto leading-relaxed">
              ייעוץ מעשי שמסתיים בתוצר ברור - לא רק בשיחה.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                Icon: ArrowLeft,
                title: 'מעבר מגרגרים יבשים לתזונה טבעית',
                desc: 'מעבר הדרגתי, מחושב, עם תוכנית ברורה - לא המלצות כלליות.',
              },
              {
                Icon: FlaskConical,
                title: 'בדיקת תפריט קיים',
                desc: 'אם אתם כבר מאכילים ביתי - בדיקה שהתפריט מספק את כל מה שהכלב צריך.',
              },
              {
                Icon: FileText,
                title: 'ניסוח מתכונים עם בסיס מלא ומאוזן',
                desc: 'שימוש בניסיון, ידע מבוסס מחקר ותוכנה מקצועית לניסוח מתכון מדויק ומותאם.',
              },
              {
                Icon: Heart,
                title: 'התאמה לצרכים מיוחדים',
                desc: 'כלבים עם אלרגיות, בעיות עיכול, מחלת כליות - תזונה מותאמת בהתאם להנחיות הוטרינר.',
              },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="card p-5 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-forest/[0.08] text-forest flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-earth mb-1.5 text-sm">{title}</h3>
                  <p className="text-mist text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §5 WHAT MAKES THIS DIFFERENT
      ══════════════════════════════════════════════════════ */}
      <section className="pt-10 pb-section bg-parchment relative overflow-hidden">
        <img src="/gaia-paw.png" alt="" aria-hidden="true"
          className="absolute -top-3 -left-4 w-20 h-20 md:-top-6 md:-left-8 md:w-64 md:h-64 opacity-[0.07] pointer-events-none select-none"
          style={{ transform: 'rotate(-15deg)' }}
        />
        <div ref={refDiff} className={`container-gaia max-w-3xl ${rx(visDiff, doneDiff)}`}>
          <div className="text-center mb-10">
            <h2 className="text-display-md font-serif text-forest mb-4">
              לא רק עצות - תוצאות.
            </h2>
            <p className="text-mist text-base max-w-md mx-auto leading-relaxed">
              הייעוץ שלנו מסתיים במתכונים מחושבים ובתוכנית פרקטית שאפשר לעבוד איתה.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'מחושב, לא אינטואיטיבי',
                desc: 'כל מתכון מנוסח עם כמויות מדויקות, מבוסס על נתוני הכלב הספציפי - לא "לפי הגיון".',
              },
              {
                title: 'מבוסס תקנים מוכרים',
                desc: 'אנחנו עובדים לפי תקנים בינלאומיים - AAFCO ו-NRC - לא לפי טרנדים, קבוצות פייסבוק, או אינסטגרם.',
              },
              {
                title: 'תוצר ברור',
                desc: 'מתכון כתוב, רשימת תוספים, כמויות. לא יציאה משיחה עם "תנסו ותראו".',
              },
            ].map(({ title, desc }) => (
              <div key={title} className="card p-5 text-center">
                <h3 className="font-semibold text-earth text-sm mb-2">{title}</h3>
                <p className="text-mist text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §6.5 ADF VIDEO SHOWCASE
      ══════════════════════════════════════════════════════ */}
      <ADFShowcase />

      {/* ══════════════════════════════════════════════════════
          §7 WHO THIS IS FOR
      ══════════════════════════════════════════════════════ */}
      <section className="pt-10 pb-section bg-parchment relative overflow-hidden">
        <img src="/gaia-paw.png" alt="" aria-hidden="true"
          className="absolute -top-3 -left-4 w-20 h-20 md:-top-6 md:-left-8 md:w-64 md:h-64 opacity-[0.07] pointer-events-none select-none"
          style={{ transform: 'rotate(-15deg)' }}
        />
        <div ref={refWhoFor} className={`container-gaia max-w-3xl ${rx(visWhoFor, doneWhoFor)}`}>
          <div className="text-center mb-10">
            <h2 className="text-display-md font-serif text-forest mb-4">
              למי זה מתאים?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {WHO_FOR.map(({ title, desc }) => (
              <div key={title} className="card px-4 py-3.5 bg-white">
                <h3 className="font-semibold text-earth text-sm mb-1">{title}</h3>
                <p className="text-mist text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §8 PROCESS
      ══════════════════════════════════════════════════════ */}
      <section className="pt-8 pb-section bg-cream relative overflow-hidden">
        <img src="/gaia-paw.png" alt="" aria-hidden="true"
          className="absolute -top-3 -right-4 w-20 h-20 md:-top-6 md:-right-8 md:w-64 md:h-64 opacity-[0.07] pointer-events-none select-none"
          style={{ transform: 'rotate(15deg)' }}
        />
        <div ref={refProcess} className={`container-gaia max-w-2xl ${rx(visProcess, doneProcess)}`}>
          <div className="text-center mb-12">
            <h2 className="text-display-md font-serif text-earth mb-4">איך זה עובד?</h2>
          </div>
          <div className="space-y-0">
            {STEPS.map(({ n, title, desc }, i) => (
              <div key={n} className="flex gap-5 items-start relative">
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="absolute top-10 right-[1.2rem] w-px h-[calc(100%-2rem)] bg-stone" />
                )}
                {/* Step number circle */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-forest/[0.08] border border-forest/20 flex items-center justify-center z-10">
                  <span className="text-[11px] font-bold text-forest">{n}</span>
                </div>
                <div className={`flex-1 pt-1.5 ${i < STEPS.length - 1 ? 'pb-8' : 'pb-0'}`}>
                  <h3 className="font-semibold text-earth mb-1">{title}</h3>
                  <p className="text-mist text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §8.5 WHO AM I
      ══════════════════════════════════════════════════════ */}
      <section className="section-padding bg-parchment relative overflow-hidden">
        <img src="/gaia-paw.png" alt="" aria-hidden="true"
          className="absolute -top-3 -left-4 w-20 h-20 md:-top-6 md:-left-8 md:w-64 md:h-64 opacity-[0.07] pointer-events-none select-none"
          style={{ transform: 'rotate(-15deg)' }}
        />
        <div ref={refBio} className={`container-gaia max-w-4xl ${rx(visBio, doneBio)}`}>
          {/* Two-column: bio text + photo/cert */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-10 items-start mb-8">
            {/* Left column - bio */}
            <div>
              <span className="eyebrow block mb-3">על התזונאי שלנו</span>
              <h2 className="text-display-sm font-serif text-earth mb-5 leading-snug">
                תומר חזאם - תזונאי כלבים מוסמך
              </h2>
              <p className="text-mist text-sm leading-[1.85] mb-5">
                מבשל לכלבים שלי כבר למעלה מעשור, ומתוך המטבח הביתי התגלגלתי אל הצד המדעי של הקערה. עם ההבנה ש‑1 מתוך 4 כלבים צפוי להתמודד עם סרטן במהלך חייו (ו-1 מתוך 2 מעל גיל 10!), היה לי ברור שתזונה היא לא רק ״מה טעים לכלב״, אלא כלי משמעותי בהפחתת סיכונים ותמיכה בגוף לאורך שנים.
              </p>
              <p className="text-mist text-sm leading-[1.85] mb-5">
                לאורך חצי שנה של לימודים ברמה אוניברסיטאית בארה״ב בתחום תזונת כלבים וחתולים, יחד עם שנים של ניסוי, טעייה ויישום בפועל, פיתחתי גישה שמחברת בין מחקר עדכני לבין אוכל אמיתי - מלא, מאוזן, עשיר ומגוון, עם דגש על רכיבים נוגדי חמצון ותמיכה מערכתית.
              </p>
              <p className="text-mist text-sm leading-[1.85] mb-5">
                ככל שהעמקתי בלימודים, בהשכלה העצמאית שלי ובהתנסות עם כלבים, הבנתי שישראל נמצאת מאחור ביחס למדינות מערביות כמו ארה״ב, אירופה ואוסטרליה, שבהן הדרישה למזון מלא ומאוזן היא דרישה בסיסית וברורה – בעוד שכאן אין כמעט פיקוח או חובה לעמוד בסטנדרטים כאלה. עם הזמן למדתי לפשט ולהפוך את התזונה הטבעית לכלבים – שלי ושל לקוחותיי – למשהו נגיש וברור, תוך שימוש בכלים מקצועיים והבנה רחבה של מרכיבים, נוטריאנטים, יחסים ורגישויות. המטרה שלי היא לבנות תזונה קלה ופרקטית ליישום, בלי ניחושים ובלי משחקים מסוכנים בבריאות של הכלב.
              </p>
              <p className="text-mist text-sm leading-[1.7]">
                היום אני מלווה בעלי כלבים במעבר ממזון יבש לתזונה טבעית וביתית, בבישול מתכונים מלאים ומאוזנים, מזון נא, תיסוף נכון לתזונה קיימת, ובהתאמת תפריטים למצבים רפואיים שונים - בצורה מקצועית, שקופה ונעימה, שתיתן גם לכם וגם לכלב שלכם שקט נפשי.
              </p>
            </div>

            {/* Right column - profile image + certificate + credential cards */}
            <div className="space-y-3">
              <img
                src="/profile_image.jpeg"
                alt="תומר חזאם"
                className="w-full rounded-2xl shadow-card"
              />
              <button
                onClick={() => setCertOpen(true)}
                className="block w-full rounded-2xl shadow-card overflow-hidden hover:shadow-card-hover transition-shadow duration-200 group relative cursor-pointer"
              >
                <img src="/SIU_cert.png" alt="תעודת הסמכה - Canine & Feline Nutrition, SIU" className="w-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-2xl flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 text-earth text-[12px] font-semibold px-3 py-1.5 rounded-lg shadow">
                    להגדלה
                  </span>
                </div>
              </button>

            </div>
          </div>

          {/* Credential cards - full width */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'גישה', value: 'הגשר בין מזרח למערב - הוליסטיות, גיוון, תמיכה מערכתית ודגש על נוגדי חמצון יחד עם בסיס מחקרי עדכני' },
              { label: 'סטנדרט', value: 'AAFCO / NRC - התקנים המובילים בעולם לדרישות מינימליות למזון מלא ומאוזן כנקודת התחלה' },
              { label: 'כלי עבודה', value: 'Animal Diet Formulator - תוכנה ייעודית למפרמלי מזון, תזונאים ווטרינרים תזונאים' },
              { label: 'הסמכה', value: 'Canine & Feline Nutrition - Southern Illinois University' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white rounded-2xl px-4 py-3 shadow-card flex flex-col gap-1">
                <span className="text-[10px] font-bold text-forest uppercase tracking-wider">
                  {label}
                </span>
                <span className="text-bark text-[13px] leading-snug">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §9 PACKAGES & PRICING - HIDDEN (restore by removing the {false && ...} wrapper)
      ══════════════════════════════════════════════════════ */}
      {false && <section id="packages" className="section-padding bg-parchment">
        <div ref={refPricing} className={`container-gaia ${rx(visPricing, donePricing)}`}>
          <div className="text-center mb-12">
            <span className="eyebrow block mb-3">חבילות ומחירים</span>
            <h2 className="text-display-md font-serif text-earth mb-4">בחרו את החבילה המתאימה</h2>
            <p className="text-mist text-base max-w-lg mx-auto leading-relaxed">
              כל חבילה מותאמת לשלב אחר בתהליך.<br />לא בטוחים? ראו את ה-FAQ למטה או שלחו הודעה.
            </p>
          </div>

          {/* Main packages grid - 4 packages in 2×2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto mb-6">
            {PLANS.map(plan => (
              <div
                key={plan.id}
                className={`relative card flex flex-col p-6 bg-white ${
                  plan.flagship
                    ? 'border-2 border-forest ring-1 ring-forest/20'
                    : ''
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 right-5 z-10">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-forest text-white px-3 py-1 rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="mb-5">
                  <p className="text-[11px] font-bold text-forest uppercase tracking-wider mb-1">
                    {plan.subtitle}
                  </p>
                  <h3 className="text-lg font-bold text-earth mb-1">{plan.name}</h3>
                  <p className="flex items-center gap-1.5 text-xs text-mist">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    {plan.duration}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-5 pb-5 border-b border-stone">
                  <span className="text-3xl font-bold text-earth">{plan.price} ₪</span>
                </div>

                {/* Description */}
                <p className="text-mist text-sm leading-relaxed mb-5">{plan.desc}</p>

                {/* Features */}
                <ul className="space-y-2 mb-5 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-bark">
                      <CheckCircle className="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Note */}
                {plan.note && (
                  <div className="mb-4 flex items-start gap-2 text-xs text-mist bg-stone/50 rounded-xl px-3 py-2.5">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    {plan.note}
                  </div>
                )}

                {/* CTA */}
                <a
                  href="#contact"
                  className={`text-center py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors duration-200 ${
                    plan.flagship
                      ? 'bg-forest text-white hover:bg-forest-dark'
                      : 'border border-earth/20 text-earth hover:bg-earth/[0.05]'
                  }`}
                >
                  קביעת פגישה
                </a>
              </div>
            ))}
          </div>


          {/* Add-ons */}
          <div className="max-w-2xl mx-auto">
            <h3 className="text-center text-xs font-bold text-earth uppercase tracking-wider mb-4 opacity-60">
              תוספות אפשריות
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {ADDONS.map(({ name, price }) => (
                <div key={name} className="bg-white rounded-2xl px-4 py-3 text-center shadow-card">
                  <p className="text-xs text-mist mb-1">{name}</p>
                  <p className="font-semibold text-earth text-sm">{price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>}

      {/* ══════════════════════════════════════════════════════
          §10 FAQ
      ══════════════════════════════════════════════════════ */}
      <section className="section-padding bg-cream relative overflow-hidden">
        <img src="/gaia-paw.png" alt="" aria-hidden="true"
          className="absolute -top-3 -right-4 w-20 h-20 md:-top-6 md:-right-8 md:w-64 md:h-64 opacity-[0.07] pointer-events-none select-none"
          style={{ transform: 'rotate(15deg)' }}
        />
        <div ref={refFaq} className={`container-gaia max-w-2xl ${rx(visFaq, doneFaq)}`}>
          <div className="text-center mb-10">
            <h2 className="text-display-md font-serif text-earth">שאלות נפוצות</h2>
          </div>
          <div className="card bg-white px-6 py-2">
            {FAQS.map(faq => (
              <FAQItem key={faq.q} {...faq} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §11 FINAL CTA
      ══════════════════════════════════════════════════════ */}
      <section id="contact" className="py-section-sm bg-forest relative overflow-hidden">
        {/* Decorative paw - left */}
        <img
          src="/gaia-paw.png" alt="" aria-hidden="true"
          className="absolute bottom-0 md:-bottom-6 left-4 w-16 md:w-44 opacity-[0.07] pointer-events-none select-none"
          style={{ transform: 'rotate(-8deg)', filter: 'brightness(0) invert(1)' }}
        />
        {/* Decorative paw - right (mirror) */}
        <img
          src="/gaia-paw.png" alt="" aria-hidden="true"
          className="absolute bottom-1 md:-bottom-4 right-8 w-16 md:w-44 opacity-[0.07] pointer-events-none select-none"
          style={{ transform: 'rotate(45deg)', filter: 'brightness(0) invert(1)' }}
        />

        <div ref={refCta} className={`container-gaia max-w-xl text-center relative mt-1${rx(visCta, doneCta)}`}>
          <h2 className="text-display-md font-serif text-white mb-4 leading-[1.2]">
            מוכנים לבנות תפריט שאפשר לסמוך עליו?
          </h2>
          <p className="text-white/60 text-base leading-relaxed mb-8 max-w-sm mx-auto">
            שלחו הודעה ונחזור אליכם תוך יום עסקים. אפשר גם לשאול שאלה לפני קביעת פגישה.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-forest font-bold rounded-xl hover:bg-cream transition-colors duration-200 text-sm"
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                window.Calendly?.initPopupWidget({ url: 'https://calendly.com/gaiapetnutrition/meet-with-me?background_color=faf7f0&text_color=1e1e1b&primary_color=3b5e41' })
              }}
            >
              לפגישת ייעוץ
            </a>
            <a
              href="#"
              onClick={e => { e.preventDefault(); e.stopPropagation(); window.Calendly?.initPopupWidget({ url: 'https://calendly.com/gaiapetnutrition/30min?background_color=faf7f0&text_color=1e1e1b&primary_color=3b5e41' }) }}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/[0.08] transition-colors duration-200 text-sm cursor-pointer"
            >
              לשיחת היכרות
            </a>
          </div>

          <p className="text-white/30 text-xs mt-4">
            * אינו מחליף ייעוץ וטרינרי. לשאלות רפואיות, פנו לוטרינר המטפל.
          </p>
        </div>
      </section>

    </div>

      {certOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          onClick={() => setCertOpen(false)}
        >
          <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setCertOpen(false)}
              className="absolute -top-10 left-0 text-white/80 hover:text-white text-sm font-medium"
            >
              ✕ סגירה
            </button>
            <img src="/SIU_cert.png" alt="תעודת הסמכה" className="w-full rounded-2xl shadow-2xl" />
          </div>
        </div>
      )}
    </>
  )
}

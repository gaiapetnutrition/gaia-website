import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle, ChevronDown, ChevronUp, Clock, ArrowLeft,
  FlaskConical, FileText, Heart, Users, AlertCircle,
} from 'lucide-react'

/* ─── Data ───────────────────────────────────────────────────── */

const FAQS = [
  {
    q: 'האם אתה וטרינר?',
    a: 'לא. אני יועץ תזונה לכלבים מוסמך — לא וטרינר ולא מאבחן מחלות. הייעוץ שלי מתמקד בתזונה בלבד: בניית תפריטים, ניסוח מתכונות מלאות ומאוזנות, והכוונה להאכלה נכונה. לכל שאלה רפואית, פנו לוטרינר המטפל שלכם.',
  },
  {
    q: 'האם הייעוץ מתאים אם הכלב שלי אוכל כיבל?',
    a: 'בהחלט. חלק גדול מהמתייעצים שלי מגיעים עם כלבים שאוכלים כיבל ורוצים להבין אם יש אלטרנטיבה, או לשלב בין השניים. נעשה יחד את המעבר בצורה הדרגתית ומחושבת.',
  },
  {
    q: 'האם אני צריך בדיקות דם לפני הייעוץ?',
    a: 'לא חובה, אבל אם יש בדיקות עדכניות — מאוד מומלץ להביא. הן עוזרות לי לתת המלצות מדויקות יותר. לכלבים עם בעיות רפואיות, בדיקות דם עשויות להיות חיוניות.',
  },
  {
    q: 'האם אקבל מתכונות ספציפיות עם כמויות?',
    a: 'בחבילות 2, 3 ו-4 — כן. אני עובד עם תוכנת Animal Diet Formulator ומנסח מתכונות מלאות ומאוזנות בהתאם לנתוני הכלב שלכם, כולל כמויות מדויקות ורשימת תוספים. לא "המלצה כללית", אלא מתכון מחושב.',
  },
  {
    q: 'מה אם לכלב שלי יש מצב רפואי?',
    a: 'אני יכול לעבוד עם תזונה תומכת לכלבים עם אלרגיות, בעיות עיכול, מחלת כליות ועוד — תמיד בתיאום עם הוטרינר המטפל. חבילה 4 מיועדת בדיוק למקרים כאלה. אני לא מאבחן ולא מחליף טיפול רפואי בשום פנים.',
  },
  {
    q: 'האם הייעוץ מתאים לגורים?',
    a: 'כן — ובמיוחד לגורים. דרישות התזונה שלהם שונות מאוד מכלבים בוגרים, ובניית בסיס תזונתי נכון בשלב הגדילה היא קריטית. אני מתייחס לכך ברצינות מלאה.',
  },
  {
    q: 'כמה זמן לוקח לקבל את המתכון?',
    a: 'בדרך כלל עד 5–7 ימי עסקים לאחר שיחת הייעוץ. המתכון מגיע עם הסברים מלאים, כמויות, ורשימת תוספים מומלצים.',
  },
]

const PLANS = [
  {
    id: 'initial',
    name: 'ייעוץ ראשוני',
    subtitle: 'כיוון ברור לפני שמתחילים',
    duration: 'שיחה של 30 דקות',
    price: '250',
    badge: null,
    flagship: false,
    desc: 'לאלה שרוצים להבין את התמונה הגדולה לפני שמחליטים. שיחה ממוקדת, סקירה של התפריט הנוכחי, ותשובות לשאלות הכי דוחקות.',
    features: [
      'סקירת התזונה הנוכחית',
      'תשובות לשאלות ממוקדות',
      'כיוון כללי והמלצות ראשוניות',
      'סיכום כתוב קצר',
    ],
    note: 'לא כולל ניסוח מתכון',
  },
  {
    id: 'transition',
    name: 'מעבר לתזונה טבעית',
    subtitle: 'מכיבל לתפריט ביתי',
    duration: '60 דקות + תוכנית',
    price: '570',
    badge: null,
    flagship: false,
    desc: 'חבילת המעבר השלמה: תוכנית מעבר הדרגתית, מתכון בסיסי מאוזן אחד, ותמיכה לאחר השיחה.',
    features: [
      'שאלון קליטה מפורט',
      'שיחת ייעוץ 60 דקות',
      'תוכנית מעבר הדרגתית מהכיבל',
      'מתכון בסיסי מאוזן אחד',
      'תמיכה בווטסאפ לאחר השיחה',
    ],
    note: null,
  },
  {
    id: 'formulation',
    name: 'ניסוח מתכון מלא ומאוזן',
    subtitle: 'הגישה המקיפה',
    duration: '60 דקות + ניסוח',
    price: '890',
    badge: 'הכי מקיף',
    flagship: true,
    desc: 'עבודה מלאה עם Animal Diet Formulator. שתי מתכונות מחושבות לפי נתוני הכלב שלכם — מלאות, מאוזנות, עם כמויות מדויקות ותוספים.',
    features: [
      'שאלון קליטה מפורט',
      'שיחת ייעוץ 60 דקות',
      'ניסוח עם Animal Diet Formulator',
      '2 מתכונות מלאות ומאוזנות',
      'המלצות תוספים מותאמות',
      'תוכנית כתובה מלאה',
      'תמיכה שוטפת 30 יום',
    ],
    note: null,
  },
  {
    id: 'complex',
    name: 'תמיכה תזונתית מורכבת',
    subtitle: 'לצרכים מיוחדים',
    duration: '60 דקות + ניסוח מעמיק',
    price: '1,100',
    badge: null,
    flagship: false,
    desc: 'לכלבים עם אלרגיות, בעיות עיכול, מחלת כליות, או כל מצב שדורש התאמה תזונתית מדוקדקת בתיאום עם הוטרינר.',
    features: [
      'שאלון קליטה מורחב',
      'שיחת ייעוץ 60 דקות',
      '2 מתכונות מותאמות למצב הרפואי',
      'תיאום עם הגישה הווטרינרית',
      'תמיכה שוטפת 30 יום',
    ],
    note: 'אינו מחליף אבחון או טיפול וטרינרי',
  },
]

const WHO_FOR = [
  {
    icon: '🍳',
    title: 'מכינים אוכל ביתי',
    desc: 'ולא בטוחים אם התפריט שלהם עומד בסטנדרטים הנכונים.',
  },
  {
    icon: '🔄',
    title: 'רוצים לעבור מכיבל',
    desc: 'ורוצים לעשות את זה נכון — בצורה הדרגתית, מחושבת ובטוחה.',
  },
  {
    icon: '❓',
    title: 'מבולבלים ממידע סותר',
    desc: 'ורוצים מקור אחד, מהימן, מבוסס מחקר — לא מיתוסים ולא טרנדים.',
  },
  {
    icon: '🩺',
    title: 'כלב עם צרכים מיוחדים',
    desc: 'אלרגיות, עיכול, כליות — ורוצים תמיכה תזונתית מקצועית לצד הוטרינר.',
  },
  {
    icon: '🐕',
    title: 'גורים חדשים',
    desc: 'שהבעלים שלהם מבינים שהבסיס התזונתי נבנה עכשיו — ורוצים לבנות אותו נכון.',
  },
  {
    icon: '🔬',
    title: 'מחפשים גישה מדעית',
    desc: 'ניסוח מחושב לפי AAFCO/NRC — לא "ארוחה טבעית" כללית.',
  },
]

const STEPS = [
  {
    n: '01',
    title: 'שאלון קליטה',
    desc: 'לאחר ההרשמה תקבלו שאלון מפורט על הכלב: גיל, משקל, מצב בריאותי, אוכל נוכחי, והיסטוריה רלוונטית.',
  },
  {
    n: '02',
    title: 'סקירה וניתוח',
    desc: 'אני בוחן את הנתונים, מנתח את התפריט הנוכחי, ומכין את עצמי לשיחה עם הבנה מלאה של המקרה.',
  },
  {
    n: '03',
    title: 'שיחת ייעוץ',
    desc: 'שיחת וידאו או טלפון מובנית. עוברים יחד על הממצאים, עונים על שאלות, ומגדירים יחד את הכיוון הנכון.',
  },
  {
    n: '04',
    title: 'ניסוח התפריט',
    desc: 'בחבילות הכוללות מתכון — עבודה עם Animal Diet Formulator לניסוח מתכון מלא ומאוזן עם כמויות מדויקות.',
  },
  {
    n: '05',
    title: 'תמיכה ומעקב',
    desc: 'בחבילות עם תמיכה — 30 יום של מענה לשאלות, התאמות קטנות, וווידוא שהמעבר הולך כמתוכנן.',
  },
]

const ADDONS = [
  { name: 'מתכון נוסף — כלב בריא', price: '290 ₪' },
  { name: 'מתכון נוסף — מקרה מורכב', price: '350–390 ₪' },
  { name: 'שיחת מעקב חוזרת', price: '280–320 ₪' },
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
        <p className="pb-5 text-mist text-sm leading-relaxed">
          {a}
        </p>
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
          className="absolute -top-8 -left-8 w-72 h-72 opacity-[0.07] pointer-events-none select-none"
          style={{ transform: 'rotate(-12deg)' }}
        />

        <div className="container-gaia py-16 md:py-24 max-w-3xl relative">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 mb-6 text-xs font-semibold tracking-[0.1em] text-forest bg-forest/[0.08] px-3 py-1.5 rounded-full border border-forest/20">
            <img src="/gaia-paw.png" alt="" className="w-3.5 h-3.5 opacity-80" />
            ייעוץ אישי
          </span>

          <h1 className="text-display-lg font-serif text-earth mb-5 leading-[1.1]">
            תזונה טבעית לכלב שלכם —{' '}
            <em className="text-forest not-italic">נכונה, מחושבת ומאוזנת.</em>
          </h1>

          <p className="text-bark text-lg leading-[1.75] max-w-xl mb-9">
            אם אתם רוצים לעבור מכיבל לתזונה ביתית, לשפר תפריט קיים, או לבנות מתכון מלא ומאוזן לכלב שלכם — אתם במקום הנכון.
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <a
              href="#packages"
              className="inline-flex items-center gap-2 px-6 py-3 bg-forest text-white font-semibold text-sm rounded-xl hover:bg-forest-dark transition-colors duration-200"
            >
              לחבילות ומחירים
              <ArrowLeft className="w-4 h-4" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-2 py-3 text-forest font-semibold text-sm hover:text-forest-dark transition-colors duration-200"
            >
              שאלה לפני קביעה?
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
              { icon: '🎓', text: 'הסמכה — Southern Illinois University' },
              { icon: '🧪', text: 'ניסוח עם Animal Diet Formulator' },
              { icon: '📋', text: 'מבוסס תקני AAFCO / NRC' },
              { icon: '✋', text: 'יועץ תזונה — לא וטרינר, ולא מתיימר להיות' },
            ].map(({ icon, text }) => (
              <span key={text} className="flex items-center gap-2 text-[13px] text-mist font-medium">
                <span className="text-base leading-none">{icon}</span>
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
        <div className="container-gaia max-w-5xl text-center">
          <span className="inline-block text-xs font-semibold tracking-[0.12em] uppercase mb-5 text-white/40">
            הבעיה האמיתית
          </span>
          <h2 className="text-display-md font-serif text-white mb-5 leading-[1.2]">
            מחקר של UC Davis ניתח מעל 200 דיאטות ביתיות לכלבים —{' '}
            <em className="not-italic text-olive-light">95% מהן לא היו מלאות ומאוזנות.</em>
          </h2>
          <p className="text-white/65 leading-relaxed text-base mb-8 max-w-xl mx-auto">
            זה לא בעיה של כוונות — זו בעיה של ידע. תזונה ביתית בלי ניסוח מחושב יוצרת חוסרים שמצטברים לאורך זמן, בלי שרואים את זה מיד.
          </p>

          <h2 className="text-display-md font-serif text-white mb-5 leading-[1.2]">
            המצב בישראל —{' '}
            <em className="not-italic text-olive-light">אין חובה לעמוד בתקנים של מלא ומאוזן.</em>
          </h2>
          <p className="text-white/65 leading-relaxed text-base mb-10 max-w-xl mx-auto">
            כשזה נוגע לספקי תזונה טבעית, אין בישראל צורך בעמידה בתקנים של מלא ומאוזן לפי תקנים בינלאומיים כמו AAFCO או NRC, מה שמחסיר מהציבור ידע — ובעיקר מחסיר נוטריאנטים מהכלבים שלנו.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-right">
            {[
              {
                title: 'תפריטים אינטואיטיביים',
                desc: 'ארוחות שנבנות לפי "הגיון" ולא לפי נתונים — יוצרות חוסרים בנוטריאנטים לאורך זמן.',
              },
              {
                title: 'מידע סותר',
                desc: 'קבוצות פייסבוק, אינסטגרם, יוטיוב — כולם אומרים משהו אחר. קשה לדעת מה נכון.',
              },
              {
                title: '"מגוון" ≠ מלא ומאוזן',
                desc: 'אם כל אחד מהמתכונים לא מלא ומאוזן, גיוון לא יעזור וחוסרים יכולים להיווצר שבסופו של דבר עלולים לפגוע בבריאות הכלבים.',
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
      <section className="section-padding bg-cream">
        <div className="container-gaia max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-display-md font-serif text-forest mb-5 mt-2">עם מה אנחנו עוזרים</h2>
            <p className="text-mist text-base max-w-md mx-auto leading-relaxed">
              ייעוץ מעשי שמסתיים בתוצר ברור — לא רק בשיחה.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                Icon: ArrowLeft,
                title: 'מעבר מכיבל לתזונה טבעית',
                desc: 'מעבר הדרגתי, מחושב, עם תוכנית ברורה — לא ניסוי וטעייה.',
              },
              {
                Icon: FileText,
                title: 'ניסוח מתכון מלא ומאוזן',
                desc: 'שימוש ב-Animal Diet Formulator לניסוח מתכון עם כמויות ותוספים מדויקים.',
              },
              {
                Icon: FlaskConical,
                title: 'בדיקת תפריט קיים',
                desc: 'אם אתם כבר מאכילים ביתי — בדיקה שהתפריט מספק את כל מה שהכלב צריך.',
              },
              {
                Icon: Heart,
                title: 'התאמה לצרכים מיוחדים',
                desc: 'כלבים עם אלרגיות, בעיות עיכול, מחלת כליות — תזונה מותאמת בתיאום עם הוטרינר.',
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
          §5 WHO AM I
      ══════════════════════════════════════════════════════ */}
      <section className="section-padding bg-parchment">
        <div className="container-gaia max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.7fr] gap-10 items-start">
            {/* Left column */}
            <div>
              <span className="eyebrow block mb-3">על התזונאי שלנו</span>
              <h2 className="text-display-sm font-serif text-earth mb-5 leading-snug">
                תומר חזאם — תזונאי כלבים מוסמך
              </h2>
              <p className="text-mist text-sm leading-[1.9] mb-4">
                מבשל לכלבים שלי כבר למעלה מעשור, ומתוך המטבח הביתי התגלגלתי אל הצד המדעי של הקערה. עם ההבנה ש‑1 מתוך 4 כלבים צפוי להתמודד עם סרטן במהלך חייו, היה לי ברור שתזונה היא לא רק ״מה טעים לכלב״, אלא כלי משמעותי בהפחתת סיכונים ותמיכה בגוף לאורך שנים.
              </p>
              <p className="text-mist text-sm leading-[1.9] mb-4">
                לאורך חצי שנה של לימודים ברמה אוניברסיטאית בארה״ב בתחום תזונת כלבים וחתולים, יחד עם שנים של ניסוי, טעייה ויישום בפועל, פיתחתי גישה שמחברת בין מחקר עדכני לבין אוכל אמיתי — מלא, מאוזן, עשיר ומגוון, עם דגש על רכיבים נוגדי חמצון ותמיכה מערכתית.
              </p>
              <p className="text-mist text-sm leading-[1.9]">
                היום אני מלווה בעלי כלבים במעבר מתזונת קיבל לתזונה טבעית וביתית, בבישול מתכונים מלאים ומאוזנים, בתיסוף נכון לתזונה קיימת, ובהתאמת תפריטים למצבים רפואיים שונים — בצורה מקצועית, שקופה ונעימה, שתיתן גם לכם וגם לכלב שלכם שקט נפשי ליד הקערה.
              </p>
            </div>

            {/* Right column — profile image + credential pills */}
            <div className="space-y-2.5">
              <img
                src="/profile_image.jpeg"
                alt="תומר חזאם"
                className="w-full rounded-2xl mb-4 shadow-card"
              />

              {/* Certificate thumbnail */}
              <button
                onClick={() => setCertOpen(true)}
                className="block w-full rounded-2xl shadow-card overflow-hidden hover:shadow-card-hover transition-shadow duration-200 mb-2.5 group relative cursor-pointer"
              >
                <img src="/SIU_cert.png" alt="תעודת הסמכה — Canine & Feline Nutrition, SIU" className="w-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-2xl flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 text-earth text-[12px] font-semibold px-3 py-1.5 rounded-lg shadow">
                    להגדלה
                  </span>
                </div>
              </button>


              {[
                { label: 'הסמכה', value: 'Canine & Feline Nutrition — Southern Illinois University' },
                { label: 'כלי עבודה', value: 'Animal Diet Formulator — ניסוח מתכונות מחושב' },
                { label: 'סטנדרט', value: 'AAFCO / NRC — התקנים המובילים בעולם לתזונת כלבים' },
                { label: 'גישה', value: 'מבוסס מחקר, לא טרנדים. ישיר, לא שיווקי.' },
                { label: 'חשוב לדעת', value: 'לא וטרינר, לא מאבחן — ואני תמיד אומר זאת בגלוי.' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white rounded-2xl px-4 py-3 flex gap-3 items-start shadow-card">
                  <span className="text-[11px] font-bold text-forest uppercase tracking-wider flex-shrink-0 mt-0.5 w-[5.5rem]">
                    {label}
                  </span>
                  <span className="text-bark text-sm leading-snug">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §6 WHAT MAKES THIS DIFFERENT
      ══════════════════════════════════════════════════════ */}
      <section className="section-padding bg-cream">
        <div className="container-gaia max-w-3xl">
          <div className="text-center mb-10">
            <span className="eyebrow block mb-3">מה מייחד</span>
            <h2 className="text-display-md font-serif text-earth mb-4">לא עצות — תוצאות.</h2>
            <p className="text-mist text-base max-w-md mx-auto leading-relaxed">
              הייעוץ שלי מסתיים במתכון מחושב ובתוכנית שאפשר לעבוד איתה.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'מחושב, לא אינטואיטיבי',
                desc: 'כל מתכון מנוסח עם כמויות מדויקות, מבוסס על נתוני הכלב הספציפי — לא "לפי הגיון".',
              },
              {
                title: 'מבוסס תקנים מוכרים',
                desc: 'אני עובד לפי AAFCO ו-NRC — לא לפי טרנדים, קבוצות פייסבוק, או אינסטגרם.',
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
          §7 WHO THIS IS FOR
      ══════════════════════════════════════════════════════ */}
      <section className="section-padding bg-parchment">
        <div className="container-gaia max-w-3xl">
          <div className="text-center mb-10">
            <span className="eyebrow block mb-3">למי זה מתאים</span>
            <h2 className="text-display-md font-serif text-earth mb-4">מי מגיע אלי?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {WHO_FOR.map(({ icon, title, desc }) => (
              <div key={title} className="card p-5 bg-white">
                <span className="text-2xl block mb-3 leading-none">{icon}</span>
                <h3 className="font-semibold text-earth text-sm mb-1.5">{title}</h3>
                <p className="text-mist text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §8 PROCESS
      ══════════════════════════════════════════════════════ */}
      <section className="section-padding bg-cream">
        <div className="container-gaia max-w-2xl">
          <div className="text-center mb-12">
            <span className="eyebrow block mb-3">התהליך</span>
            <h2 className="text-display-md font-serif text-earth mb-4">איך זה עובד</h2>
            <p className="text-mist text-base">פשוט, מסודר, ובלי הפתעות.</p>
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
          §9 PACKAGES & PRICING
      ══════════════════════════════════════════════════════ */}
      <section id="packages" className="section-padding bg-parchment">
        <div className="container-gaia">
          <div className="text-center mb-12">
            <span className="eyebrow block mb-3">חבילות ומחירים</span>
            <h2 className="text-display-md font-serif text-earth mb-4">בחרו את החבילה המתאימה</h2>
            <p className="text-mist text-base max-w-lg mx-auto leading-relaxed">
              כל חבילה מותאמת לשלב אחר בתהליך. לא בטוחים? ראו את ה-FAQ למטה או שלחו הודעה.
            </p>
          </div>

          {/* Main packages grid — 4 packages in 2×2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto mb-6">
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
                  <span className="text-3xl font-bold text-earth">₪{plan.price}</span>
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

          {/* Ongoing support — horizontal card */}
          <div className="card bg-white p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5 max-w-3xl mx-auto mb-8">
            <div className="flex-1">
              <p className="text-[11px] font-bold text-forest uppercase tracking-wider mb-1">
                למי שכבר בדרך הנכונה
              </p>
              <h3 className="font-bold text-earth text-base mb-1">תמיכה חודשית שוטפת</h3>
              <p className="text-mist text-sm leading-relaxed">
                לקוחות קיימים שרוצים ליווי מתמשך — עדכוני תפריט, שאלות שוטפות, והתאמות לפי שינויים בכלב.
              </p>
            </div>
            <div className="flex-shrink-0 text-right sm:text-left">
              <div className="mb-1">
                <span className="text-2xl font-bold text-earth">₪390</span>
                <span className="text-mist text-xs"> / חודש</span>
              </div>
              <p className="text-[11px] text-mist mb-3">למי שכבר עבר ייעוץ ראשוני</p>
              <a
                href="#contact"
                className="inline-block text-center py-2 px-5 rounded-xl text-sm font-semibold border border-earth/20 text-earth hover:bg-earth/[0.05] transition-colors"
              >
                צור קשר
              </a>
            </div>
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
                  <p className="font-semibold text-earth text-sm">+{price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          §10 FAQ
      ══════════════════════════════════════════════════════ */}
      <section className="section-padding bg-cream">
        <div className="container-gaia max-w-2xl">
          <div className="text-center mb-10">
            <span className="eyebrow block mb-3">שאלות נפוצות</span>
            <h2 className="text-display-md font-serif text-earth">שאלות לפני שמתחילים</h2>
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
        {/* Decorative paw */}
        <img
          src="/gaia-paw.png" alt="" aria-hidden="true"
          className="absolute -bottom-6 left-4 w-44 opacity-[0.07] pointer-events-none select-none"
          style={{ transform: 'rotate(-8deg)', filter: 'brightness(0) invert(1)' }}
        />

        <div className="container-gaia max-w-xl text-center relative">
          <h2 className="text-display-md font-serif text-white mb-4 leading-[1.2]">
            מוכנים לבנות תפריט שאפשר לסמוך עליו?
          </h2>
          <p className="text-white/60 text-base leading-relaxed mb-8 max-w-sm mx-auto">
            שלחו הודעה ונחזור אליכם תוך יום עסקים. אפשר גם לשאול שאלה לפני קביעת פגישה.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/972XXXXXXXXX"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-forest font-bold rounded-xl hover:bg-cream transition-colors duration-200 text-sm"
            >
              הודעה בווטסאפ
            </a>
            <a
              href="mailto:gaia@gaia-nutrition.co.il"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/[0.08] transition-colors duration-200 text-sm"
            >
              שלחו מייל
            </a>
          </div>

          <p className="text-white/30 text-xs mt-8">
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
              ✕ סגור
            </button>
            <img src="/SIU_cert.png" alt="תעודת הסמכה" className="w-full rounded-2xl shadow-2xl" />
          </div>
        </div>
      )}
    </>
  )
}

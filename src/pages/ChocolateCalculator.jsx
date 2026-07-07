import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import clsx from 'clsx'

/* ─── Data ──────────────────────────────────────────────────────────────── */

const DOG_SIZES = [
  { id: 'toy',    label: 'טוי',    desc: 'פחות מ-5 ק"ג', weight: 2.5,  emoji: '🐩' },
  { id: 'small',  label: 'קטן',    desc: '5–12 ק"ג',      weight: 8.5,  emoji: '🐕' },
  { id: 'medium', label: 'בינוני', desc: '12–25 ק"ג',     weight: 18.5, emoji: '🦮' },
  { id: 'large',  label: 'גדול',   desc: '25–40 ק"ג',     weight: 32.5, emoji: '🐕‍🦺' },
  { id: 'giant',  label: 'ענק',    desc: 'מעל 40 ק"ג',   weight: 50,   emoji: '🐺' },
]

const CHOC_TYPES = [
  { id: 'white',   label: 'לבן',      mgPerG: 0.1,  swatch: '#FFF5D6', border: '#D9C87A' },
  { id: 'milk',    label: 'חלב',      mgPerG: 1.75, swatch: '#A06830', border: '#7A4E1E' },
  { id: 'mild',    label: 'מריר קל',  mgPerG: 10.5, swatch: '#7A4E2C', border: '#5C3418' },
  { id: 'dark',    label: 'מריר חזק', mgPerG: 20,   swatch: '#5C3317', border: '#3D1F08' },
]

const AMOUNTS = [
  { id: 'tiny',   label: '1–39 גרם',    desc: 'שוקולד עטוף קטן',      grams: 20    },
  { id: 'small',  label: '40–119 גרם',  desc: 'חפיסת שוקולד קטנה',    grams: 79.5  },
  { id: 'medium', label: '120–199 גרם', desc: 'שקית שיתוף שוקולד',    grams: 159.5 },
  { id: 'large',  label: '200–399 גרם', desc: 'חפיסת שוקולד גדולה',   grams: 299.5 },
  { id: 'huge',   label: '400–500 גרם', desc: 'עוגת שוקולד שלמה',     grams: 450   },
]

const SYMPTOMS_COL_A = [
  'הקאות',
  'שלשולים',
  'חוסר מנוחה / היפראקטיביות',
  'דופק מוגבר (טכיקרדיה)',
  'צמא ושתן מוגברים',
]
const SYMPTOMS_COL_B = [
  'נשימה מהירה / קוצר נשימה',
  'רעידות שרירים',
  'פרכוסים',
  'חום גוף גבוה (היפרתרמיה)',
  'קריסה או חולשה קיצונית',
]

function getRisk(dosePerKg) {
  if (dosePerKg < 20)  return {
    level: 'minimal',
    label: 'סיכון מינימלי לבעיות בריאות',
    bg: 'bg-forest', text: 'text-white',
    summary: 'הכלב שלכם צרך כמות קטנה מאוד של שוקולד ונמצא בסיכון זניח. עם זאת, מומלץ לעקוב אחר התנהגותו בשעות הקרובות.',
  }
  if (dosePerKg < 40)  return {
    level: 'low',
    label: 'סיכון נמוך לבעיות בריאות',
    bg: 'bg-amber-500', text: 'text-white',
    summary: 'הכלב שלכם צרך כמות קטנה של שוקולד ונמצא בסיכון נמוך לבעיות בריאות. אם אתם חוששים, פנו לוטרינר.',
  }
  if (dosePerKg < 60)  return {
    level: 'moderate',
    label: 'פנו לייעוץ וטרינרי',
    bg: 'bg-orange-500', text: 'text-white',
    summary: 'הכלב שלכם צרך כמות בינונית של שוקולד ועלול לפתח בעיות בריאות. מומלץ לפנות לייעוץ וטרינרי בהקדם.',
  }
  if (dosePerKg < 100) return {
    level: 'severe',
    label: 'פנו לוטרינר מיד',
    bg: 'bg-red-500', text: 'text-white',
    summary: 'הכלב שלכם צרך כמות גדולה של שוקולד ונמצא בסיכון לבעיות בריאות חמורות. פנו לוטרינר מיד.',
  }
  return {
    level: 'critical',
    label: 'מצב חירום — טיפול וטרינרי דחוף',
    bg: 'bg-red-900', text: 'text-white',
    summary: 'הכלב שלכם צרך כמות קריטית של שוקולד וחייו עשויים להיות בסכנה. פנו מיידית לטיפול וטרינרי דחוף!',
  }
}

const TOTAL_STEPS = 4

/* ─── SelectCard ────────────────────────────────────────────────────────── */
function SelectCard({ selected, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border-2 transition-all duration-150 w-full text-center focus:outline-none',
        selected
          ? 'border-forest bg-forest/5 shadow-sm'
          : 'border-stone bg-white hover:border-forest/40',
      )}
    >
      {children}
    </button>
  )
}

/* ─── Step footer (progress + nav) ─────────────────────────────────────── */
function StepFooter({ step, canNext, onBack, onNext, onReset }) {
  const pct = (step / TOTAL_STEPS) * 100

  return (
    <div className="border-t border-stone pt-4 mt-6">
      {/* Progress bar */}
      <div className="relative h-1.5 bg-stone rounded-full mb-3 overflow-hidden">
        <div
          className="absolute inset-y-0 right-0 bg-forest rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      {/* Nav row */}
      <div className="flex items-center justify-between">
        {/* Back — rightmost in RTL */}
        <button
          onClick={onBack}
          disabled={step === 1}
          className="text-sm text-mist hover:text-bark flex items-center gap-1 transition-colors disabled:opacity-0 disabled:pointer-events-none"
        >
          <ChevronRight className="w-4 h-4" />
          חזרה
        </button>

        <span className="text-xs text-mist">שלב {step} מתוך {TOTAL_STEPS}</span>

        {/* Next / Reset — leftmost in RTL */}
        {step < TOTAL_STEPS ? (
          <button
            onClick={onNext}
            disabled={!canNext}
            className={clsx(
              'text-sm font-semibold flex items-center gap-1 transition-colors',
              canNext ? 'text-forest hover:text-forest-dark' : 'text-mist cursor-not-allowed',
            )}
          >
            המשך
            <ChevronLeft className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onReset}
            className="text-sm font-semibold text-forest hover:text-forest-dark transition-colors"
          >
            התחל מחדש
          </button>
        )}
      </div>
    </div>
  )
}

/* ─── Main component ────────────────────────────────────────────────────── */
export default function ChocolateCalculator() {
  const [step,    setStep]    = useState(1)
  const [size,    setSize]    = useState(null)
  const [choc,    setChoc]    = useState(null)
  const [amount,  setAmount]  = useState(null)
  const [showHow, setShowHow] = useState(false)
  const cardRef = useRef(null)

  const reset = () => {
    setStep(1); setSize(null); setChoc(null); setAmount(null); setShowHow(false)
  }

  const canNext =
    step === 1 ? !!size :
    step === 2 ? !!choc :
    step === 3 ? !!amount : true

  function next() {
    if (canNext && step < TOTAL_STEPS) {
      setStep(s => s + 1)
      setTimeout(() => {
        const el = cardRef.current
        if (el) {
          const headerH = document.querySelector('header')?.offsetHeight ?? 0
          const y = el.getBoundingClientRect().top + window.scrollY - headerH - 8
          window.scrollTo({ top: y, behavior: 'smooth' })
        }
      }, 50)
    }
  }

  // Calculate result when on step 4
  const result = (step === 4 && size && choc && amount) ? (() => {
    const totalMg  = choc.mgPerG * amount.grams
    const dosePerKg = totalMg / size.weight
    return { totalMg, dosePerKg, ...getRisk(dosePerKg) }
  })() : null

  return (
    <div className="min-h-screen bg-cream">

      {/* Page header */}
      <div className="bg-green-gradient text-white overflow-hidden relative">
        {/* Paw watermark — bottom-left, lowest hierarchy, pure depth */}
        <img
          src="/gaia-paw.png"
          alt=""
          aria-hidden="true"
          className="absolute bottom-0 left-0 w-44 h-44 object-contain pointer-events-none select-none"
          style={{ opacity: 0.08, filter: 'brightness(0) invert(1)', transform: 'translate(-20%, 20%)' }}
        />
        <div className="container-gaia py-14 md:py-20">
          <div className="flex items-center justify-between gap-8">
            {/* Text — right side (RTL) */}
            <div className="flex-1 min-w-0">
              <h1 className="text-display-lg font-serif text-white mb-3">מחשבון רעילות שוקולד לכלב</h1>
              <p className="text-white/60 max-w-lg text-base leading-relaxed">
                שוקולד מכיל תיאוברומין, חומר הרעיל לכלבים. המחשבון מעריך את רמת הסיכון לפי משקל הכלב, סוג השוקולד והכמות שנצרכה.
              </p>
            </div>
            {/* Image — left side, faded into background */}
            <div className="hidden md:block flex-shrink-0 relative" style={{ width: '491px', height: '351px', marginLeft: '24px' }}>
              <img
                src={`/chocolate_new2.png?v=${Date.now()}`}
                alt=""
                className="absolute inset-0 w-full h-full object-contain object-center"
                style={{ maskImage: 'none', WebkitMaskImage: 'none' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container-gaia py-10">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Calculator card */}
          <div ref={cardRef} className="bg-white border border-stone rounded-4xl shadow-card overflow-hidden">
            <div className="p-6 sm:p-8">

              {/* ── Step 1: Dog size ── */}
              {step === 1 && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <h2 className="text-xl font-serif font-semibold text-earth mb-1">מה גודל הכלב שלכם?</h2>
                    <p className="text-sm text-mist">בחרו את קטגוריית הגודל המתאימה ביותר</p>
                  </div>
                  {/* Mobile: 3-col row + 2-col centered row. Desktop: single 5-col row */}
                  <div className="sm:hidden space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      {DOG_SIZES.slice(0, 3).map(s => (
                        <SelectCard key={s.id} selected={size?.id === s.id} onClick={() => setSize(s)}>
                          <span className="text-3xl">{s.emoji}</span>
                          <span className="text-xs font-bold text-earth leading-tight">{s.label}</span>
                          <span className="text-[10px] text-mist leading-tight">{s.desc}</span>
                        </SelectCard>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 w-2/3 mx-auto">
                      {DOG_SIZES.slice(3).map(s => (
                        <SelectCard key={s.id} selected={size?.id === s.id} onClick={() => setSize(s)}>
                          <span className="text-3xl">{s.emoji}</span>
                          <span className="text-xs font-bold text-earth leading-tight">{s.label}</span>
                          <span className="text-[10px] text-mist leading-tight">{s.desc}</span>
                        </SelectCard>
                      ))}
                    </div>
                  </div>
                  <div className="hidden sm:grid grid-cols-5 gap-2">
                    {DOG_SIZES.map(s => (
                      <div key={s.id}>
                        <SelectCard selected={size?.id === s.id} onClick={() => setSize(s)}>
                          <span className="text-3xl">{s.emoji}</span>
                          <span className="text-xs font-bold text-earth leading-tight">{s.label}</span>
                          <span className="text-[10px] text-mist leading-tight">{s.desc}</span>
                        </SelectCard>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 2: Chocolate type ── */}
              {step === 2 && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <h2 className="text-xl font-serif font-semibold text-earth mb-1">איזה סוג שוקולד נאכל?</h2>
                    <p className="text-sm text-mist">ככל שהשוקולד כהה יותר, כך הוא מסוכן יותר לכלבים</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {CHOC_TYPES.map(c => (
                      <div key={c.id}>
                        <SelectCard selected={choc?.id === c.id} onClick={() => setChoc(c)}>
                          <div
                            className="w-10 h-10 rounded-xl border-2 flex-shrink-0"
                            style={{ backgroundColor: c.swatch, borderColor: c.border }}
                          />
                          <span className="text-xs font-bold text-earth leading-tight">{c.label}</span>
                          <span className="text-[10px] text-mist leading-tight">{c.mgPerG} מ"ג/ג</span>
                        </SelectCard>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 3: Amount ── */}
              {step === 3 && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <h2 className="text-xl font-serif font-semibold text-earth mb-1">כמה שוקולד נאכל?</h2>
                    <p className="text-sm text-mist">בחרו את הכמות שלדעתכם הכלב צרך</p>
                  </div>
                  <div className="space-y-2">
                    {AMOUNTS.map(a => (
                      <button
                        key={a.id}
                        onClick={() => setAmount(a)}
                        className={clsx(
                          'w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border-2 transition-all duration-150 text-right',
                          amount?.id === a.id
                            ? 'border-forest bg-forest/5'
                            : 'border-stone bg-white hover:border-forest/40',
                        )}
                      >
                        <span className="text-xs text-mist">{a.desc}</span>
                        <span className="font-bold text-earth flex items-center gap-1">
                          <span dir="ltr" className="tabular-nums">{a.label.split(' ')[0]}</span>
                          <span>גרם</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 4: Results ── */}
              {step === 4 && result && (
                <div className="space-y-5 animate-fade-in">

                  {/* Risk banner */}
                  <div className={clsx('rounded-2xl p-5', result.bg, result.text)}>
                    <div className="text-xs font-medium uppercase tracking-wider opacity-70 mb-1">תוצאה</div>
                    <div className="text-2xl font-bold leading-snug">{result.label}</div>
                    <p className="text-sm opacity-85 mt-2 leading-relaxed">{result.summary}</p>
                    <div className="mt-3 text-xs opacity-55 tabular-nums">
                      סה"כ תיאוברומין: {result.totalMg.toFixed(1)} מ"ג &nbsp;|&nbsp; מינון: {result.dosePerKg.toFixed(1)} מ"ג/ק"ג
                    </div>
                  </div>

                  {/* Symptoms card */}
                  <div className="bg-parchment rounded-2xl p-5">
                    <h3 className="font-semibold text-earth mb-3">תסמיני הרעלת שוקולד כוללים:</h3>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                      {[...SYMPTOMS_COL_A, ...SYMPTOMS_COL_B].map((sym, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-bark">
                          <span className="text-forest mt-0.5 flex-shrink-0">•</span>
                          <span>{sym}</span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 text-xs text-mist leading-relaxed border-t border-stone/60 pt-3">
                      ללא קשר לכמות שנצרכה — אם הכלב שלכם מציג תסמינים כלשהם מרגע החשיפה ועד 48 שעות לאחר מכן, פנו לוטרינר בהקדם האפשרי.
                    </p>
                  </div>

                  {/* "How does this work?" toggle */}
                  <div className="border border-stone rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setShowHow(h => !h)}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-bark hover:bg-parchment transition-colors"
                    >
                      איך זה עובד?
                      <ChevronDown className={clsx('w-4 h-4 transition-transform duration-200', showHow && 'rotate-180')} />
                    </button>
                    {showHow && (
                      <div className="px-4 pb-4 pt-3 border-t border-stone text-xs text-mist leading-relaxed space-y-3">
                        <p>
                          <strong className="text-bark">נוסחה:</strong> סה"כ תיאוברומין (מ"ג) = ריכוז (מ"ג/ג) × כמות (גרם)
                        </p>
                        <p>
                          <strong className="text-bark">מינון:</strong> מ"ג/ק"ג = סה"כ תיאוברומין ÷ משקל הכלב (ק"ג)
                        </p>
                        <div>
                          <strong className="text-bark block mb-1.5">ריכוזי תיאוברומין לפי סוג שוקולד:</strong>
                          <div className="space-y-1">
                            {CHOC_TYPES.map(c => (
                              <div key={c.id} className="flex justify-between">
                                <span>{c.label}</span>
                                <span className="tabular-nums">{c.mgPerG} מ"ג/ג</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <strong className="text-bark block mb-1.5">טבלת רמות סיכון:</strong>
                          <table className="w-full border-collapse text-xs">
                            <thead>
                              <tr className="bg-parchment">
                                <th className="text-right p-2 border border-stone font-semibold text-bark">מינון (מ"ג/ק"ג)</th>
                                <th className="text-right p-2 border border-stone font-semibold text-bark">רמת סיכון</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                ['פחות מ-20', 'מינימלי'],
                                ['20–39',     'נמוך עד בינוני'],
                                ['40–59',     'בינוני עד גבוה'],
                                ['60–99',     'גבוה'],
                                ['100+',      'קריטי'],
                              ].map(([dose, risk]) => (
                                <tr key={dose}>
                                  <td className="p-2 border border-stone">{dose}</td>
                                  <td className="p-2 border border-stone">{risk}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )}

              <StepFooter
                step={step}
                canNext={canNext}
                onBack={() => setStep(s => Math.max(1, s - 1))}
                onNext={next}
                onReset={reset}
              />
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-mist text-center leading-relaxed max-w-lg mx-auto pb-4">
            מחשבון זה מיועד למטרות מידע בלבד ואינו מחליף ייעוץ וטרינרי מקצועי. אם אתם חוששים לגבי בריאות הכלב שלכם, פנו לוטרינר בהקדם האפשרי.
          </p>

        </div>
      </div>
    </div>
  )
}

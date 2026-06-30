import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Calculator as CalcIcon, ChevronLeft, ChevronRight,
  RotateCcw, Calendar, PawPrint, Utensils, Zap,
  ArrowLeft, Info, CheckCircle2
} from 'lucide-react'
import clsx from 'clsx'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Slider from '../components/ui/Slider'
import { calculate, FOOD_TYPES } from '../utils/calculatorLogic'
import {
  RadialBarChart, RadialBar, PieChart, Pie, Cell,
  Tooltip, ResponsiveContainer
} from 'recharts'

/* ─── Option card button ─────────────────────────────────── */
function OptionCard({ selected, onClick, icon, label, sublabel }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 text-center',
        'transition-all duration-200 cursor-pointer w-full',
        selected
          ? 'border-forest bg-forest/[5%] text-forest'
          : 'border-stone bg-white text-bark hover:border-sage/60 hover:bg-sage/5',
      )}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-sm font-semibold">{label}</span>
      {sublabel && <span className="text-xs text-mist leading-tight">{sublabel}</span>}
      {selected && (
        <CheckCircle2 className="w-3.5 h-3.5 text-forest" />
      )}
    </button>
  )
}

/* ─── Step indicator ─────────────────────────────────────── */
function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={clsx(
            'step-dot',
            i < current
              ? 'bg-forest border-forest text-white'
              : i === current
                ? 'border-forest text-forest bg-white'
                : 'border-stone text-mist bg-white',
          )}>
            {i < current ? '✓' : i + 1}
          </div>
          {i < total - 1 && (
            <div className={clsx('h-0.5 w-8', i < current ? 'bg-forest' : 'bg-stone')} />
          )}
        </div>
      ))}
    </div>
  )
}

/* ─── Macro donut chart ──────────────────────────────────── */
function MacroChart({ macros }) {
  const data = [
    { name: 'חלבון', value: macros.protein.pct, color: '#3B5E41' },
    { name: 'שומן',  value: macros.fat.pct,     color: '#8C9E5A' },
    { name: 'פחמימות', value: macros.carbs.pct, color: '#C4724A' },
    { name: 'סיבים', value: macros.fiber.pct,   color: '#D4CFC0' },
  ]
  return (
    <div className="flex items-center gap-6">
      <ResponsiveContainer width={120} height={120}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={36}
            outerRadius={56}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map(d => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-col gap-1.5">
        {data.map(d => (
          <div key={d.name} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
            <span className="text-bark">{d.name}</span>
            <span className="font-bold text-earth mr-auto">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Results panel ──────────────────────────────────────── */
function Results({ result, inputs, onReset, onBack }) {
  if (!result) return null

  const { mer, rer, dailyGrams, perMeal, frequency, macros, foodType, idealWeightKg, bcsScore, bodyCondition } = result

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero stats */}
      <div className="bg-green-gradient rounded-3xl p-6 text-white">
        <div className="flex items-center gap-2 mb-1">
          <img src="/gaia-paw.png" alt="" className="w-4 h-4 opacity-70 flex-shrink-0" style={{ filter: 'brightness(0) invert(1)' }} />
          <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
            צרכים קלוריים יומיים{inputs.name ? ` ל${inputs.name}` : ''}
          </span>
        </div>
        <div className="text-5xl font-bold mt-1">{mer.toLocaleString()}</div>
        <div className="text-white/60 text-sm">קלוריות ליום (MER)</div>

        {bcsScore !== 5 && (
          <div className="mt-2 text-xs text-white/60">
            משקל אידיאלי מוערך: <span className="text-white font-semibold">{idealWeightKg} ק״ג</span>
            <span className="block mt-0.5 text-white/40">מחושב מהמשקל הנוכחי ו-BCS {bcsScore}/9</span>
          </div>
        )}
      </div>

      {/* Food amount */}
      <div className="bg-white border border-stone rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Utensils className="w-4 h-4 text-forest" />
          <h3 className="font-semibold text-earth">כמות אוכל יומית{inputs.name ? ` ל${inputs.name}` : ''}</h3>
          <span className="text-sm text-mist">— {foodType?.label} • {result.customKcalPer100g > 0 ? result.customKcalPer100g * 10 : foodType?.kcalPer100g * 10} קק״ל/ק״ג{result.customKcalPer100g > 0 ? ' (מותאם אישית)' : ''}</span>
        </div>
        <div className="flex items-end gap-2 mb-1">
          <span className="text-4xl font-bold text-forest">{dailyGrams.toLocaleString()}</span>
          <span className="text-mist text-sm mb-1.5">גרם / יום</span>
        </div>
        <div className="bg-parchment rounded-2xl p-4 flex items-center">
          <div className="flex-1 flex flex-col items-center">
            <div className="text-2xl font-bold text-earth">{frequency.times}</div>
            <div className="text-xs text-mist">ארוחות ביום</div>
          </div>
          <div className="w-px h-10 bg-stone" />
          <div className="flex-1 flex flex-col items-center">
            <div className="text-2xl font-bold text-forest">{perMeal}</div>
            <div className="text-xs text-mist">גרם לארוחה</div>
          </div>
        </div>
      </div>

      {/* Macro breakdown — hidden, restore by uncommenting */}
      {/* <div className="bg-white border border-stone rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Zap className="w-4 h-4 text-forest" />
          <h3 className="font-semibold text-earth">פירוט מאקרו-נוטריאנטים</h3>
          <span className="text-xs text-mist mr-auto">מבוסס NRC 2006</span>
        </div>
        <MacroChart macros={macros} />
        <div className="mt-4 space-y-2">
          {[
            { label: 'חלבון',    ...macros.protein, color: 'bg-forest'  },
            { label: 'שומן',    ...macros.fat,     color: 'bg-olive'   },
            { label: 'פחמימות', ...macros.carbs,   color: 'bg-clay'    },
            { label: 'סיבים',   ...macros.fiber,   color: 'bg-stone'   },
          ].map(m => (
            <div key={m.label} className="flex items-center gap-3">
              <span className="text-sm text-bark w-20 flex-shrink-0">{m.label}</span>
              <div className="flex-1 h-2 bg-stone rounded-full overflow-hidden">
                <div
                  className={`h-full ${m.color} rounded-full transition-all duration-700`}
                  style={{ width: `${m.pct}%` }}
                />
              </div>
              <span className="text-sm font-medium text-earth w-16 text-left tabular-nums">
                {m.kcal} קק"ל
              </span>
            </div>
          ))}
        </div>
      </div> */}

      {/* Disclaimer + CTA */}
      <div className="bg-parchment rounded-2xl p-4 flex gap-3 text-xs text-mist">
        <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-sage" />
        <ul className="space-y-1.5 list-disc list-inside">
          <li>החישוב מהווה הערכה מבוססת נוסחאות וטרינריות מקובלות ואינו מחליף ייעוץ מקצועי.</li>
          <li>התוצאה היא נקודת פתיחה בלבד — כל כלב שונה, ויש לעקוב אחר משקל, BCS, רמת פעילות ומצב בריאותי ולהתאים בהתאם.</li>
          <li>לתוכנית מדויקת ומותאמת אישית מומלץ לקבוע ייעוץ עם וטרינר/ית או תזונאי/ת.</li>
        </ul>
      </div>

      {/* BCS warning — shown only for underweight or overweight */}
      {(bodyCondition === 'underweight' || bodyCondition === 'overweight') && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-xs text-amber-800">
          <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-500" />
          <p className="leading-relaxed">
            <span className="font-semibold block mb-1">התוצאה מבוססת על משקל יעד משוער לפי BCS, ונועדה לתמוך בחזרה הדרגתית לטווח גוף אידיאלי.</span>
            אם יש ירידה או עלייה חריגה במשקל, BCS קיצוני, או מצב רפואי קיים, מומלץ להתייעץ עם וטרינר/ית או תזונאי/ת לגבי תוכנית חזרה ייעודית למשקל תקין, ובעוצמה המתאימה לצרכיו, ולעקוב אחר המשקל וה־BCS לאורך הזמן.
          </p>
        </div>
      )}

      <Link to="/consultations" className="block mt-4">
        <Button variant="primary" size="lg" className="w-full">
          לייעוץ מקצועי מלא
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </Link>

      <div className="flex items-center justify-center gap-6">
        <button onClick={onBack} className="text-sm text-mist hover:text-bark flex items-center gap-1.5 transition-colors">
          <ChevronRight className="w-3.5 h-3.5" />
          חזרה לשלב הקודם
        </button>
        <span className="text-stone">|</span>
        <button onClick={onReset} className="text-sm text-mist hover:text-bark flex items-center gap-1.5 transition-colors">
          <RotateCcw className="w-3.5 h-3.5" />
          חישוב מחדש
        </button>
      </div>
    </div>
  )
}

/* ─── Activity level scale data ─────────────────────────── */
// 7 positions — all sheet levels exposed (Inactive → Working).
// Scale renders RTL: low (right) → work (left), matching Hebrew reading direction.
const ACTIVITY_STEPS = [
  { id: 'low',           anchor: 'לא פעיל',   desc: 'לא פעיל — כלב ביתי לגמרי, מסתפק בטיולים קצרצרים לצרכים ושגרה ביתית שקטה עם מעט מאמץ פיזי.'                        },
  { id: 'low_plus',      anchor: null,          desc: 'לא פעיל+ — כלב עם שגרה ביתית רגועה מאוד, רגיש לעומס, טיולים קצרצרים ושקטים וגירוי מנטלי עדין.'                },
  { id: 'moderate',      anchor: 'רגיל',       desc: 'רגיל — כלב בית טיפוסי, נהנה מטיול יומי ומשחקים פשוטים, רמת פעילות מתונה לבית עירוני.'                        },
  { id: 'moderate_plus', anchor: null,          desc: 'רגיל+ — כלב עם יותר אנרגיה וגירוי, טיולים ומשחקים יומיים מגוונים, מסתגל לשגרה משפחתית פעילה.'              },
  { id: 'active',        anchor: 'פעיל',       desc: 'פעיל — כלב הזקוק לטיולים ארוכים יותר, ריצות קצרות או משחק אנרגטי כמה פעמים בשבוע ואילוף בסיסי.'            },
  { id: 'active_plus',   anchor: null,          desc: 'פעיל+ — כלב אנרגטי מאוד, נהנה מפעילות פיזית משמעותית ורב‑שבועית וגירוי קוגניטיבי עקבי.'                    },
  { id: 'work',          anchor: 'כלב עבודה',  desc: 'כלב עבודה — כלב עם פעילות גבוהה ומובנית למשימות כמו ספורט, שמירה, ציד או רעייה, כולל אימון פיזי ומנטלי.'   },
]

/* ─── Main Calculator ─────────────────────────────────────── */
const TOTAL_STEPS = 3

// Puppy → adult threshold (years) by breed size
// Puppy threshold in years: dog is treated as puppy until this age
const PUPPY_THRESHOLD = { small: 10/12, medium: 1, large: 15/12, giant: 2 }

const INITIAL = {
  name:          '',
  breedSize:     'small',
  weightKg:      10,
  ageYears:      2,
  lifeStage:     'adult',
  activityLevel: 'moderate',
  isNeutered:    true,
  bcsScore:      5,
  foodType:        'homecooked',
  customKcalPerKg: '',
}

export default function Calculator() {
  const [step,       setStep]       = useState(0)
  const [inputs,     setInputs]     = useState(INITIAL)
  const [result,     setResult]     = useState(null)
  const [hoveredBcs,       setHoveredBcs]       = useState(null)
  const [showBcsInfo,      setShowBcsInfo]      = useState(false)
  const [showBcsLightbox,  setShowBcsLightbox]  = useState(false)
  const [showBreedInfo,    setShowBreedInfo]    = useState(false)
  const [showCalorieInfo,  setShowCalorieInfo]  = useState(false)
  const [showNeuteredInfo, setShowNeuteredInfo] = useState(false)
  const topRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (showBcsLightbox)  { setShowBcsLightbox(false);  return }
      if (showBcsInfo)      { setShowBcsInfo(false);      return }
      if (showBreedInfo)    { setShowBreedInfo(false);    return }
      if (showCalorieInfo)  { setShowCalorieInfo(false);  return }
      if (showNeuteredInfo) { setShowNeuteredInfo(false) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showBcsLightbox, showBcsInfo, showBreedInfo, showCalorieInfo])

  const set = (key, val) => setInputs(prev => ({ ...prev, [key]: val }))

  function handleCalculate() {
    const { customKcalPerKg, ...rest } = inputs
    const customKcalPer100g = Number(customKcalPerKg) > 0 ? Number(customKcalPerKg) / 10 : 0
    setResult(calculate({ ...rest, customKcalPer100g }))
    setStep(TOTAL_STEPS) // show results
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  function handleReset() {
    setInputs(INITIAL)
    setResult(null)
    setStep(0)
  }

  const canNext = [
    inputs.weightKg > 0,               // step 0
    true,                               // step 1
    inputs.foodType,                    // step 2
  ][step]

  return (
    <div className="min-h-screen bg-cream">
      {/* Page header */}
      <div className="bg-green-gradient text-white overflow-hidden">
        <div className="container-gaia py-14 md:py-20">
          <div ref={topRef} />
          <div className="flex items-end justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-display-lg font-serif text-white mb-3">
                מחשבון האכלה לכלב
              </h1>
              <p className="text-white/60 max-w-lg text-base leading-relaxed">
                החישוב מבוסס על נוסחאות אנרגיה וטרינריות מקובלות (RER ו‑MER), יחד עם התחשבות במגוון גורמים כמו: שלב חיים, מצב גוף, פעילות ומצב סירוס/עיקור. עם זאת, לכל כלב גוף וחילוף חומרים שונים ויש להתייחס לתוצאה כנקודת פתיחה בלבד - לעקוב אחר מצב הכלב לאורך זמן ולהתאים את הכמות בהתאם. לא מחליף אבחון וייעוץ עם וטרינר/ית או תזונאי/ת.
              </p>
            </div>
            <img
              src="/mascot_feeding_calculator2.png"
              alt=""
              aria-hidden="true"
              className="hidden md:block w-[27rem] lg:w-[30rem] flex-shrink-0 object-contain self-end"
            />
          </div>
        </div>
      </div>

      <div className="container-gaia py-10 md:py-16">
        <div className="max-w-2xl mx-auto">

          {/* Show results or form */}
          {result ? (
            <Results
              result={result}
              inputs={inputs}
              onReset={handleReset}
              onBack={() => { setResult(null); setStep(TOTAL_STEPS - 1) }}
            />
          ) : (
            <div className="bg-white rounded-4xl border border-stone shadow-card overflow-hidden">

              {/* Step progress bar */}
              <div className="px-8 pt-8 pb-6 border-b border-stone">
                <div className="flex items-center justify-between mb-4">
                  <StepIndicator current={step} total={TOTAL_STEPS} />
                  <span className="text-xs text-mist">שלב {step + 1} מתוך {TOTAL_STEPS}</span>
                </div>
                <div className="h-1.5 bg-stone rounded-full overflow-hidden">
                  <div
                    className="h-full bg-forest rounded-full transition-all duration-500"
                    style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
                  />
                </div>
              </div>

              {/* Form steps */}
              <div className="p-8">

                {/* ── Step 0: Dog basics ── */}
                {step === 0 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-xl font-semibold text-earth mb-1">פרטי הכלב</h2>
                      <p className="text-mist text-sm">נתחיל עם המידע הבסיסי</p>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="text-sm font-medium text-bark block mb-1.5">שם הכלב (אופציונלי)</label>
                      <input
                        type="text"
                        value={inputs.name}
                        onChange={e => set('name', e.target.value)}
                        placeholder="למשל: מקס"
                        className="input-base"
                      />
                    </div>

                    {/* Breed size */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <label className="text-sm font-medium text-bark">גודל גזע מוערך</label>
                        <button
                          type="button"
                          onClick={() => setShowBreedInfo(v => !v)}
                          title="מידע על גודל גזע"
                          className={clsx(
                            'w-[18px] h-[18px] rounded-full border text-[10px] font-bold flex items-center justify-center transition-colors duration-150 flex-shrink-0 leading-none',
                            showBreedInfo
                              ? 'bg-forest border-forest text-white'
                              : 'border-mist text-mist hover:border-forest hover:text-forest',
                          )}
                        >i</button>
                      </div>

                      {/* Collapsible info panel */}
                      <div className={clsx(
                        'overflow-hidden transition-all duration-300',
                        showBreedInfo ? 'max-h-48 opacity-100 mb-3' : 'max-h-0 opacity-0',
                      )}>
                        <div className="bg-parchment rounded-2xl p-4 text-xs text-bark leading-relaxed">
                          <span className="font-semibold block mb-1">הידעתם?</span>
                          גזעים קטנים יכולים להחשב גורים עד גיל ~10 חודשים, בינוניים עד ~12 חודשים, גדולים עד ~15 חודשים, וענקיים עד ~24 חודשים.
                          <span className="block mt-1.5 text-earth font-semibold">חשוב לזכור שמדובר בהערכות כלליות, והקצב עשוי להשתנות בין כלב לכלב.</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: 'small',  icon: '🐩',   label: 'קטן',    sublabel: 'משקל סופי של 5–12 ק"ג'  },
                          { id: 'medium', icon: '🦮',   label: 'בינוני', sublabel: 'משקל סופי של 12–25 ק"ג' },
                          { id: 'large',  icon: '🐕‍🦺',  label: 'גדול',   sublabel: 'משקל סופי של 25–40 ק"ג' },
                          { id: 'giant',  icon: '🐺',   label: 'ענק',    sublabel: 'משקל סופי של 40+ ק"ג'   },
                        ].map(bs => (
                          <OptionCard
                            key={bs.id}
                            selected={inputs.breedSize === bs.id}
                            onClick={() => {
                              set('breedSize', bs.id)
                              const threshold = PUPPY_THRESHOLD[bs.id]
                              const age = inputs.ageYears
                              if (age <= 0.25)          set('lifeStage', 'puppy_small')
                              else if (age < threshold) set('lifeStage', 'puppy')
                              else if (age >= 8)        set('lifeStage', 'senior')
                              else                      set('lifeStage', 'adult')
                            }}
                            icon={bs.icon}
                            label={bs.label}
                            sublabel={bs.sublabel}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Weight */}
                    <Slider
                      label="משקל נוכחי"
                      value={inputs.weightKg}
                      min={1}
                      max={80}
                      step={0.5}
                      unit=" ק״ג"
                      onChange={v => set('weightKg', v)}
                    />

                    {/* Age */}
                    <Slider
                      label="גיל"
                      value={inputs.ageYears}
                      min={0}
                      max={18}
                      step={0.5}
                      unit=" שנים"
                      onChange={v => {
                        set('ageYears', v)
                        const threshold = PUPPY_THRESHOLD[inputs.breedSize] ?? 1
                        if (v <= 0.25)          set('lifeStage', 'puppy_small')
                        else if (v < threshold) set('lifeStage', 'puppy')
                        else if (v >= 8)        set('lifeStage', 'senior')
                        else                    set('lifeStage', 'adult')
                      }}
                    />

                  </div>
                )}

                {/* ── Step 1: Lifestyle ── */}
                {step === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-xl font-semibold text-earth mb-1">אורח חיים</h2>
                      <p className="text-mist text-sm">אלה הנתונים שמשפיעים הכי הרבה על הצרכים הקלוריים</p>
                    </div>

                    {/* BCS 1–9 */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-1.5">
                          <label className="text-sm font-medium text-bark">מצב גוף (BCS)</label>
                          <button
                            type="button"
                            onClick={() => setShowBcsInfo(v => !v)}
                            title="מה זה BCS?"
                            className={clsx(
                              'w-[18px] h-[18px] rounded-full border text-[10px] font-bold flex items-center justify-center transition-colors duration-150 flex-shrink-0 leading-none',
                              showBcsInfo
                                ? 'bg-forest border-forest text-white'
                                : 'border-mist text-mist hover:border-forest hover:text-forest',
                            )}
                          >i</button>
                        </div>
                        {!showBcsInfo && (
                          <span className="text-sm font-bold text-forest tabular-nums">
                            9 / {hoveredBcs ?? inputs.bcsScore}&nbsp;—&nbsp;
                            {['רזה מאוד','רזה','מתחת לאידאל','אידאלי רזה','אידאלי','מעט מעל אידאלי','עודף משקל','עודף משמעותי','השמנה חמורה'][(hoveredBcs ?? inputs.bcsScore) - 1]}
                          </span>
                        )}
                      </div>

                      {/* BCS info image — shown when ⓘ is active */}
                      <div className={clsx(
                        'overflow-hidden transition-all duration-300',
                        showBcsInfo ? 'max-h-[600px] opacity-100 mb-3' : 'max-h-0 opacity-0',
                      )}>
                        <img
                          src="/bcs3.png"
                          alt="סולם מצב גוף BCS 1-9"
                          onClick={() => setShowBcsLightbox(true)}
                          className="w-full rounded-2xl border border-stone cursor-zoom-in hover:opacity-90 transition-opacity duration-150"
                        />
                        <p className="text-center text-xs text-mist mt-1.5">לחצו על התמונה להגדלה</p>
                      </div>

                      {/* BCS scale buttons — hidden when ⓘ is open */}
                      {!showBcsInfo && (
                        <>
                          <div className="flex gap-1.5 justify-between" onMouseLeave={() => setHoveredBcs(null)}>
                            {[1,2,3,4,5,6,7,8,9].map(n => (
                              <button
                                key={n}
                                type="button"
                                onClick={() => set('bcsScore', n)}
                                onMouseEnter={() => setHoveredBcs(n)}
                                className={clsx(
                                  'flex-1 h-10 rounded-xl text-sm font-semibold border-2 transition-all duration-150',
                                  inputs.bcsScore === n
                                    ? n <= 3 ? 'border-amber-400 bg-amber-50 text-amber-700'
                                      : n <= 5 ? 'border-forest bg-forest/[6%] text-forest'
                                      : 'border-red-300 bg-red-50 text-red-600'
                                    : 'border-stone bg-white text-mist hover:border-sage/60',
                                )}
                              >
                                {n}
                              </button>
                            ))}
                          </div>
                          <div className="flex justify-between text-xs text-mist mt-1.5 px-0.5">
                            <span>רזה מאוד</span>
                            <span>אידיאלי</span>
                            <span>שמן מאוד</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Activity level scale */}
                    <div>
                      <label className="text-sm font-medium text-bark block mb-4">רמת פעילות גופנית</label>

                      {/* Track — RTL: low on the right, work on the left */}
                      <div>
                        {(() => {
                          const idx = Math.max(0, ACTIVITY_STEPS.findIndex(s => s.id === inputs.activityLevel))
                          return (
                            <>
                              <div className="relative grid grid-cols-7">
                                {/* Track background: spans center-of-col-0 → center-of-col-6 */}
                                <div className="absolute top-[9px] h-0.5 bg-stone rounded-full pointer-events-none"
                                  style={{ left: 'calc(100% / 14)', right: 'calc(100% / 14)' }} />
                                {/* Track fill — anchored to the right, grows leftward as idx increases */}
                                <div className="absolute top-[9px] h-0.5 bg-forest rounded-full transition-all duration-200 pointer-events-none"
                                  style={{ right: 'calc(100% / 14)', width: `calc(${idx} * 100% / 7)` }} />

                                {ACTIVITY_STEPS.map((step, i) => {
                                  const isSelected = inputs.activityLevel === step.id
                                  const isPast     = i < idx
                                  return (
                                    <div key={step.id} className="flex flex-col items-center gap-2">
                                      {/* Dot — anchor dots are 18 px, between-anchor are 12 px */}
                                      <button
                                        type="button"
                                        onClick={() => set('activityLevel', step.id)}
                                        className={clsx(
                                          'rounded-full border-2 flex-shrink-0 relative z-10 transition-all duration-150',
                                          step.anchor ? 'w-[18px] h-[18px]' : 'w-3 h-3 mt-[3px]',
                                          isSelected
                                            ? 'bg-forest border-forest shadow-[0_0_0_4px_rgba(61,94,65,0.15)]'
                                            : isPast
                                              ? 'bg-white border-forest hover:border-forest'
                                              : 'bg-white border-stone hover:border-forest/50',
                                        )}
                                      />
                                      {/* Label — only visible on anchor positions */}
                                      <span className={clsx(
                                        'text-[11px] leading-none select-none',
                                        step.anchor ? '' : 'invisible',
                                        isSelected ? 'text-forest font-semibold' : 'text-mist',
                                      )}>
                                        {step.anchor ?? '·'}
                                      </span>
                                    </div>
                                  )
                                })}
                              </div>

                              {/* Dynamic description */}
                              <div className="mt-3 bg-parchment rounded-xl px-4 py-2.5 text-center">
                                <p className="text-sm text-bark">
                                  {ACTIVITY_STEPS.find(s => s.id === inputs.activityLevel)?.desc}
                                </p>
                              </div>
                            </>
                          )
                        })()}
                      </div>
                    </div>

                    {/* Neutered */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <label className="text-sm font-medium text-bark">סטטוס סירוס / עיקור</label>
                        <button
                          type="button"
                          onClick={() => setShowNeuteredInfo(v => !v)}
                          title="מידע על סירוס/עיקור"
                          className={clsx(
                            'w-[18px] h-[18px] rounded-full border text-[10px] font-bold flex items-center justify-center transition-colors duration-150 flex-shrink-0 leading-none',
                            showNeuteredInfo
                              ? 'bg-forest border-forest text-white'
                              : 'border-mist text-mist hover:border-forest hover:text-forest',
                          )}
                        >i</button>
                      </div>
                      <div className={clsx(
                        'overflow-hidden transition-all duration-300',
                        showNeuteredInfo ? 'max-h-48 opacity-100 mb-3' : 'max-h-0 opacity-0',
                      )}>
                        <div className="bg-parchment rounded-2xl p-4 text-xs text-bark leading-relaxed">
                          <span className="font-semibold block mb-1">הידעתם?</span>
                          לאחר עיקור או סירוס, חילוף החומרים של כלבים נוטה לרדת, ולכן הצורך האנרגטי היומי שלהם עשוי להיות נמוך בכ־15–25% לעומת כלבים לא מעוקרים/מסורסים. התחשבות בגורם זה מאפשרת לנו להציע כמות האכלה מדויקת יותר, שתסייע בשמירה על משקל גוף אידיאלי.
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { val: true,  label: 'מסורס / מעוקרת' },
                          { val: false, label: 'לא מסורס/מעוקרת' },
                        ].map(n => (
                          <button
                            key={String(n.val)}
                            type="button"
                            onClick={() => set('isNeutered', n.val)}
                            className={clsx(
                              'flex items-center justify-center p-4 rounded-2xl border-2 text-center',
                              'transition-all duration-200 cursor-pointer w-full',
                              inputs.isNeutered === n.val
                                ? 'border-forest bg-forest/[5%] text-forest'
                                : 'border-stone bg-white text-bark hover:border-sage/60 hover:bg-sage/5',
                            )}
                          >
                            <span className="text-base font-semibold">{n.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Step 2: Food type ── */}
                {step === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-xl font-semibold text-earth mb-1">סוג המזון</h2>
                      <p className="text-mist text-sm">בחרו את סוג המזון שאתם מתכננים להאכיל</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {FOOD_TYPES.map(ft => (
                        <OptionCard
                          key={ft.id}
                          selected={inputs.foodType === ft.id}
                          onClick={() => set('foodType', ft.id)}
                          icon={ft.icon}
                          label={ft.label}
                          sublabel={`${ft.kcalPer100g * 10} קק״ל/ק״ג`}
                        />
                      ))}
                    </div>

                    {/* Custom calorie input */}
                    <div>
                      <label className="text-sm font-medium text-bark block mb-0.5">
                        קלוריות המזון שלכם (אופציונלי - מומלץ!)
                      </label>
                      <div className="flex items-center gap-1.5 mb-2">
                        <p className="text-xs text-mist">אם ידועה לכם הצפיפות הקלורית המדויקת מתווית המוצר — הזינו אותה כאן</p>
                        <button
                          type="button"
                          onClick={() => setShowCalorieInfo(v => !v)}
                          className={clsx(
                            'w-[18px] h-[18px] rounded-full border text-[10px] font-bold flex items-center justify-center transition-colors duration-150 flex-shrink-0 leading-none',
                            showCalorieInfo
                              ? 'bg-forest border-forest text-white'
                              : 'border-mist text-mist hover:border-forest hover:text-forest',
                          )}
                        >i</button>
                      </div>

                      {/* Collapsible info panel */}
                      <div className={clsx(
                        'overflow-hidden transition-all duration-300',
                        showCalorieInfo ? 'max-h-48 opacity-100 mb-3' : 'max-h-0 opacity-0',
                      )}>
                        <div className="bg-parchment rounded-2xl p-4 text-xs text-bark leading-relaxed">
                          מומלץ להזין את הצפיפות הקלורית המדויקת של המזון כדי לקבל חישוב מדויק יותר. במוצרים קנויים לרוב ניתן למצוא את כמות הקלוריות על גבי האריזה. אם אין לכם את הנתון, המחשבון ישתמש בערך ברירת מחדל המבוסס על הערכה ממוצעת של מוצרים דומים בשוק ומתכונים נפוצים — כנקודת התחלה הגיונית.
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          max="9999"
                          placeholder={`ברירת מחדל: ${(FOOD_TYPES.find(f => f.id === inputs.foodType)?.kcalPer100g ?? 350) * 10}`}
                          value={inputs.customKcalPerKg}
                          onChange={e => set('customKcalPerKg', e.target.value)}
                          className="input-base w-40"
                        />
                        <span className="text-sm text-mist">קק״ל/ק״ג</span>
                      </div>
                    </div>

                  </div>
                )}

                {/* Navigation */}
                <div className={`flex mt-8 ${step > 0 ? 'justify-between' : 'justify-end'}`}>
                  {step > 0 && (
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => setStep(s => s - 1)}
                      icon={<ChevronRight className="w-4 h-4" />}
                    >
                      הקודם
                    </Button>
                  )}
                  {step < TOTAL_STEPS - 1 ? (
                    <Button
                      variant="primary"
                      size="md"
                      disabled={!canNext}
                      onClick={() => setStep(s => s + 1)}
                      icon={<ChevronLeft className="w-4 h-4" />}
                      iconPosition="left"
                    >
                      הבא
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleCalculate}
                      icon={<CalcIcon className="w-4 h-4" />}
                    >
                      חשב תוצאות
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── BCS Lightbox ──────────────────────────────────────── */}
      {showBcsLightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          onClick={() => setShowBcsLightbox(false)}
        >
          {/* Blurred backdrop */}
          <div className="absolute inset-0 bg-[#1a0d06]/70 backdrop-blur-md" />

          {/* Image */}
          <div
            className="relative animate-fade-in"
            onClick={e => e.stopPropagation()}
          >
            <img
              src="/bcs3.png"
              alt="סולם מצב גוף BCS 1-9"
              className="max-w-[80vw] max-h-[80vh] object-contain rounded-3xl shadow-2xl"
            />
            {/* Close hint */}
            <button
              type="button"
              onClick={() => setShowBcsLightbox(false)}
              className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors duration-150"
              aria-label="סגור"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

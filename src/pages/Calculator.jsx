import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Calculator as CalcIcon, ChevronLeft, ChevronRight,
  RotateCcw, Calendar, Flame, Utensils, Zap,
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
function Results({ result, inputs, onReset }) {
  if (!result) return null

  const { mer, rer, dailyGrams, perMeal, frequency, macros, foodType } = result

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero stats */}
      <div className="bg-green-gradient rounded-3xl p-6 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Flame className="w-4 h-4 text-olive-light" />
          <span className="text-xs font-medium text-white/70 uppercase tracking-wider">צרכים קלוריים יומיים</span>
        </div>
        <div className="text-5xl font-bold mt-1">{mer.toLocaleString()}</div>
        <div className="text-white/60 text-sm">קלוריות ליום (MER)</div>
        <div className="mt-3 text-xs text-white/50">RER (מנוחה): {rer.toLocaleString()} קק"ל</div>
      </div>

      {/* Food amount */}
      <div className="bg-white border border-stone rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Utensils className="w-4 h-4 text-forest" />
          <h3 className="font-semibold text-earth">כמות אוכל יומית</h3>
        </div>
        <div className="flex items-end gap-2 mb-1">
          <span className="text-4xl font-bold text-forest">{dailyGrams.toLocaleString()}</span>
          <span className="text-mist text-sm mb-1.5">גרם / יום</span>
        </div>
        <p className="text-sm text-mist mb-4">
          {foodType?.label} • {foodType?.kcalPer100g} קק"ל / 100 גרם
        </p>
        <div className="bg-parchment rounded-2xl p-4 flex items-center justify-between">
          <div className="text-center">
            <div className="text-2xl font-bold text-forest">{perMeal}</div>
            <div className="text-xs text-mist">גרם לארוחה</div>
          </div>
          <div className="w-px h-10 bg-stone" />
          <div className="text-center">
            <div className="text-2xl font-bold text-earth">{frequency.times}</div>
            <div className="text-xs text-mist">ארוחות ביום</div>
          </div>
          <div className="w-px h-10 bg-stone" />
          <div className="text-center">
            <div className="text-2xl font-bold text-earth">{(dailyGrams / 1000).toFixed(2)}</div>
            <div className="text-xs text-mist">ק"ג / יום</div>
          </div>
        </div>
      </div>

      {/* Macro breakdown */}
      <div className="bg-white border border-stone rounded-3xl p-6">
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
      </div>

      {/* Disclaimer + CTA */}
      <div className="bg-parchment rounded-2xl p-4 flex gap-3 text-xs text-mist">
        <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-sage" />
        <p>החישוב מהווה הערכה מבוססת נוסחאות וטרינריות מקובלות (AAFCO/NRC). לתוכנית מדויקת ומותאמת אישית — קבעו ייעוץ.</p>
      </div>

      <Link to="/consultations">
        <Button variant="primary" size="lg" className="w-full">
          לייעוץ מקצועי מלא
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </Link>

      <button onClick={onReset} className="w-full text-sm text-mist hover:text-bark flex items-center justify-center gap-1.5 transition-colors">
        <RotateCcw className="w-3.5 h-3.5" />
        חישוב מחדש
      </button>
    </div>
  )
}

/* ─── Main Calculator ─────────────────────────────────────── */
const TOTAL_STEPS = 3

const INITIAL = {
  name:          '',
  weightKg:      10,
  ageYears:      2,
  lifeStage:     'adult',
  activityLevel: 'moderate',
  isNeutered:    true,
  bodyCondition: 'ideal',
  foodType:      'dry',
}

export default function Calculator() {
  const [step,   setStep]   = useState(0)
  const [inputs, setInputs] = useState(INITIAL)
  const [result, setResult] = useState(null)
  const topRef = useRef(null)

  const set = (key, val) => setInputs(prev => ({ ...prev, [key]: val }))

  function handleCalculate() {
    setResult(calculate(inputs))
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
      <div className="bg-earth text-white">
        <div className="container-gaia py-14 md:py-20">
          <div ref={topRef} />
          <Badge variant="olive" dot className="mb-4">כלי חינמי</Badge>
          <h1 className="text-display-lg font-serif text-white mb-3">
            מחשבון תזונה לכלב
          </h1>
          <p className="text-white/60 max-w-lg text-base leading-relaxed">
            חישוב מדויק של הצרכים הקלוריים היומיים של הכלב שלכם — בהתבסס על
            נוסחאות וטרינריות מקובלות (AAFCO / NRC).
          </p>
        </div>
      </div>

      <div className="container-gaia py-10 md:py-16">
        <div className="max-w-2xl mx-auto">

          {/* Show results or form */}
          {result ? (
            <Results result={result} inputs={inputs} onReset={handleReset} />
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

                    {/* Weight */}
                    <Slider
                      label="משקל"
                      value={inputs.weightKg}
                      min={1}
                      max={80}
                      step={0.5}
                      unit=" ק״ג"
                      hint="משקל הכלב הנוכחי בקילוגרמים"
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
                        if (v < 0.33) set('lifeStage', 'puppy_small')
                        else if (v < 1) set('lifeStage', 'puppy')
                        else if (v >= 7) set('lifeStage', 'senior')
                        else set('lifeStage', 'adult')
                      }}
                    />

                    {/* Life stage (auto-set, but overrideable) */}
                    <div>
                      <label className="text-sm font-medium text-bark block mb-2">שלב חיים</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: 'puppy_small', icon: '🐾', label: 'גור צעיר', sub: 'עד 4 חודשים' },
                          { id: 'puppy',       icon: '🐶', label: 'גור',       sub: '4–12 חודשים' },
                          { id: 'adult',       icon: '🐕', label: 'בוגר',      sub: '1–7 שנים' },
                          { id: 'senior',      icon: '🦴', label: 'מבוגר',     sub: '7+ שנים' },
                        ].map(ls => (
                          <OptionCard
                            key={ls.id}
                            selected={inputs.lifeStage === ls.id}
                            onClick={() => set('lifeStage', ls.id)}
                            icon={ls.icon}
                            label={ls.label}
                            sublabel={ls.sub}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Step 1: Lifestyle ── */}
                {step === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-xl font-semibold text-earth mb-1">אורח חיים</h2>
                      <p className="text-mist text-sm">אלה הנתונים שמשפיעים הכי הרבה על הצרכים הקלוריים</p>
                    </div>

                    {/* Activity level */}
                    <div>
                      <label className="text-sm font-medium text-bark block mb-2">רמת פעילות גופנית</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'low',      icon: '🛋️',  label: 'נמוכה',       sub: 'הליכות קצרות' },
                          { id: 'moderate', icon: '🚶',  label: 'בינונית',     sub: '1–2 שעות ביום' },
                          { id: 'active',   icon: '🏃',  label: 'פעיל',        sub: 'ריצות, אילוף' },
                          { id: 'sport',    icon: '🏅',  label: 'ספורטיבי',    sub: 'אגיליטי, שמירה' },
                        ].map(al => (
                          <OptionCard
                            key={al.id}
                            selected={inputs.activityLevel === al.id}
                            onClick={() => set('activityLevel', al.id)}
                            icon={al.icon}
                            label={al.label}
                            sublabel={al.sub}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Neutered */}
                    <div>
                      <label className="text-sm font-medium text-bark block mb-2">סטטוס סירוס / עיקור</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { val: true,  icon: '✂️', label: 'מסורס / מעוקרת' },
                          { val: false, icon: '🐾', label: 'שלם / שלמה' },
                        ].map(n => (
                          <OptionCard
                            key={String(n.val)}
                            selected={inputs.isNeutered === n.val}
                            onClick={() => set('isNeutered', n.val)}
                            icon={n.icon}
                            label={n.label}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Body condition */}
                    <div>
                      <label className="text-sm font-medium text-bark block mb-2">מצב גוף (BCS)</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'underweight', icon: '📉', label: 'רזה מדי' },
                          { id: 'ideal',       icon: '✅', label: 'אידיאלי' },
                          { id: 'overweight',  icon: '📈', label: 'עודף משקל' },
                        ].map(bc => (
                          <OptionCard
                            key={bc.id}
                            selected={inputs.bodyCondition === bc.id}
                            onClick={() => set('bodyCondition', bc.id)}
                            icon={bc.icon}
                            label={bc.label}
                          />
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
                          sublabel={`${ft.kcalPer100g} קק"ל / 100 גרם`}
                        />
                      ))}
                    </div>

                    <div className="bg-parchment rounded-2xl p-4 flex gap-3 text-xs text-mist">
                      <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-sage" />
                      <p>הערכי הקלוריות הם ממוצעים. בדקו את תוויות המוצר הספציפי שלכם לנתונים מדויקים יותר.</p>
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
    </div>
  )
}

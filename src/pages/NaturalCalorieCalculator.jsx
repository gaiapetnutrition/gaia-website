import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Search, X, ChevronLeft } from 'lucide-react'
import clsx from 'clsx'
import Button from '../components/ui/Button'

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

/** Every typed word must appear somewhere in the ingredient name. Capped at 40. */
function filterIngredients(list, query) {
  if (!query.trim()) return []
  const words = query.trim().toLowerCase().split(/\s+/)
  return list
    .filter(item => words.every(w => item.name.toLowerCase().includes(w)))
    .slice(0, 40)
}

/* ─── Grams popup ──────────────────────────────────────────────────────────── */
function GramsPopup({ item, onConfirm, onCancel }) {
  const [grams, setGrams] = useState('100')
  const inputRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    }, 50)
    return () => clearTimeout(t)
  }, [])

  function confirm() {
    const val = parseFloat(grams)
    if (!val || val <= 0) return
    onConfirm(val)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') confirm()
    if (e.key === 'Escape') onCancel()
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      <div className="relative bg-white rounded-2xl shadow-card-hover p-6 w-full max-w-xs" onClick={e => e.stopPropagation()}>
        <p className="text-xs text-mist mb-1 truncate text-left" dir="ltr">{item.name}</p>
        <h3 className="text-base font-semibold text-bark mb-4 text-right">כמה גרם להוסיף?</h3>
        <div className="relative mb-4">
          <input
            ref={inputRef}
            type="number"
            min="1"
            value={grams}
            onChange={e => setGrams(e.target.value)}
            onKeyDown={handleKeyDown}
            className="input-base pr-10 text-right tabular-nums"
            dir="rtl"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-mist pointer-events-none">ג׳</span>
        </div>
        <div className="flex gap-2">
          <button onClick={confirm} className="flex-1 bg-forest text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-forest-dark transition-colors">הוסף</button>
          <button onClick={onCancel} className="flex-1 bg-parchment text-bark text-sm font-semibold py-2.5 rounded-xl hover:bg-stone transition-colors">ביטול</button>
        </div>
      </div>
    </div>
  )
}

/* ─── Ingredient search with keyboard nav ──────────────────────────────────── */
function IngredientSearch({ ingredients, onAdd }) {
  const [query,   setQuery]   = useState('')
  const [open,    setOpen]    = useState(false)
  const [focused, setFocused] = useState(-1)
  const [pending, setPending] = useState(null)
  const inputRef = useRef(null)
  const listRef  = useRef(null)

  const results = filterIngredients(ingredients, query)

  function select(item) {
    setQuery('')
    setOpen(false)
    setFocused(-1)
    setPending(item)
  }

  function confirmGrams(grams) {
    onAdd({ ...pending, grams })
    setPending(null)
    inputRef.current?.focus()
  }

  function handleKeyDown(e) {
    if (!open || !results.length) return
    if      (e.key === 'ArrowDown')              { e.preventDefault(); setFocused(f => Math.min(f + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp')                { e.preventDefault(); setFocused(f => Math.max(f - 1, 0)) }
    else if (e.key === 'Enter' && focused >= 0)  { e.preventDefault(); select(results[focused]) }
    else if (e.key === 'Escape')                 { setOpen(false) }
  }

  useEffect(() => {
    if (focused >= 0 && listRef.current) {
      listRef.current.children[focused]?.scrollIntoView({ block: 'nearest' })
    }
  }, [focused])

  return (
    <div className="relative">
      {/* Input */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mist pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          dir="ltr"
          placeholder="e.g. chicken breast, salmon, rice..."
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); setFocused(-1) }}
          onFocus={() => query && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={handleKeyDown}
          className="input-base pr-9 pl-9"
          aria-autocomplete="list"
          aria-expanded={open && results.length > 0}
        />
        {query && (
          <button
            onMouseDown={() => { setQuery(''); setOpen(false) }}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-mist hover:text-bark transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute top-full right-0 left-0 z-50 mt-1 bg-white border border-stone rounded-2xl shadow-card-hover max-h-64 overflow-y-auto py-1"
        >
          {results.map((item, i) => (
            <li
              key={item.id}
              role="option"
              aria-selected={i === focused}
              onMouseDown={() => select(item)}
              onMouseEnter={() => setFocused(i)}
              className={clsx(
                'flex items-center justify-between gap-3 px-4 py-2.5 cursor-pointer text-sm transition-colors duration-75',
                i === focused ? 'bg-forest/5 text-forest' : 'text-bark hover:bg-parchment',
              )}
            >
              <span className="flex-1 truncate text-left" dir="ltr" title={item.name}>{item.name}</span>
              <span className="flex-shrink-0 text-xs text-mist tabular-nums">
                {item.kcal_per_100g} kcal/100g
              </span>
            </li>
          ))}
        </ul>
      )}

      {open && query.trim() && results.length === 0 && (
        <div className="absolute top-full right-0 left-0 z-50 mt-1 bg-white border border-stone rounded-2xl shadow-card px-4 py-3 text-sm text-mist">
          לא נמצאו תוצאות עבור &ldquo;{query}&rdquo;
        </div>
      )}

      {pending && (
        <GramsPopup
          item={pending}
          onConfirm={confirmGrams}
          onCancel={() => { setPending(null); inputRef.current?.focus() }}
        />
      )}
    </div>
  )
}

/* ─── Single recipe row ────────────────────────────────────────────────────── */
function RecipeRow({ row, onUpdateGrams, onRemove }) {
  const kcal = (Number(row.grams) || 0) * (row.kcal_per_100g / 100)
  return (
    <tr className="border-b border-stone/60 last:border-0">
      {/* Name */}
      <td className="py-3 px-3 sm:px-4">
        <div className="text-sm font-medium text-earth leading-snug whitespace-normal break-words" dir="ltr">
          {row.name}
        </div>
      </td>

      {/* Grams */}
      <td className="py-3 px-2 sm:px-4 w-28">
        <input
          type="number"
          min="0"
          value={row.grams}
          onChange={e => onUpdateGrams(row.id, e.target.value)}
          className="w-20 rounded-xl border border-stone bg-white px-3 py-2 text-sm text-earth text-center
                     transition duration-200 focus:outline-none focus:border-sage focus:shadow-input"
        />
      </td>

      {/* Kcal */}
      <td className="py-3 px-2 sm:px-4 w-20 text-center">
        <span className={clsx(
          'text-sm font-semibold tabular-nums',
          kcal > 0 ? 'text-forest' : 'text-stone-dark',
        )}>
          {kcal > 0 ? Math.round(kcal) : '—'}
        </span>
      </td>

      {/* Remove */}
      <td className="py-3 px-2 sm:px-4 w-10 text-center">
        <button
          onClick={() => onRemove(row.id)}
          className="text-mist hover:text-red-500 transition-colors"
          title="הסר רכיב"
        >
          <X className="w-4 h-4" />
        </button>
      </td>
    </tr>
  )
}

/* ─── Results banner ───────────────────────────────────────────────────────── */
function ResultsBox({ totalKcal, kcalPerServing, servings, totalGrams }) {
  const hasData = totalKcal > 0
  const kcalPer100g = hasData && totalGrams > 0 ? (totalKcal / totalGrams) * 100 : null
  const kcalPerKg   = kcalPer100g != null ? kcalPer100g * 10 : null

  return (
    <div className="bg-forest rounded-2xl p-5 text-white">
      <div className="text-xs font-semibold uppercase tracking-widest opacity-60 mb-3">תוצאה</div>

      {/* Row 1: total + per serving */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs opacity-60 mb-1">סך קלוריות במתכון</div>
          <div className="text-3xl font-bold tabular-nums leading-none">
            {hasData ? Math.round(totalKcal).toLocaleString('he-IL') : '—'}
          </div>
          {hasData && <div className="text-xs opacity-50 mt-1">קק"ל</div>}
        </div>

        <div className="border-r border-white/20 pr-4">
          <div className="text-xs opacity-60 mb-1">לכלב אחד</div>
          <div className="text-3xl font-bold tabular-nums leading-none">
            {hasData ? Math.round(kcalPerServing).toLocaleString('he-IL') : '—'}
          </div>
          {hasData && <div className="text-xs opacity-50 mt-1">קק"ל</div>}
        </div>
      </div>

      {/* Row 2: per 100g + per kg — shown only when data exists */}
      {kcalPer100g != null && (
        <div className="border-t border-white/20 pt-4 grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs opacity-60 mb-1">לכל 100 גרם מתכון</div>
            <div className="text-2xl font-bold tabular-nums leading-none">
              {Math.round(kcalPer100g).toLocaleString('he-IL')}
            </div>
            <div className="text-xs opacity-50 mt-1">קק"ל / 100 גרם</div>
          </div>

          <div className="border-r border-white/20 pr-4">
            <div className="text-xs opacity-60 mb-1">לקילוגרם מתכון</div>
            <div className="text-2xl font-bold tabular-nums leading-none">
              {Math.round(kcalPerKg).toLocaleString('he-IL')}
            </div>
            <div className="text-xs opacity-50 mt-1">קק"ל / ק"ג</div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Main component ───────────────────────────────────────────────────────── */
export default function NaturalCalorieCalculator() {
  const [ingredients, setIngredients] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [recipe,      setRecipe]      = useState([])
  const [servings,    setServings]    = useState(1)

  /* Calorie math — derived, no extra state */
  const totalKcal      = recipe.reduce((sum, r) => sum + (Number(r.grams) || 0) * (r.kcal_per_100g / 100), 0)
  const totalGrams     = recipe.reduce((sum, r) => sum + (Number(r.grams) || 0), 0)
  const kcalPerServing = servings > 0 ? totalKcal / servings : 0

  /* Fetch ingredient list once on mount */
  useEffect(() => {
    fetch('/ingredient_calorie_list.json')
      .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json() })
      .then(data => { setIngredients(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  /* Recipe handlers */
  function handleAdd(item) {
    const grams = item.grams ?? 100
    setRecipe(prev => prev.find(r => r.id === item.id)
      ? prev
      : [...prev, { id: item.id, name: item.name, kcal_per_100g: item.kcal_per_100g, source: item.source, grams }]
    )
  }

  function handleUpdateGrams(id, value) {
    setRecipe(prev => prev.map(r => r.id === id ? { ...r, grams: value === '' ? '' : Number(value) } : r))
  }

  function handleRemove(id) {
    setRecipe(prev => prev.filter(r => r.id !== id))
  }

  /* ── Render ── */
  return (
    <div className="min-h-screen bg-cream">

      {/* Page header */}
      <div className="bg-green-gradient text-white overflow-hidden relative">
        {/* Paw watermark — bottom-left */}
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
              <h1 className="text-display-lg font-serif text-white mb-3">מחשבון קלוריות לתזונה טבעית</h1>
              <p className="text-white/60 max-w-lg text-base leading-relaxed">
                בנו מתכון מהמרכיבים שלכם וראו בדיוק כמה קלוריות הכלב שלכם מקבל בכל ארוחה. מבוסס על נתוני מזון אנושיים (USDA).
              </p>
            </div>
            {/* Image — left side, faded into background */}
            <div className="hidden md:block flex-shrink-0 relative self-end" style={{ width: '500px', height: '260px', marginLeft: '60px', marginBottom: '-90px' }}>
              <img
                src="/calorie_image3.png"
                alt=""
                className="absolute inset-0 w-full h-full object-contain object-bottom"
                style={{
                  maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 100%)',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container-gaia py-10">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* ── Main card ── */}

          <div className="bg-white border border-stone rounded-4xl shadow-card">
            <div className="p-6 sm:p-8 space-y-7">

              {/* Loading / error states */}
              {loading && (
                <div className="text-center py-12 text-mist animate-pulse-soft">
                  טוען רשימת מרכיבים…
                </div>
              )}
              {error && (
                <div className="text-center py-12 text-red-500 text-sm">
                  שגיאה בטעינת הנתונים: {error}
                </div>
              )}

              {!loading && !error && (
                <>
                  {/* ── Search section ── */}
                  <div className="space-y-2 animate-fade-in relative z-10">
                    <label className="text-sm font-semibold text-bark block">
                      חיפוש מרכיב
                    </label>
                    <p className="text-xs text-mist -mt-1">
                      שמות המרכיבים הם <strong className="text-bark font-semibold">באנגלית</strong> (מסד נתוני <strong className="text-bark font-semibold">USDA</strong>)
                    </p>
                    <IngredientSearch ingredients={ingredients} onAdd={handleAdd} />
                    <p className="text-[11px] text-mist text-right">
                      מתוך מאגר עדכני של {ingredients.length.toLocaleString('he-IL')} רכיבים
                    </p>
                  </div>

                  {/* ── Recipe table ── */}
                  {recipe.length > 0 && (
                    <div className="space-y-4 animate-fade-in">

                      {/* Table header row + servings */}
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <h2 className="text-sm font-semibold text-bark">
                          מרכיבי המתכון
                          <span className="text-mist font-normal mr-1">({recipe.length})</span>
                        </h2>

                        {/* Servings */}
                        <label className="flex items-center gap-2 text-sm text-bark">
                          חלוקה ל
                          <input
                            type="number"
                            min="1"
                            value={servings}
                            onChange={e => setServings(Math.max(1, Number(e.target.value) || 1))}
                            className="w-16 rounded-xl border border-stone bg-white px-3 py-1.5 text-sm text-center
                                       text-earth transition duration-200 focus:outline-none focus:border-sage focus:shadow-input"
                          />
                          כלבים
                        </label>
                      </div>

                      {/* Table */}
                      <div className="overflow-x-auto -mx-1 rounded-2xl border border-stone/60">
                        <table className="w-full min-w-[380px]">
                          <thead>
                            <tr className="bg-parchment border-b border-stone/60">
                              <th className="py-2.5 px-3 sm:px-4 text-xs font-semibold text-mist text-right">מרכיב</th>
                              <th className="py-2.5 px-2 sm:px-4 text-xs font-semibold text-mist text-center">גרם</th>
                              <th className="py-2.5 px-2 sm:px-4 text-xs font-semibold text-mist text-center">קק"ל</th>
                              <th className="py-2.5 px-2 sm:px-4 w-10" />
                            </tr>
                          </thead>
                          <tbody>
                            {recipe.map(row => (
                              <RecipeRow
                                key={row.id}
                                row={row}
                                onUpdateGrams={handleUpdateGrams}
                                onRemove={handleRemove}
                              />
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-parchment border-t-2 border-stone/80">
                              <td className="py-2.5 px-3 sm:px-4 text-xs font-bold text-bark text-right">סך הכל</td>
                              <td className="py-2.5 px-2 sm:px-4 text-center">
                                <span className="text-sm font-bold text-bark tabular-nums">
                                  {totalGrams > 0 ? totalGrams.toLocaleString('he-IL') : '—'}
                                  {totalGrams > 0 && <span className="text-xs font-normal text-mist mr-0.5"> ג׳</span>}
                                </span>
                              </td>
                              <td className="py-2.5 px-2 sm:px-4 text-center">
                                <span className="text-sm font-bold text-forest tabular-nums">
                                  {totalKcal > 0 ? Math.round(totalKcal).toLocaleString('he-IL') : '—'}
                                </span>
                              </td>
                              <td className="py-2.5 px-2 sm:px-4 w-10" />
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      {/* Results */}
                      <ResultsBox
                        totalKcal={totalKcal}
                        kcalPerServing={kcalPerServing}
                        servings={servings}
                        totalGrams={totalGrams}
                      />

                      {/* CTA */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-1">
                        <Link to="/consultations" className="flex-1">
                          <Button variant="primary" size="lg" className="w-full">
                            לייעוץ תזונתי מותאם אישית
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="lg"
                          className="flex-1"
                          onClick={() => { setRecipe([]); setServings(1) }}
                        >
                          <X className="w-4 h-4" />
                          נקה מתכון
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Empty state */}
                  {recipe.length === 0 && (
                    <div className="text-center py-10 text-mist text-sm space-y-1">
                      <img src="/gaia-paw.png" alt="" className="w-10 h-10 mx-auto mb-3 opacity-25" />
                      <p>חפשו מרכיב למעלה והוסיפו אותו למתכון</p>
                    </div>
                  )}
                </>
              )}

            </div>
          </div>

        </div>

        {/* Disclaimer — wider than main card */}
        <div className="max-w-3xl mx-auto mt-6">
          <div className="bg-parchment border border-stone/60 rounded-3xl p-5 space-y-2">
            <p className="text-xs text-bark font-semibold">הערות חשובות</p>
            <ul className="text-xs text-mist leading-relaxed space-y-1 list-disc list-inside">
              <li>החישוב מבוסס על נתוני מזון אנושיים (USDA) ומהווה הערכה בלבד — הערכים עשויים להשתנות לפי מקור, זמן בישול ואיכות המרכיב.</li>
              <li>המחשבון לא בודק איזון תזונתי מלא לכלבים — חלבון, ויטמינים, מינרלים ועוד.</li>
              <li>
                לתפריט מאוזן ומותאם אישית לכלבכם —{' '}
                <Link to="/consultations" className="text-forest font-semibold hover:underline">
                  צרו קשר לייעוץ תזונתי
                </Link>
                .
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  )
}

import { useState, useEffect, useRef, useMemo, useCallback, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Search, X, RotateCcw, ChevronDown, MoveHorizontal } from 'lucide-react'
import clsx from 'clsx'
import Button from '../components/ui/Button'
import { compareToAafco, NUTRIENT_LABELS, CHLORIDE_NOTE } from '../utils/aafcoLogic'

/* ─── AAFCO explainer — collapsible ─────────────────────────────────────────── */
function AafcoExplainer() {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white border border-stone rounded-3xl shadow-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-right"
      >
        <span className="text-sm font-semibold text-bark">מה זה AAFCO ולמה זה חשוב?</span>
        <ChevronDown className={clsx('w-4 h-4 text-mist transition-transform duration-200 flex-shrink-0', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="px-5 pb-5 text-sm text-mist leading-relaxed space-y-2 border-t border-stone/60 pt-4">
          <p>
            AAFCO הוא אחד מהארגונים המקצועיים שקובע את פרופילי התזונה המלאה והמזינה לכלבים וחתולים, על בסיס מחקרים ותצפיות ארוכות שנים. הפרופילים שלהם מבוססים על המחקרים של גוף המחקר NRC והם היום למעשה הקו המנחה העיקרי בעולם שמגדיר את המינימום לתזונה מלאה ומאוזנת - כלומר רמות מינימום של ויטמינים ומינרלים שמתחתיהן נצפו תסמיני חוסרים ומחלות.
          </p>
          <p>
            חשוב להבין שגם המילים ״מלא ומאוזן״ מטעות מעט - AAFCO מגדיר רק את <strong>הסף התזונתי המינימלי</strong> (ולחלק מהנוטריינטים גם תקרה בטוחה), <strong>ולא ״תפריט אידיאלי או מושלם״.</strong> ולכן מטרתנו היא לוודא שהתפריט של הכלב שלנו עומד <strong>לפחות</strong> בדרישות המינימום האלה, ורק לאחר מכן לגוון, להתאים ולהרחיב את התפריט באופן אישי לכלב לפי מצב בריאות, גיל וצרכים מיוחדים.
          </p>
        </div>
      )}
    </div>
  )
}

/* ─── Growth life-stage info tooltip ────────────────────────────────────────── */
function GrowthInfoTooltip() {
  const [open, setOpen] = useState(false)
  const [direction, setDirection] = useState('up') // 'up' | 'down'
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    function handleKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    function handleScroll() {
      setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    window.addEventListener('scroll', handleScroll, { capture: true, passive: true })
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
      window.removeEventListener('scroll', handleScroll, { capture: true })
    }
  }, [open])

  function toggleOpen(e) {
    e.stopPropagation()
    if (!open) {
      // Not enough room above the button for the tooltip → open downward instead
      const rect = ref.current?.getBoundingClientRect()
      const TOOLTIP_HEIGHT_ESTIMATE = 150
      setDirection(rect && rect.top < TOOLTIP_HEIGHT_ESTIMATE ? 'down' : 'up')
    }
    setOpen(o => !o)
  }

  return (
    <span ref={ref} className="relative inline-flex flex-shrink-0">
      <button
        type="button"
        onClick={toggleOpen}
        className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full
                   bg-sage/20 text-sage text-[9px] font-bold cursor-pointer
                   hover:bg-sage/40 transition-colors"
        aria-label="מידע על שלב גידול"
      >
        i
      </button>

      {open && (
        <span
          className={clsx(
            'absolute right-0 z-50 w-64 rounded-2xl',
            'bg-parchment text-bark text-xs leading-relaxed p-3 shadow-warm-sm border border-stone',
            direction === 'up'
              ? 'bottom-full mb-2 before:absolute before:bottom-[-6px] before:right-3 before:border-4 before:border-transparent before:border-t-parchment'
              : 'top-full mt-2 before:absolute before:top-[-6px] before:right-3 before:border-4 before:border-transparent before:border-b-parchment'
          )}
          dir="rtl"
        >
          <span className="font-semibold block mb-1 text-earth">הידעתם?</span>
          גזעים קטנים יכולים להחשב גורים עד גיל ~10 חודשים, בינוניים עד ~12 חודשים, גדולים עד ~15 חודשים, וענקיים עד ~24 חודשים.
          <span className="block mt-1.5 font-semibold text-earth">חשוב לזכור שמדובר בהערכות כלליות, והקצב עשוי להשתנות בין כלב לכלב.</span>
        </span>
      )}
    </span>
  )
}

/* ─── Chloride info tooltip (hover + click for mobile) ─────────────────────── */
function ChlorideTooltip() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close when clicking outside
  useEffect(() => {
    if (!open) return
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <span ref={ref} className="relative inline-flex flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full
                   bg-sage/20 text-sage text-[9px] font-bold cursor-pointer
                   hover:bg-sage/40 transition-colors"
        aria-label="מידע על חישוב כלוריד"
      >
        i
      </button>

      {open && (
        <span
          className="absolute bottom-full right-0 mb-2 z-50 w-64 rounded-2xl
                     bg-earth text-white text-xs leading-relaxed p-3 shadow-lg
                     before:absolute before:bottom-[-6px] before:right-3
                     before:border-4 before:border-transparent before:border-t-earth"
          dir="rtl"
        >
          {CHLORIDE_NOTE}
        </span>
      )}
    </span>
  )
}

/* ─── Nutrient education content ─────────────────────────────────────────────── */
// Keyed by the English nutrient key (row.nutrient). Add one entry at a time —
// only nutrients present here get an "i" info button in the results table.
const NUTRIENT_INFO = {
  Calcium: `סידן הוא הרבה יותר מ"חשוב לעצמות". כן, הוא חיוני לבניית השלד והשיניים, אבל גם להעברת אותות עצביים, כיווץ שרירים וקרישת דם. כאשר התזונה אינה מספקת סידן זמין או שהיחס בינו לבין זרחן אינו מאוזן, הגוף עלול לשחרר סידן מהעצמות כדי לשמור על רמתו בדם. לאורך זמן זה עלול להחליש את השלד, ובמיוחד בגורים לגרום לעיוותי עצם, צליעה או שברים גם במאמץ רגיל.

חשוב לזכור: סידן עובד יחד עם זרחן וויטמין D; לכן, לא רק הכמות אלא גם האיזון ביניהם קובע. גם עודף סידן אינו "ביטוח" לעצמות ועלול לפגוע בהתפתחות השלד, בעיקר בכלבים גדולים בתקופת גדילה.`,
  Choline: `כולין הוא רכיב דמוי-ויטמין התומך בממברנות של כל תא, בתקשורת עצבית ובפירוק והובלה תקינים של שומנים מהכבד. כשהוא חסר, הכבד מתקשה לארוז ולהוציא שומן, ולכן עלולה להיווצר הצטברות שומן ופגיעה בתפקודו. מחסור ממושך תועד גם בהקשר של ירידה בתיאבון, אנמיה ובצקות.

כולין פועל בשיתוף עם חלבון, מתיונין, פולאט וויטמין B12-לכן בוחנים את התזונה השלמה, ולא רק את המספר שלו במחשבון.`,
  Copper: `נחושת היא מינרל שמפעיל אנזימים חיוניים לייצור אנרגיה בתאים, ניצול ברזל ויצירת תאי דם אדומים, בניית רקמות חיבור ויצירת פיגמנט בפרווה. מחסור ממושך עלול להתבטא באנמיה, ירידה באיכות או בהעמקת צבע הפרווה, פגיעה בגדילה ובחוזק רקמות החיבור ולעיתים חולשה או בעיות עצביות.

כמו מינרלים רבים, נחושת דורשת איזון. גם תוספת ללא צורך אינה בהכרח מועילה, ובחלק מהכלבים (בייחוד בגזעים בעלי נטייה גנטית) הצטברות נחושת בכבד עלולה להיות בעייתית.`,
  'Folic acid': `חומצה פולית חיונית לייצור DNA ולחלוקת תאים, ולכן תומכת בהתחדשות של רקמות פעילות כמו רירית המעי ומח העצם. היא גם פועלת לצד ויטמין B12 בתהליכים הקשורים ליצירת תאי דם ולמטבוליזם תקין.

בתזונה שאינה מלאה ומאוזנת, חוסר ממושך בפולאט עלול לפגוע ביכולת הגוף לחדש תאים ולתמוך בגדילה ובתפקוד תקין של מערכת העיכול. מחסור משמעותי יכול לתרום לחולשה, ירידה במצב הגוף ולעיתים גם לשינויים במדדי הדם - אך תסמינים אלה אינם ייחודיים לפולאט בלבד.`,
  Iodine: `יוד עוזר לבלוטת התריס לייצר הורמונים שמנהלים את קצב חילוף החומרים, האנרגיה, הגדילה ובריאות העור והפרווה.

חוסר ביוד לאורך זמן עלול להאט את פעילות הגוף: הכלב עשוי להיות עייף יותר, לעלות במשקל, להיות רגיש לקור ולפתח פרווה דלילה או עור יבש. אצל גורים, חוסר משמעותי עלול לפגוע בגדילה. גם עודף יוד עלול להזיק, לכן חשוב לשמור על הכמות המדויקת בתפריט.`,
  Iron: `ברזל חיוני ליצירת המוגלובין - החלבון שבתאי הדם האדומים שמוביל חמצן מהריאות לכל הגוף. לכן הוא משפיע ישירות על אנרגיה, פעילות, גדילה ותפקוד תקין של הרקמות.

כאשר התזונה דלה בברזל לאורך זמן, עלולה להתפתח אנמיה. הכלב עשוי להיות עייף וחלש, להתעייף מהר בפעילות, לאכול פחות ולהציג חניכיים חיוורות. במצב משמעותי ייתכנו נשימה או דופק מהירים. חשוב לזכור שאנמיה בכלבים יכולה להיגרם גם מאובדן דם או ממחלה, ולא רק מתזונה חסרה.`,
  Manganese: `מנגן הוא מינרל שמסייע לאנזימים להפוך מזון לאנרגיה, ותומך בבניית עצמות, סחוס ורקמות חיבור. לכן הוא חשוב במיוחד לגדילה, למפרקים ולתנועה תקינה.

חוסר ממושך במנגן עלול לפגוע בהתפתחות השלד והסחוס, להחליש את איכות רקמות החיבור ולתרום לבעיות גדילה או תנועה, במיוחד אצל גורים. הוא עשוי גם להשפיע על פוריות ועל יכולת הגוף להתמודד עם עומס חמצוני.`,
  Niacin: `ניאצין עוזר לגוף להפוך חלבון, שומן ופחמימות לאנרגיה. הוא חיוני גם לבריאות העור, מערכת העיכול והפה.

חוסר ממושך עלול לגרום לירידה בתיאבון ובמשקל, שלשול, חולשה ודלקת או פצעים בפה ובלשון. במקרים קשים, הלשון עשויה להתכהות - מצב היסטורי המכונה ״לשון שחורה" - ועלולים להתפתח גם אנמיה ופגיעה כללית במצב הגוף.`,
  'Pantothenic acid': `חומצה פנטותנית עוזרת לגוף להפיק אנרגיה מהמזון ולבנות ולפרק שומנים. היא חלק מקו-אנזים A, רכיב מרכזי בתהליכים רבים בתאים, ולכן תומכת בגדילה, במערכת העצבים ובתפקוד תקין של מערכת העיכול.

חוסר ממושך עלול להתחיל בירידה בתיאבון ובגדילה לא תקינה. במצב משמעותי יותר, הכלב עלול להיות חלש ועייף, לסבול מהקאות או שלשול ומבעיות עצביות; מחסור חמור מאוד תועד גם עם פגיעה בכבד.`,
  Pyridoxine: `ויטמין B6 עוזר לגוף להשתמש בחלבונים, שומנים ופחמימות, והוא חשוב לייצור תאי דם אדומים ולפעילות תקינה של מערכת העצבים והחיסון.

כאשר התזונה דלה ב-B6 לאורך זמן, הכלב עלול לסבול מירידה בתיאבון ובמשקל, חולשה ואנמיה. חוסר משמעותי יותר עלול לפגוע בעור ובפרווה ולגרום לסימנים עצביים, כגון רעידות, חוסר יציבות בהליכה או פרכוסים.`,
  Riboflavin: `ריבופלבין עוזר לתאים להפיק אנרגיה מהמזון ותומך בעור, בעיניים, במערכת העצבים וביצירת תאי דם. הוא חשוב במיוחד לרקמות שמתחדשות במהירות ולתפקוד תקין של הגוף כולו.

חוסר ממושך עלול לגרום לירידה במשקל ולחולשה, האטה בגדילה אצל גורים, בעיות עור ופרווה ופצעים בפה. במצב משמעותי יותר עלולות להופיע בעיות עיניים, הליכה לא יציבה ואנמיה.`,
}

/* ─── Status helpers ────────────────────────────────────────────────────────── */
const STATUS_META = {
  'Below minimum': { label: 'מתחת למינימום!', bg: 'bg-red-50',    text: 'text-red-600',    badge: 'bg-red-100 text-red-700'    },
  'Above maximum': { label: 'מעל המקסימום',  bg: 'bg-amber-50',  text: 'text-amber-600',  badge: 'bg-amber-100 text-amber-700' },
  'OK':            { label: 'בטווח התקין',  bg: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700' },
}

/* ─── Ingredient search dropdown ────────────────────────────────────────────── */
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
      <div
        className="relative bg-white rounded-2xl shadow-card-hover p-6 w-full max-w-xs"
        onClick={e => e.stopPropagation()}
      >
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
          <button
            onClick={confirm}
            className="flex-1 bg-forest text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-forest-dark transition-colors"
          >
            הוסף
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-parchment text-bark text-sm font-semibold py-2.5 rounded-xl hover:bg-stone transition-colors"
          >
            ביטול
          </button>
        </div>
      </div>
    </div>
  )
}

function IngredientSearch({ ingredients, onAdd }) {
  const [query,   setQuery]   = useState('')
  const [open,    setOpen]    = useState(false)
  const [focused, setFocused] = useState(-1)
  const [pending, setPending] = useState(null)
  const inputRef = useRef(null)
  const listRef  = useRef(null)

  const results = useMemo(() => {
    if (!query.trim()) return []
    const words = query.trim().toLowerCase().split(/\s+/)
    return ingredients
      .filter(item => words.every(w => item.name.toLowerCase().includes(w)))
      .slice(0, 40)
  }, [query, ingredients])

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
    if (focused >= 0 && listRef.current)
      listRef.current.children[focused]?.scrollIntoView({ block: 'nearest' })
  }, [focused])

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mist pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          dir="ltr"
          placeholder="e.g. chicken breast, beef, rice..."
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); setFocused(-1) }}
          onFocus={() => query && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={handleKeyDown}
          className="input-base pr-9 pl-9"
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

      {open && results.length > 0 && (
        <ul ref={listRef} role="listbox"
          className="absolute top-full right-0 left-0 z-50 mt-1 bg-white border border-stone rounded-2xl shadow-card-hover max-h-64 overflow-y-auto py-1"
        >
          {results.map((item, i) => (
            <li key={item.id} role="option" aria-selected={i === focused}
              onMouseDown={() => select(item)}
              onMouseEnter={() => setFocused(i)}
              className={clsx(
                'flex items-center justify-between gap-3 px-4 py-2.5 cursor-pointer text-sm transition-colors',
                i === focused ? 'bg-forest/5 text-forest' : 'text-bark hover:bg-parchment',
              )}
            >
              <span className="flex-1 truncate text-left" dir="ltr" title={item.name}>{item.name}</span>
              <span className="flex-shrink-0 text-xs text-mist tabular-nums">{item.kcal} kcal</span>
            </li>
          ))}
        </ul>
      )}

      {open && query.trim() && results.length === 0 && (
        <div className="absolute top-full right-0 left-0 z-50 mt-1 bg-white border border-stone rounded-2xl shadow-card px-4 py-3 text-sm text-mist">
          לא נמצאו תוצאות
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

/* ─── Recipe row in the input table ─────────────────────────────────────────── */
function RecipeInputRow({ row, onGramsChange, onRemove }) {
  const val = parseFloat(row.grams) || 0

  function handleMinus() {
    let next
    if (val <= 0.1)       next = 0.1          // floor — never reach 0
    else if (val <= 1)    next = Math.round((val - 0.1) * 10) / 10
    else                  next = Math.max(1, Math.round(val - 1))
    onGramsChange(row.id, next)
  }

  function handlePlus() {
    let next
    if (val < 1)  next = Math.round((val + 0.1) * 10) / 10
    else          next = Math.round(val + 1)
    onGramsChange(row.id, next)
  }

  const stepperBtn =
    'flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-lg ' +
    'border border-stone text-earth/70 hover:bg-forest hover:text-white hover:border-forest ' +
    'transition-colors duration-150 text-base leading-none select-none'

  return (
    <tr className="border-b border-stone/60 last:border-0">
      <td className="py-3 px-3 sm:px-4">
        <div className="text-sm text-earth leading-snug break-words" dir="ltr">{row.name}</div>
        <div className="text-xs text-mist mt-0.5 tabular-nums" dir="ltr">{row.kcal} kcal/100g</div>
      </td>
      <td className="py-3 px-2 w-32">
        <div className="flex items-center gap-1">
          <button onClick={handlePlus} className={stepperBtn} title="יותר" type="button">+</button>
          <input
            type="number"
            min="0.1"
            value={row.grams}
            onChange={e => onGramsChange(row.id, e.target.value)}
            className="w-14 rounded-xl border border-stone bg-white py-1.5 text-sm text-earth text-center
                       tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
                       transition duration-200 focus:outline-none focus:border-sage focus:shadow-input"
          />
          <button onClick={handleMinus} className={stepperBtn} title="פחות" type="button">−</button>
        </div>
        <div className="text-[11px] text-mist tabular-nums text-center mt-1" dir="ltr">
          = {Math.round((row.kcal ?? 0) * (Number(row.grams) || 0) / 100)} kcal
        </div>
      </td>
      <td className="py-3 px-2 w-10 text-center">
        <button onClick={() => onRemove(row.id)} className="text-mist hover:text-red-500 transition-colors" title="הסר">
          <X className="w-4 h-4" />
        </button>
      </td>
    </tr>
  )
}

/* ─── Coverage bar ───────────────────────────────────────────────────────────── */
function CoverageBar({ pct }) {
  if (pct == null) return <span className="text-mist text-xs">-</span>
  const capped   = Math.min(pct, 200)
  const barColor = pct < 100 ? 'bg-red-400' : pct > 100 ? 'bg-emerald-500' : 'bg-emerald-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-stone rounded-full overflow-hidden min-w-[40px]">
        <div className={clsx('h-full rounded-full transition-all', barColor)} style={{ width: `${capped / 2}%` }} />
      </div>
      <span className="text-xs tabular-nums w-12 text-right">{pct.toLocaleString('he-IL')}%</span>
    </div>
  )
}

/* ─── Results table ──────────────────────────────────────────────────────────── */
function ResultsTable({ rows, totalKcal }) {
  const below = rows.filter(r => r.status === 'Below minimum').length
  const above = rows.filter(r => r.status === 'Above maximum').length
  const ok    = rows.filter(r => r.status === 'OK').length

  const [expandedNutrient, setExpandedNutrient] = useState(null)

  return (
    <div className="space-y-4">
      {/* Summary chips */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-bark">
          סה"כ: {Math.round(totalKcal).toLocaleString('he-IL')} קק"ל/יום
        </span>
        <span className="flex-1" />
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5">
          {below > 0 && (
            <span className="pill bg-red-100 text-red-700">{below} מתחת למינימום!</span>
          )}
          {above > 0 && (
            <span className="pill bg-amber-100 text-amber-700">{above} מעל המקסימום</span>
          )}
          {ok > 0 && (
            <span className="pill bg-emerald-100 text-emerald-700">{ok} בטווח התקין<sup className="text-[9px] ml-0.5 opacity-70">*</sup></span>
          )}
        </div>
      </div>

      {/* Mobile-only hint: table scrolls sideways */}
      <div className="sm:hidden flex items-center justify-center gap-1.5 text-xs text-mist">
        <MoveHorizontal size={14} className="flex-shrink-0" />
        ניתן לגלול הטבלה לצדדים לצפייה בכל הנתונים
      </div>

      {/* Table */}
      <div className="relative">
        <div className="overflow-x-auto rounded-2xl border border-stone/60">
          <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="bg-parchment border-b border-stone/60">
              <th className="py-2.5 px-3 text-right text-xs font-semibold text-mist">רכיב תזונתי</th>
              <th className="py-2.5 px-2 text-center text-xs font-semibold text-mist w-12">יחידה</th>
              <th className="py-2.5 px-2 text-center text-xs font-semibold text-mist w-24">מתכון<br/>/1000 קק"ל</th>
              <th className="py-2.5 px-2 text-center text-xs font-semibold text-mist w-16">מינימום</th>
              <th className="py-2.5 px-2 text-center text-xs font-semibold text-mist w-16">מקסימום</th>
              <th className="py-2.5 px-3 text-right text-xs font-semibold text-mist w-36">כיסוי</th>
              <th className="py-2.5 px-3 text-right text-xs font-semibold text-mist w-32">סטטוס</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => {
              const meta = STATUS_META[row.status]
              const info = NUTRIENT_INFO[row.nutrient]
              const isExpanded = expandedNutrient === row.nutrient
              return (
                <Fragment key={row.nutrient}>
                  <tr className={clsx('border-b border-stone/40 last:border-0', meta.bg)}>
                    <td className="py-2.5 px-3 font-medium text-earth">
                      <span className="inline-flex items-center gap-1">
                        {NUTRIENT_LABELS[row.nutrient] ?? row.nutrient}
                        {/* Chloride-only tooltip: value is estimated from Sodium via NaCl ratio */}
                        {row.nutrient === 'Chloride' && (
                          <ChlorideTooltip />
                        )}
                        {info && (
                          <button
                            type="button"
                            onClick={() => setExpandedNutrient(isExpanded ? null : row.nutrient)}
                            className={clsx(
                              'inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-[9px] font-bold cursor-pointer transition-colors',
                              isExpanded ? 'bg-sage text-white' : 'bg-sage/20 text-sage hover:bg-sage/40'
                            )}
                            aria-label={`מידע על ${NUTRIENT_LABELS[row.nutrient] ?? row.nutrient}`}
                            aria-expanded={isExpanded}
                          >
                            i
                          </button>
                        )}
                      </span>
                      <span className="block text-[10px] text-mist font-normal">{row.nutrient}</span>
                    </td>
                    <td className="py-2.5 px-2 text-center text-mist text-xs">{row.unit}</td>
                    <td className="py-2.5 px-2 text-center tabular-nums font-medium text-earth">
                      {row.per1000.toLocaleString('he-IL', { maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-2 text-center tabular-nums text-mist">{row.aafcoMin}</td>
                    <td className="py-2.5 px-2 text-center tabular-nums text-mist">
                      {row.aafcoMax != null ? row.aafcoMax : '-'}
                    </td>
                    <td className="py-2.5 px-3">
                      <CoverageBar pct={row.coveragePct} />
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={clsx('pill text-[11px]', meta.badge)}>
                        {meta.label}{row.status === 'OK' && <sup className="text-[9px] ml-0.5 opacity-70">*</sup>}
                      </span>
                    </td>
                  </tr>
                  {info && isExpanded && (
                    <tr className={clsx('border-b border-stone/40 last:border-0', meta.bg)}>
                      <td colSpan={7} className="px-3 pb-4 pt-0">
                        <div className="animate-fade-in rounded-xl bg-white/70 border border-stone/50 p-3.5 text-sm leading-relaxed text-bark whitespace-pre-line" dir="rtl">
                          {info}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
          </table>
        </div>
        {/* Mobile-only fade hinting more content to scroll to (RTL: content continues leftward) */}
        <div className="sm:hidden pointer-events-none absolute inset-y-0 left-0 w-8 rounded-l-2xl bg-gradient-to-l from-transparent to-white" />
      </div>

      {/* Footnote for "בטווח התקין*" */}
      {ok > 0 && (
        <p className="text-xs text-mist leading-relaxed pt-1 pr-0.5">
          <sup className="text-[10px] mr-0.5">*</sup>
          עמידה בטווח התקין לפי הנחיות AAFCO פירושה רק שמזון זה עומד ברמות המינימום (ואם מוגדר – גם המקסימום) של רכיבי התזונה עבור שלב החיים המצוין. היא אינה מבטיחה שהרכיב התזונתי נמצא ברמה האופטימלית עבור חיית המחמד האישית שלך או עבור צרכים בריאותיים ספציפיים, ולכן יש להשתמש בתוצאות אלו כהנחיה כללית בלבד ולהתייעץ עם וטרינר/ית או תזונאי/ת לקבלת ייעוץ מותאם אישית.
        </p>
      )}
    </div>
  )
}

// Temporarily disabled ingredients — excluded from the search/picker below.
// Remove an id from this list to re-enable it; the underlying data is untouched.
const DISABLED_INGREDIENT_IDS = [999001, 999002] // NOW Kelp Powder, Bone Meal Powder NOW

/* ─── Main page ──────────────────────────────────────────────────────────────── */
export default function AafcoBalanceCheck() {
  /* Data loading */
  const [ingredients,     setIngredients]     = useState([])
  const [ingredientsById, setIngredientsById] = useState(new Map())
  const [aafcoData,       setAafcoData]       = useState([])
  const [loading,         setLoading]         = useState(true)
  const [loadError,       setLoadError]       = useState(null)

  /* Recipe state */
  const [recipe,    setRecipe]    = useState([])   // [{id, name, kcal, grams}]
  const [lifeStage, setLifeStage] = useState('adult')

  /* Results */
  const [result,       setResult]       = useState(null)
  const [recalculating, setRecalculating] = useState(false)

  /* Debounce ref — cleared/reset on every recipe/lifeStage change */
  const debounceRef = useRef(null)

  /* Load both JSON files in parallel — no-store prevents stale iodine data from browser cache */
  useEffect(() => {
    Promise.all([
      fetch('/.netlify/functions/ingredient-nutrients-all', { cache: 'no-store' }).then(r => { if (!r.ok) throw new Error('ingredient_nutrients_all.json'); return r.json() }),
      fetch('/.netlify/functions/aafco-dog-per-1000kcal',   { cache: 'no-store' }).then(r => { if (!r.ok) throw new Error('aafco_dog_per_1000kcal.json');  return r.json() }),
    ])
      .then(([ingData, aafco]) => {
        const enabledIngData = ingData.filter(r => !DISABLED_INGREDIENT_IDS.includes(r.id))
        setIngredients(enabledIngData.map(r => ({ id: r.id, name: r.name, kcal: r.kcal })))
        setIngredientsById(new Map(enabledIngData.map(r => [r.id, r])))
        setAafcoData(aafco)
        setLoading(false)
      })
      .catch(err => { setLoadError(err.message); setLoading(false) })
  }, [])

  /* ── Auto-recalculate with 400 ms debounce whenever recipe or lifeStage changes ── */
  useEffect(() => {
    // Nothing to calculate yet
    if (!aafcoData.length || !ingredientsById.size) return

    // Empty recipe → clear results
    const hasGrams = recipe.some(r => Number(r.grams) > 0)
    if (recipe.length === 0 || !hasGrams) {
      setResult(null)
      setRecalculating(false)
      return
    }

    // Show "recalculating" only if we already have results on screen
    if (result) setRecalculating(true)

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const recipeRows = recipe.map(r => ({ id: r.id, grams: Number(r.grams) || 0 }))
      const res = compareToAafco(recipeRows, aafcoData, ingredientsById, lifeStage)

      setResult(res)
      setRecalculating(false)
    }, 400)

    return () => clearTimeout(debounceRef.current)
  }, [recipe, lifeStage, aafcoData, ingredientsById]) // eslint-disable-line react-hooks/exhaustive-deps

  /* Recipe handlers — no longer clear results; the effect handles updates */
  function handleAdd(item) {
    const grams = item.grams ?? 100
    setRecipe(prev => prev.find(r => r.id === item.id)
      ? prev
      : [...prev, { id: item.id, name: item.name, kcal: item.kcal, grams }]
    )
  }

  function handleGramsChange(id, value) {
    setRecipe(prev => prev.map(r => r.id === id ? { ...r, grams: value === '' ? '' : Number(value) } : r))
  }

  function handleRemove(id) {
    setRecipe(prev => prev.filter(r => r.id !== id))
  }

  /* Reset everything */
  function handleReset() {
    clearTimeout(debounceRef.current)
    setRecipe([])
    setLifeStage('adult')
    setResult(null)
    setRecalculating(false)
  }

  /* ── Render ── */
  return (
    <div className="min-h-screen bg-cream">

      {/* Header */}
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
              <h1 className="text-display-lg font-serif text-white mb-3">בדיקת מלא ומאוזן לפי AAFCO</h1>
              <p className="text-white/60 max-w-lg text-base leading-relaxed">
                הזינו את מרכיבי המתכון וקבלו השוואה מלאה לתקני AAFCO לכלבים, עם מינימום ומקסימום למגוון רכיבים תזונתיים.
              </p>
            </div>
            {/* Image — left side, decorative */}
            <div className="hidden md:flex flex-shrink-0 items-center self-stretch justify-center" style={{ minWidth: '380px', marginLeft: '0px' }}>
              <img
                src="/scale_image_final_copy.png"
                alt=""
                className="h-[27rem] w-auto object-contain drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container-gaia py-10">

        {loading && (
          <div className="text-center py-20 text-mist animate-pulse-soft">
            טוען נתוני מרכיבים ו-AAFCO…
          </div>
        )}

        {loadError && (
          <div className="text-center py-20 text-red-500">שגיאה בטעינה: {loadError}</div>
        )}

        {!loading && !loadError && (
          <div className="space-y-6">

            {/* AAFCO explainer */}
            <AafcoExplainer />

            {/* ── Life stage — full width above the grid ── */}
            <div className="bg-white border border-stone rounded-3xl shadow-card p-5">
              <div className="flex items-center gap-1.5 mb-3">
                <label className="text-sm font-semibold text-bark">שלב חיים</label>
                <GrowthInfoTooltip />
              </div>
              <div className="flex gap-3">
                {[
                  { id: 'growth', label: 'גור',   sub: 'Growth' },
                  { id: 'adult',  label: 'בוגר',         sub: 'Adult'  },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setLifeStage(opt.id)}
                    className={clsx(
                      'flex-1 flex flex-col items-center gap-0.5 p-3 rounded-2xl border-2 transition-all duration-150 text-center',
                      lifeStage === opt.id
                        ? 'border-forest bg-forest/[5%] text-forest'
                        : 'border-stone bg-white text-bark hover:border-sage/60',
                    )}
                  >
                    <span className="text-sm font-semibold">{opt.label}</span>
                    <span className="text-xs text-mist">{opt.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Ingredient search — full width ── */}
            <div className="bg-white border border-stone rounded-3xl shadow-card p-5 relative z-10">
              <label className="text-sm font-semibold text-bark block mb-1">הוספת מרכיב</label>
              <p className="text-xs text-mist mb-3">
                שמות באנגלית (USDA) - חפשו לפי שם <strong className="text-bark">באנגלית</strong>
              </p>
              <IngredientSearch ingredients={ingredients} onAdd={handleAdd} />
              <p className="text-[11px] text-mist text-right mt-2">מתוך מאגר עדכני של {ingredients.length.toLocaleString('he-IL')} רכיבים</p>
            </div>

            {/* ── Empty state — full width white card ── */}
            {recipe.length === 0 && (
              <div className="bg-white border border-stone rounded-3xl shadow-card p-8 text-center text-mist text-sm">
                <div className="flex items-center justify-center gap-3 mb-1">
                  <img src="/gaia-paw.png" alt="" className="h-5 w-5 mix-blend-multiply opacity-50" />
                  <p>חפשו מרכיב למעלה והוסיפו למתכון</p>
                  <img src="/gaia-paw.png" alt="" className="h-5 w-5 mix-blend-multiply opacity-50" />
                </div>
                <p className="mt-1 text-xs">התוצאות יתעדכנו אוטומטית בעת הקלדה</p>
              </div>
            )}

            {/* ── Two-column grid: recipe table left, results right ── */}
            {recipe.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 items-start">

                {/* Recipe table */}
                <div className="bg-white border border-stone rounded-3xl shadow-card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-bark">
                      מרכיבי המתכון
                      <span className="text-mist font-normal mr-1">({recipe.length})</span>
                    </h2>
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-1 text-xs text-mist hover:text-red-500 transition-colors"
                      title="נקה הכל והתחל מחדש"
                    >
                      <RotateCcw className="w-3 h-3" />
                      התחל מחדש
                    </button>
                  </div>

                  <div className="overflow-x-auto -mx-1 rounded-2xl border border-stone/60">
                    <table className="w-full min-w-[280px]">
                      <thead>
                        <tr className="bg-parchment border-b border-stone/60">
                          <th className="py-2 px-3 text-xs font-semibold text-mist text-right">מרכיב</th>
                          <th className="py-2 px-2 text-xs font-semibold text-mist text-center">
                            <span>גרם/יום</span>
                            <span className="block font-normal text-mist/70 tabular-nums mt-1">
                              (סה״כ: {recipe.reduce((s, r) => s + (Number(r.grams) || 0), 0).toLocaleString('he-IL')} ג׳)
                            </span>
                          </th>
                          <th className="py-2 px-2 w-10" />
                        </tr>
                      </thead>
                      <tbody>
                        {recipe.map(row => (
                          <RecipeInputRow
                            key={row.id}
                            row={row}
                            onGramsChange={handleGramsChange}
                            onRemove={handleRemove}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Results */}
                <div>
                  {result && (
                    <div className="bg-white border border-stone rounded-3xl shadow-card p-5 sm:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-earth">
                          תוצאות - {lifeStage === 'adult' ? 'כלב בוגר' : 'גידול / גור'}
                        </h2>
                        {recalculating && (
                          <span className="text-xs text-mist animate-pulse-soft">מחשב מחדש…</span>
                        )}
                      </div>
                      <ResultsTable rows={result.rows} totalKcal={result.totalKcal} />
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>
        )}

        {/* Disclaimer */}
        {!loading && !loadError && (
          <div className="max-w-3xl mx-auto mt-6 space-y-3">

            {/* Main warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 space-y-2">
              <p className="text-sm font-bold text-amber-800">⚠️ שימו לב</p>
              <p className="text-xs text-amber-900 leading-relaxed">
                המחשבון בודק מגוון רכיבי תזונה מרכזיים על פי הנחיות AAFCO, אך אינו כולל את כל הגורמים התזונתיים המשמעותיים בתזונה מלאה ומאוזנת. בנוסף, הוא אינו מתחשב ביחסים בין רכיבי התזונה - והיחסים חשובים. גם כאשר רכיב מסוים נראה מספק בכמותו, יחסים לא נכונים בין הרכיבים עלולים לפגוע בספיגה וליצור חסרים תזונתיים לאורך זמן.
              </p>
              <p className="text-xs font-semibold text-amber-800">
                השתמשו במחשבון כנקודת התחלה - לא כנקודת סיום.
              </p>
            </div>

            {/* Notes */}
            <div className="bg-parchment border border-stone/60 rounded-3xl p-5 space-y-1.5">
              <p className="text-xs text-bark font-semibold">הערות נוספות</p>
              <ul className="text-xs text-mist leading-relaxed space-y-1 list-disc list-inside">
                <li>הנתונים מבוססים על ערכי USDA לאוכל אנושי - הרכב ספציפי יכול להשתנות לפי מקור ואיכות המרכיב.</li>
                <li>ההשוואה מול תקני AAFCO היא הערכה בלבד ואינה מחליפה ייעוץ וטרינרי או תזונתי.</li>
                <li>
                  לבניית תפריט מאוזן ומותאם אישית -{' '}
                  <Link to="/consultations" className="text-forest font-semibold hover:underline">
                    צרו קשר לייעוץ תזונתי
                  </Link>.
                </li>
              </ul>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}

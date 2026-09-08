import { useRef, useState } from 'react'
import { FileDown } from 'lucide-react'
import Button from '../ui/Button'
import { generateScaledRecipePdf, buildScaledRecipeFilename } from '../../utils/pdf/scaledRecipePdf'

const GUIDANCE_NOTE =
  'הכמויות מוצגות כהמלצת התחלה על בסיס צרכים קלוריים משוערים. מומלץ לעקוב אחר משקל ומצב הגוף של הכלב ולהתאים את הכמות בעת הצורך.'

const STORAGE_NOTE =
  'בהכנה ליותר מ־3 ימים, מומלץ לחלק למנות. את המנות לשימוש בימים הקרובים שמרו בקירור, ואת היתר הקפיאו בהתאם לכללי אחסון מזון.'

const DISCLAIMER_HE =
  'המידע בדוח זה הוא כלי עזר כללי ואינו מהווה תחליף לייעוץ וטרינרי פרטני, במיוחד במקרים של מחלה, טיפול תרופתי, היריון או הנקה, גורים, או צרכים תזונתיים רפואיים.'

function isIOSSafari() {
  const ua = navigator.userAgent
  const isIOS = /iP(hone|od|ad)/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  return isIOS
}

function triggerDirectDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 60000)
}

/**
 * Client-side PDF export button for the scaled-recipe preparation/serving
 * report. Uses only the existing derived `scaled` result from
 * computeScaledRecipe() — no new calculations, no server call. Fully
 * independent from DownloadAafcoPdfButton.jsx.
 */
export default function DownloadScaledRecipePdfButton({ scaled, showStorageNote }) {
  const [status, setStatus] = useState('idle') // idle | loading | success | ios-ready | blocked | error
  const [fallbackUrl, setFallbackUrl] = useState(null)
  const busyRef = useRef(false)

  if (!scaled) return null

  async function handleClick() {
    if (busyRef.current) return
    busyRef.current = true

    const ios = isIOSSafari()
    // Must be the very first thing in the handler, before any await/import,
    // so Safari still attributes the new tab to this click's user gesture.
    const popup = ios ? window.open('', '_blank') : null
    if (popup) popup.document.write('<p style="font-family:sans-serif;padding:2rem">מכין PDF…</p>')

    setStatus('loading')
    setFallbackUrl(null)

    try {
      const { blob } = await generateScaledRecipePdf({
        targetDailyCalories: scaled.targetDailyCalories,
        mealsPerDay: scaled.mealsPerDay,
        daysToPrepare: scaled.daysToPrepare,
        items: scaled.items,
        showStorageNote,
        storageNote: STORAGE_NOTE,
        guidanceNote: GUIDANCE_NOTE,
        disclaimer: DISCLAIMER_HE,
      })

      const filename = buildScaledRecipeFilename()

      if (ios) {
        const url = URL.createObjectURL(blob)
        if (popup) {
          popup.location.href = url
          setStatus('ios-ready')
        } else {
          setFallbackUrl(url)
          setStatus('blocked')
        }
        setTimeout(() => URL.revokeObjectURL(url), 60000)
      } else {
        triggerDirectDownload(blob, filename)
        setStatus('success')
        setTimeout(() => setStatus('idle'), 2500)
      }
    } catch (err) {
      console.error('Scaled recipe PDF generation failed:', err)
      if (popup) popup.close()
      setStatus('error')
    } finally {
      busyRef.current = false
    }
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleClick}
        loading={status === 'loading'}
        icon={<FileDown className="w-4 h-4" />}
        iconPosition="right"
      >
        {status === 'loading' ? 'מכין PDF…' : 'הורדת דוח מותאם כPDF'}
      </Button>

      {status === 'success' && (
        <span className="text-xs text-emerald-700">הדוח הורד בהצלחה</span>
      )}

      {status === 'ios-ready' && (
        <span className="text-xs text-mist text-left max-w-[240px]" dir="rtl">
          הדוח נפתח בכרטיסייה חדשה. לשמירה, הקישו על כפתור השיתוף ובחרו "שמור ל-Files", או שתפו כרצונכם.
        </span>
      )}

      {status === 'blocked' && fallbackUrl && (
        <span className="text-xs text-mist max-w-[240px]" dir="rtl">
          {'הדוח מוכן לצפייה. '}
          <a href={fallbackUrl} target="_blank" rel="noreferrer" className="text-forest font-semibold underline">
            הקישו כאן לפתיחתו
          </a>
        </span>
      )}

      {status === 'error' && (
        <span className="text-xs text-red-600">לא הצלחנו להפיק את הדוח כרגע. נסו שוב בעוד רגע.</span>
      )}
    </div>
  )
}

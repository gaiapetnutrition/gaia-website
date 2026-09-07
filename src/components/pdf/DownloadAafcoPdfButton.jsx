import { useRef, useState } from 'react'
import { FileDown } from 'lucide-react'
import Button from '../ui/Button'
import { generateAafcoReportPdf, buildAafcoReportFilename } from '../../utils/pdf/aafcoReportPdf'

const DISCLAIMER_HE =
  'דוח זה הוא כלי עזר כללי לבדיקת האיזון התזונתי של מתכון ואינו מהווה תחליף לייעוץ וטרינרי פרטני, במיוחד במקרים של מחלה, טיפול תרופתי, היריון או הנקה, גורים, או צרכים תזונתיים רפואיים.'

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
 * Client-side PDF export button for the AAFCO recipe balance report.
 * Uses only the recipe/lifeStage/result state already computed and shown
 * on-screen by AafcoBalanceCheck.jsx — no new calculations, no server call.
 */
export default function DownloadAafcoPdfButton({ recipe, lifeStage, result, statusMeta }) {
  const [status, setStatus] = useState('idle') // idle | loading | success | ios-ready | blocked | error
  const [fallbackUrl, setFallbackUrl] = useState(null)
  const busyRef = useRef(false)

  if (!result) return null

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
      const recipeWithKcal = recipe.map(r => ({
        id: r.id,
        name: r.name,
        grams: Number(r.grams) || 0,
        itemKcal: Math.round((r.kcal ?? 0) * (Number(r.grams) || 0) / 100),
      }))
      const totalGrams = recipeWithKcal.reduce((s, r) => s + r.grams, 0)
      const rows = result.rows.map(row => ({ ...row, statusLabel: statusMeta[row.status]?.label ?? row.status }))
      const below = result.rows.filter(r => r.status === 'Below minimum').length
      const above = result.rows.filter(r => r.status === 'Above maximum').length
      const ok = result.rows.filter(r => r.status === 'OK').length

      const { blob } = await generateAafcoReportPdf({
        recipeWithKcal,
        totalGrams,
        totalKcal: result.totalKcal,
        lifeStage,
        rows,
        below,
        above,
        ok,
        disclaimer: DISCLAIMER_HE,
      })

      const filename = buildAafcoReportFilename()

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
      console.error('AAFCO PDF generation failed:', err)
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
        {status === 'loading' ? 'מכין PDF…' : 'הורדת הדוח כ-PDF'}
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

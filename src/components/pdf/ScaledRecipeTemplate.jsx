/*
 * Off-screen, print-specific templates for the scaled-recipe preparation/serving
 * PDF (html2canvas capture only). Fully independent from AafcoReportTemplate.jsx —
 * intentionally duplicated rather than shared, per the approved scope-safety
 * decision to leave the existing AAFCO PDF untouched.
 *
 * Renders only data already derived by computeScaledRecipe() — no calculation
 * happens here. Every row/section is wrapped with data-pdf-row so the
 * pagination logic in scaledRecipePdf.jsx can find safe page-break points.
 */

export const PDF_CONTENT_WIDTH_PX = 700

const cell = { padding: '5px 8px', fontSize: '11px', textAlign: 'right' }
const cellCenter = { ...cell, textAlign: 'center' }

export function ScaledRecipeHeader({ generatedDate }) {
  return (
    <div
      dir="rtl"
      style={{
        width: PDF_CONTENT_WIDTH_PX,
        background: '#ffffff',
        fontFamily: '"Secular One", Heebo, system-ui, sans-serif',
        color: '#2f2a22',
        padding: '4px 2px 8px',
        borderBottom: '2px solid #d8cfbe',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img src="/gaia-logo.png" alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }} />
        <div style={{ fontSize: '18px', fontWeight: 700 }}>כמויות הכנה והגשה לכלב</div>
      </div>
      <div style={{ fontSize: '11px', color: '#6b6255', textAlign: 'left' }} dir="ltr">
        <div>GAiA</div>
        <div dir="rtl">נוצר בתאריך: <span dir="ltr" style={{ unicodeBidi: 'isolate' }}>{generatedDate}</span></div>
      </div>
    </div>
  )
}

export function ScaledRecipeFooter({ pageNum, totalPages, year }) {
  return (
    <div
      dir="rtl"
      style={{
        width: PDF_CONTENT_WIDTH_PX,
        fontFamily: '"Secular One", Heebo, system-ui, sans-serif',
        color: '#8a8071',
        fontSize: '10px',
        padding: '8px 2px 2px',
        borderTop: '1px solid #e5ddcc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span>{`© ${year} GAiA. כל הזכויות שמורות.`}</span>
      <span dir="ltr">עמוד {pageNum} מתוך {totalPages}</span>
    </div>
  )
}

export function ScaledRecipeBody({
  targetDailyCalories,
  mealsPerDay,
  daysToPrepare,
  items,
  totalGramsToPrepare,
  showStorageNote,
  storageNote,
  guidanceNote,
  disclaimer,
}) {
  const dayWord = daysToPrepare === 1 ? 'יום' : 'ימים'

  return (
    <div
      dir="rtl"
      style={{
        width: PDF_CONTENT_WIDTH_PX,
        background: '#ffffff',
        fontFamily: '"Secular One", Heebo, system-ui, sans-serif',
        color: '#2f2a22',
      }}
    >
      {/* Summary line */}
      <div data-pdf-row="true" style={{ padding: '14px 2px 10px', fontSize: '13px', fontWeight: 700 }}>
        {'יעד יומי: '}{Math.round(targetDailyCalories).toLocaleString('he-IL')}{' קק"ל'}
        <span style={{ fontWeight: 400, color: '#6b6255', marginInlineStart: '14px', fontSize: '12px' }}>
          {'ארוחות ביום: '}{mealsPerDay}
        </span>
        <span style={{ fontWeight: 400, color: '#6b6255', marginInlineStart: '14px', fontSize: '12px' }}>
          {'ימים להכנה: '}{daysToPrepare}
        </span>
      </div>

      {showStorageNote && (
        <div data-pdf-row="true" style={{ padding: '0 2px 10px', fontSize: '10.5px', color: '#6b6255', lineHeight: 1.6 }}>
          {storageNote}
        </div>
      )}

      {/* Ingredient table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '4px' }}>
        <thead>
          <tr data-pdf-row="true" style={{ background: '#f4efe4' }}>
            <th style={{ ...cell, fontSize: '10.5px', color: '#6b6255' }}>רכיב</th>
            <th style={{ ...cellCenter, fontSize: '10.5px', color: '#6b6255' }}>כמות במתכון המקורי</th>
            <th style={{ ...cellCenter, fontSize: '10.5px', color: '#6b6255' }}>כמות יומית מותאמת</th>
            <th style={{ ...cellCenter, fontSize: '10.5px', color: '#6b6255' }}>כמות לכל ארוחה</th>
            <th style={{ ...cellCenter, fontSize: '10.5px', color: '#6b6255' }}>{`כמות להכנה ל־${daysToPrepare} ${dayWord}`}</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} data-pdf-row="true" style={{ borderBottom: '1px solid #ece5d6' }}>
              <td style={{ ...cell }} dir="ltr">{item.name}</td>
              <td style={{ ...cellCenter, color: '#6b6255' }}>{item.originalGrams.toLocaleString('he-IL')} ג׳</td>
              <td style={{ ...cellCenter }}>{Math.round(item.scaledDailyGrams).toLocaleString('he-IL')} ג׳</td>
              <td style={{ ...cellCenter }}>{Math.round(item.gramsPerMeal).toLocaleString('he-IL')} ג׳</td>
              <td style={{ ...cellCenter, fontWeight: 600 }}>{Math.round(item.gramsToPrepare).toLocaleString('he-IL')} ג׳</td>
            </tr>
          ))}
          <tr data-pdf-row="true" style={{ background: '#f4efe4', fontWeight: 700 }}>
            <td style={{ ...cell }} colSpan={4}>{`סה"כ להכנה ל־${daysToPrepare} ${dayWord}`}</td>
            <td style={{ ...cellCenter }}>{Math.round(totalGramsToPrepare).toLocaleString('he-IL')} ג׳</td>
          </tr>
        </tbody>
      </table>

      {/* Guidance */}
      <div data-pdf-row="true" style={{ marginTop: '12px', padding: '2px', fontSize: '10.5px', lineHeight: 1.6, color: '#6b6255' }}>
        {guidanceNote}
      </div>

      {/* Veterinary disclaimer */}
      <div data-pdf-row="true" style={{ marginTop: '12px', padding: '10px', background: '#fdf6e8', border: '1px solid #efe0b8', borderRadius: '10px', fontSize: '10.5px', lineHeight: 1.6, color: '#5b4c1f' }}>
        {disclaimer}
      </div>
    </div>
  )
}

import { NUTRIENT_LABELS } from '../../utils/aafcoLogic'

/*
 * Off-screen, print-specific templates used only for PDF capture (html2canvas).
 * These are intentionally separate from the on-screen ResultsTable — no
 * interactive elements (tooltips, expandable info, hover states), fixed
 * width matching the PDF content column, and every row/section wrapped so
 * the pagination logic in aafcoReportPdf.js can find safe page-break points
 * via the `data-pdf-row` attribute (never breaking a table row in half).
 */

export const PDF_CONTENT_WIDTH_PX = 700

const cell = { padding: '5px 8px', fontSize: '11px', textAlign: 'right' }
const cellCenter = { ...cell, textAlign: 'center' }

export function AafcoReportHeader({ lifeStage, generatedDate }) {
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
        <img src="/gaia-logo.webp" alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }} />
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>דוח איזון תזונתי למתכון</div>
          <div style={{ fontSize: '12px', color: '#6b6255', marginTop: '2px' }}>
            שלב חיים: {lifeStage === 'adult' ? 'בוגר (Adult)' : 'גידול / גור (Growth)'}
          </div>
        </div>
      </div>
      <div style={{ fontSize: '11px', color: '#6b6255', textAlign: 'left' }} dir="ltr">
        <div>GAiA</div>
        <div dir="rtl">נוצר בתאריך: <span dir="ltr" style={{ unicodeBidi: 'isolate' }}>{generatedDate}</span></div>
      </div>
    </div>
  )
}

export function AafcoReportFooter({ pageNum, totalPages }) {
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
      <span>© 2026 GAiA. כל הזכויות שמורות.</span>
      <span dir="ltr">עמוד {pageNum} מתוך {totalPages}</span>
    </div>
  )
}

export function AafcoReportBody({ recipeWithKcal, totalGrams, totalKcal, rows, below, above, ok, disclaimer }) {
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
      <div data-pdf-row="true" style={{ padding: '10px 2px 8px', fontSize: '13px', fontWeight: 700 }}>
        {'סה"כ קלוריות במתכון: '}{Math.round(totalKcal).toLocaleString('he-IL')}{' קק"ל'}
        <span style={{ fontWeight: 400, color: '#6b6255', marginInlineStart: '10px', fontSize: '11px' }}>
          {below > 0 && `${below} מתחת למינימום  `}
          {above > 0 && `${above} מעל המקסימום  `}
          {ok > 0 && `${ok} בטווח התקין`}
        </span>
      </div>

      {/* Ingredient table */}
      <div data-pdf-row="true" style={{ padding: '6px 2px 6px', fontSize: '13px', fontWeight: 700 }}>
        מרכיבי המתכון ({recipeWithKcal.length})
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '4px' }}>
        <thead>
          <tr data-pdf-row="true" style={{ background: '#f4efe4' }}>
            <th style={{ ...cell, fontSize: '10.5px', color: '#6b6255' }}>מרכיב</th>
            <th style={{ ...cellCenter, fontSize: '10.5px', color: '#6b6255' }}>גרם</th>
            <th style={{ ...cellCenter, fontSize: '10.5px', color: '#6b6255' }}>קק"ל</th>
          </tr>
        </thead>
        <tbody>
          {recipeWithKcal.map(item => (
            <tr key={item.id} data-pdf-row="true" style={{ borderBottom: '1px solid #ece5d6' }}>
              <td style={{ ...cell }} dir="ltr">{item.name}</td>
              <td style={{ ...cellCenter }}>{item.grams.toLocaleString('he-IL')}</td>
              <td style={{ ...cellCenter }}>{item.itemKcal.toLocaleString('he-IL')}</td>
            </tr>
          ))}
          <tr data-pdf-row="true" style={{ background: '#f4efe4', fontWeight: 700 }}>
            <td style={{ ...cell }}>סה"כ</td>
            <td style={{ ...cellCenter }}>{totalGrams.toLocaleString('he-IL')}</td>
            <td style={{ ...cellCenter }}>{Math.round(totalKcal).toLocaleString('he-IL')}</td>
          </tr>
        </tbody>
      </table>

      {/* Nutrient coverage table */}
      <div data-pdf-row="true" style={{ padding: '12px 2px 6px', fontSize: '13px', fontWeight: 700 }}>
        טבלת רכיבים תזונתיים לפי AAFCO
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr data-pdf-row="true" style={{ background: '#f4efe4' }}>
            <th style={{ ...cell, fontSize: '10px', color: '#6b6255' }}>רכיב תזונתי</th>
            <th style={{ ...cellCenter, fontSize: '10px', color: '#6b6255' }}>יחידה</th>
            <th style={{ ...cellCenter, fontSize: '10px', color: '#6b6255' }}>{'מתכון/1000 קק"ל'}</th>
            <th style={{ ...cellCenter, fontSize: '10px', color: '#6b6255' }}>מינימום</th>
            <th style={{ ...cellCenter, fontSize: '10px', color: '#6b6255' }}>מקסימום</th>
            <th style={{ ...cellCenter, fontSize: '10px', color: '#6b6255' }}>כיסוי</th>
            <th style={{ ...cell, fontSize: '10px', color: '#6b6255' }}>סטטוס</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.nutrient} data-pdf-row="true" style={{ borderBottom: '1px solid #ece5d6' }}>
              <td style={{ ...cell }}>{NUTRIENT_LABELS[row.nutrient] ?? row.nutrient}</td>
              <td style={{ ...cellCenter, color: '#6b6255' }}>{row.unit}</td>
              <td style={{ ...cellCenter }}>{row.per1000.toLocaleString('he-IL', { maximumFractionDigits: 2 })}</td>
              <td style={{ ...cellCenter, color: '#6b6255' }}>{row.aafcoMin}</td>
              <td style={{ ...cellCenter, color: '#6b6255' }}>{row.aafcoMax != null ? row.aafcoMax : '-'}</td>
              <td style={{ ...cellCenter }}>{row.coveragePct != null ? `${row.coveragePct.toLocaleString('he-IL')}%` : '-'}</td>
              <td style={{ ...cell, fontWeight: 600 }}>{row.statusLabel}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Disclaimer */}
      <div data-pdf-row="true" style={{ marginTop: '12px', padding: '10px', background: '#fdf6e8', border: '1px solid #efe0b8', borderRadius: '10px', fontSize: '10.5px', lineHeight: 1.6, color: '#5b4c1f' }}>
        {disclaimer}
      </div>
    </div>
  )
}

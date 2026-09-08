/*
 * Client-side PDF export for the scaled-recipe preparation/serving report.
 * Fully independent from src/utils/pdf/aafcoReportPdf.jsx — the capture,
 * pagination, and font-readiness helpers below are intentionally duplicated
 * (not shared) per the approved scope-safety decision: this file must never
 * need to change the existing AAFCO PDF, and vice versa.
 *
 * Uses only the existing derived `scaled` result from computeScaledRecipe()
 * — no calculation happens here. Renders an off-screen, print-specific
 * template and rasterizes it with html2canvas so Hebrew/RTL text renders
 * exactly as the browser already lays it out on-screen.
 */
import { createRoot } from 'react-dom/client'
import { PDF_CONTENT_WIDTH_PX, ScaledRecipeHeader, ScaledRecipeFooter, ScaledRecipeBody } from '../../components/pdf/ScaledRecipeTemplate'

const PAGE_WIDTH_MM = 210
const PAGE_HEIGHT_MM = 297
const MARGIN_MM = 12
const GAP_MM = 4
const CONTENT_WIDTH_MM = PAGE_WIDTH_MM - MARGIN_MM * 2
const CAPTURE_SCALE = 2
const JPEG_QUALITY = 0.92

async function waitForFontsReady() {
  if (!document.fonts) return
  try {
    await document.fonts.ready
    const families = ['16px "Secular One"', '16px "Heebo"']
    await Promise.race([
      Promise.all(families.map(f => document.fonts.load(f).catch(() => {}))),
      new Promise(resolve => setTimeout(resolve, 3000)),
    ])
  } catch {
    // Best-effort guard only — proceed with whatever html2canvas can capture.
  }
}

function createOffscreenHost() {
  const host = document.createElement('div')
  host.style.position = 'fixed'
  host.style.left = '-9999px'
  host.style.top = '0'
  host.style.zIndex = '-1'
  host.style.pointerEvents = 'none'
  document.body.appendChild(host)
  return host
}

async function captureNode(html2canvas, node) {
  return html2canvas(node, {
    scale: CAPTURE_SCALE,
    backgroundColor: '#ffffff',
    useCORS: true,
  })
}

function sliceCanvas(sourceCanvas, yStartPx, heightPx) {
  const out = document.createElement('canvas')
  out.width = sourceCanvas.width
  out.height = heightPx
  const ctx = out.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, out.width, out.height)
  ctx.drawImage(sourceCanvas, 0, yStartPx, sourceCanvas.width, heightPx, 0, 0, out.width, heightPx)
  return out.toDataURL('image/jpeg', JPEG_QUALITY)
}

function computePageSlices(rowRects, canvasHeightPx, pageBodyHeightPx) {
  if (rowRects.length === 0) return [{ yStart: 0, height: Math.min(canvasHeightPx, pageBodyHeightPx) }]

  const slices = []
  let pageStart = 0

  for (let i = 0; i < rowRects.length; i++) {
    const row = rowRects[i]
    const usedSoFar = row.bottom - pageStart
    if (usedSoFar > pageBodyHeightPx && row.top > pageStart) {
      slices.push({ yStart: pageStart, height: row.top - pageStart })
      pageStart = row.top
    }
  }
  slices.push({ yStart: pageStart, height: canvasHeightPx - pageStart })
  return slices.filter(s => s.height > 0)
}

export async function generateScaledRecipePdf({ targetDailyCalories, mealsPerDay, daysToPrepare, items, showStorageNote, storageNote, guidanceNote, disclaimer }) {
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
  ])

  await waitForFontsReady()

  const now = new Date()
  const generatedDate = [
    String(now.getDate()).padStart(2, '0'),
    String(now.getMonth() + 1).padStart(2, '0'),
    now.getFullYear(),
  ].join('.')
  const year = now.getFullYear()

  const totalGramsToPrepare = items.reduce((sum, item) => sum + item.gramsToPrepare, 0)

  const host = createOffscreenHost()
  const headerHost = document.createElement('div')
  const bodyHost = document.createElement('div')
  const footerHost = document.createElement('div')
  host.append(headerHost, bodyHost, footerHost)

  const headerRoot = createRoot(headerHost)
  const bodyRoot = createRoot(bodyHost)
  const footerRoot = createRoot(footerHost)

  try {
    headerRoot.render(<ScaledRecipeHeader generatedDate={generatedDate} />)
    bodyRoot.render(
      <ScaledRecipeBody
        targetDailyCalories={targetDailyCalories}
        mealsPerDay={mealsPerDay}
        daysToPrepare={daysToPrepare}
        items={items}
        totalGramsToPrepare={totalGramsToPrepare}
        showStorageNote={showStorageNote}
        storageNote={storageNote}
        guidanceNote={guidanceNote}
        disclaimer={disclaimer}
      />
    )
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    await waitForFontsReady()

    const bodyNode = bodyHost.firstElementChild
    const bodyRect = bodyNode.getBoundingClientRect()
    const rowEls = Array.from(bodyNode.querySelectorAll('[data-pdf-row]'))
    const rowRectsCss = rowEls.map(el => {
      const r = el.getBoundingClientRect()
      return { top: r.top - bodyRect.top, bottom: r.bottom - bodyRect.top }
    })

    const [headerCanvas, bodyCanvas] = await Promise.all([
      captureNode(html2canvas, headerHost.firstElementChild),
      captureNode(html2canvas, bodyNode),
    ])

    const mmPerCanvasPx = CONTENT_WIDTH_MM / bodyCanvas.width
    const headerHeightMM = (headerCanvas.height / headerCanvas.width) * CONTENT_WIDTH_MM
    const footerHeightMM = 10
    const pageBodyHeightMM = PAGE_HEIGHT_MM - MARGIN_MM * 2 - headerHeightMM - footerHeightMM - GAP_MM * 2
    const pageBodyHeightPx = pageBodyHeightMM / mmPerCanvasPx

    const rowRectsPx = rowRectsCss.map(r => ({ top: r.top * CAPTURE_SCALE, bottom: r.bottom * CAPTURE_SCALE }))
    const slices = computePageSlices(rowRectsPx, bodyCanvas.height, pageBodyHeightPx)
    const totalPages = slices.length

    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })

    for (let i = 0; i < slices.length; i++) {
      if (i > 0) pdf.addPage()

      pdf.addImage(headerCanvas.toDataURL('image/jpeg', JPEG_QUALITY), 'JPEG', MARGIN_MM, MARGIN_MM, CONTENT_WIDTH_MM, headerHeightMM)

      const slice = slices[i]
      const sliceHeightMM = slice.height * mmPerCanvasPx
      const sliceDataUrl = sliceCanvas(bodyCanvas, slice.yStart, slice.height)
      pdf.addImage(sliceDataUrl, 'JPEG', MARGIN_MM, MARGIN_MM + headerHeightMM + GAP_MM, CONTENT_WIDTH_MM, sliceHeightMM)

      footerRoot.render(<ScaledRecipeFooter pageNum={i + 1} totalPages={totalPages} year={year} />)
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      const footerCanvas = await captureNode(html2canvas, footerHost.firstElementChild)
      const actualFooterHeightMM = (footerCanvas.height / footerCanvas.width) * CONTENT_WIDTH_MM
      pdf.addImage(
        footerCanvas.toDataURL('image/jpeg', JPEG_QUALITY),
        'JPEG',
        MARGIN_MM,
        PAGE_HEIGHT_MM - MARGIN_MM - actualFooterHeightMM,
        CONTENT_WIDTH_MM,
        actualFooterHeightMM
      )
    }

    const blob = pdf.output('blob')
    return { blob }
  } finally {
    headerRoot.unmount()
    bodyRoot.unmount()
    footerRoot.unmount()
    host.remove()
  }
}

export function buildScaledRecipeFilename() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const ss = String(now.getSeconds()).padStart(2, '0')
  return `gaia-scaled-recipe-${y}-${m}-${d}-${hh}${mm}${ss}.pdf`
}

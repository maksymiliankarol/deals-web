import type { jsPDF } from 'jspdf'
import { buildDealRecord } from './deal-record'
import type { Lang } from './locale'
import type { Messages } from '../locales/en'
import type { UnlockedDetails } from '../types'
import { PDF_FONT, registerPdfFonts } from './pdf-font'

const MARGIN = 20
const TEXT_WIDTH = 210 - MARGIN * 2 // A4 is 210mm wide

// What the bundled font can draw: Latin, Latin Extended-A/B, common punctuation, €, ™.
// Keep in sync with the subset ranges in the font step. Cyrillic, CJK and emoji
// would come out as empty boxes.
const SUPPORTED =
  /^[\n\r\t\u0020-\u007E\u00A0-\u024F\u2010-\u2027\u2030-\u205E\u20AC\u2122]*$/u

export const canRenderInPdf = (text: string) => SUPPORTED.test(text)

// jsPDF only wraps at spaces, so break any single word wider than the page.
function breakWideWords(doc: jsPDF, text: string, maxWidth: number) {
  return text.replace(/\S+/gu, (word) => {
    if (doc.getTextWidth(word) <= maxWidth) return word

    let out = ''
    let line = ''
    for (const ch of word) {
      if (doc.getTextWidth(line + ch) > maxWidth) {
        out += line + '\n'
        line = ch
      } else {
        line += ch
      }
    }
    return out + line
  })
}

export async function downloadDealPdf(details: UnlockedDetails, t: Messages, lang: Lang) {
  // Loaded only when the button is pressed.
  const { jsPDF } = await import('jspdf')

  const record = buildDealRecord(details, t, lang)
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  await registerPdfFonts(doc)

  let y = MARGIN + 6

  doc.setFont(PDF_FONT, 'bold')
  doc.setFontSize(20)
  doc.text(record.title, MARGIN, y)
  y += 14

  for (const field of record.fields) {
    doc.setFont(PDF_FONT, 'bold')
    doc.setFontSize(10)
    doc.text(field.label, MARGIN, y)
    y += 5

    // Set the body font before measuring: wrapping uses the current font.
    doc.setFont(PDF_FONT, 'normal')
    doc.setFontSize(12)
    const text = field.freeText
      ? breakWideWords(doc, field.value, TEXT_WIDTH)
      : field.value
    const lines = doc.splitTextToSize(text, TEXT_WIDTH)

    doc.text(lines, MARGIN, y)
    y += doc.getTextDimensions(lines).h + 6
  }

  doc.setFontSize(9)
  doc.text(doc.splitTextToSize(record.note, TEXT_WIDTH), MARGIN, y + 4)

  doc.save(`${record.fileBase}.pdf`)
}
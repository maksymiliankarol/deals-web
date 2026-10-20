import type { jsPDF } from 'jspdf'
import { buildDealRecord } from './deal-record'
import type { UnlockedDetails } from '../types'

const FONT = 'helvetica'
const MARGIN = 20
const TEXT_WIDTH = 210 - MARGIN * 2 // A4 is 210mm wide

// What jsPDF's built-in fonts can draw (the WinAnsi set): Latin-1 plus a few
// common typographic characters. Anything else would come out as garbage.
const SUPPORTED =
  /^[\n\r\t\u0020-\u007E\u00A0-\u00FF\u0152\u0153\u0160\u0161\u0178\u017D\u017E\u0192\u02C6\u02DC\u2013\u2014\u2018-\u201A\u201C-\u201E\u2020-\u2022\u2026\u2030\u2039\u203A\u20AC\u2122]*$/u

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

export async function downloadDealPdf(details: UnlockedDetails) {
  // Loaded only when the button is pressed.
  const { jsPDF } = await import('jspdf')

  const record = buildDealRecord(details)
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })

  let y = MARGIN + 6

  doc.setFont(FONT, 'bold')
  doc.setFontSize(20)
  doc.text(record.title, MARGIN, y)
  y += 14

  for (const field of record.fields) {
    doc.setFont(FONT, 'bold')
    doc.setFontSize(10)
    doc.text(field.label, MARGIN, y)
    y += 5

    // Set the body font before measuring: wrapping uses the current font.
    doc.setFont(FONT, 'normal')
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
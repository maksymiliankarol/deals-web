import type { jsPDF } from 'jspdf'
import regularUrl from '../assets/fonts/NotoSans-Regular.ttf?url'
import boldUrl from '../assets/fonts/NotoSans-Bold.ttf?url'

export const PDF_FONT = 'NotoSans'

type Fonts = { regular: string; bold: string }

// Fetched once, on the first PDF. The files are separate assets, not part of the JS bundle.
let fonts: Promise<Fonts> | null = null

// btoa(String.fromCharCode(...bytes)) overflows the stack on big files, so go in chunks
function toBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer)
  const CHUNK = 0x8000
  let binary = ''
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK))
  }
  return btoa(binary)
}

async function fetchBase64(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Font request failed: ${res.status}`)
  return toBase64(await res.arrayBuffer())
}

function loadFonts(): Promise<Fonts> {
  fonts ??= Promise.all([fetchBase64(regularUrl), fetchBase64(boldUrl)])
    .then(([regular, bold]) => ({ regular, bold }))
    .catch((err) => {
      fonts = null // allow a retry on the next click
      throw err
    })
  return fonts
}

// jsPDF keeps fonts per document, so every new doc needs them registered
export async function registerPdfFonts(doc: jsPDF) {
  const { regular, bold } = await loadFonts()
  doc.addFileToVFS('NotoSans-Regular.ttf', regular)
  doc.addFont('NotoSans-Regular.ttf', PDF_FONT, 'normal')
  doc.addFileToVFS('NotoSans-Bold.ttf', bold)
  doc.addFont('NotoSans-Bold.ttf', PDF_FONT, 'bold')
}
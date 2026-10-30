import type { Lang } from './locale'

// one formatter per language, created on first use
type DateStyle = 'medium' | 'long'
const dates = new Map<string, Intl.DateTimeFormat>()
const usd = new Map<Lang, Intl.NumberFormat>()
const usdWhole = new Map<Lang, Intl.NumberFormat>()

// value: a Date, a timestamp, or an ISO string (not a raw D1 string, see parseDbDate)
export function formatDate(value: Date | string | number, lang: Lang, style: DateStyle = 'medium') {
  const key = `${lang}:${style}`
  let f = dates.get(key)
  if (!f) {
    f = new Intl.DateTimeFormat(lang, { dateStyle: style })
    dates.set(key, f)
  }
  return f.format(new Date(value))
}

export function formatUsd(cents: number, lang: Lang) {
  let f = usd.get(lang)
  if (!f) {
    f = new Intl.NumberFormat(lang, { style: 'currency', currency: 'USD' })
    usd.set(lang, f)
  }
  return f.format(cents / 100)
}

// D1 stores 'YYYY-MM-DD HH:MM:SS' in UTC with no zone marker. Safari can't
// parse that as-is, so make it a proper ISO string first.
export const parseDbDate = (value: string) => new Date(value.replace(' ', 'T') + 'Z')

// Whole dollars, for budget ranges ($5,000, not $5,000.00)
export function formatUsdWhole(dollars: number, lang: Lang) {
  let f = usdWhole.get(lang)
  if (!f) {
    f = new Intl.NumberFormat(lang, {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
      // Polish skips grouping for 4-digit numbers by default ("5000" next to "25 000")
      useGrouping: 'always',
    })
    usdWhole.set(lang, f)
  }
  return f.format(dollars)
}
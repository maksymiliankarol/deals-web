import type { UnlockedDetails } from '../types'
import type { Messages } from '../locales/en'
import type { Lang } from './locale'
import { formatDate, formatUsd } from './format'
import { budgetLabel } from '../utils/pricing'

export type DealField = {
  label: string
  value: string
  // User-written text that can contain very long words.
  freeText?: boolean
}

export function buildDealRecord(details: UnlockedDetails, t: Messages, lang: Lang) {
  const r = t.dealRecord

  return {
    title: r.title,
    fileBase: `${r.fileBase}-${details.purchased_at.slice(0, 10)}`,
    fields: [
      { label: r.date, value: formatDate(details.purchased_at, lang, 'long') },
      { label: r.description, value: details.description, freeText: true },
      {
        label: r.budget,
        value: budgetLabel(t, lang, details.tier) ?? t.buyCard.budgetUnspecified,
      },
      { label: r.pricePaid, value: formatUsd(details.price_cents, lang) },
      { label: t.common.email, value: details.email },
      { label: t.common.phone, value: details.phone },
    ] satisfies DealField[],
    note: r.note,
  }
}
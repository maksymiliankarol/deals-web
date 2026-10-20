import type { UnlockedDetails } from "../types"
import { formatUsd } from "../utils/format"

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'long' })

export type DealField = {
  label: string
  value: string
  // User-written text that can contain very long words.
  freeText?: boolean
}

export function buildDealRecord(details: UnlockedDetails) {
  return {
    title: 'Unlocked deal',
    fileBase: `unlocked-deal-${details.purchased_at.slice(0, 10)}`,
    fields: [
      { label: 'Date', value: dateFormat.format(new Date(details.purchased_at)) },
      { label: 'Description', value: details.description, freeText: true },
      { label: 'Tier', value: String(details.tier) },
      { label: 'Price paid', value: formatUsd(details.price_cents) },
      { label: 'Email', value: details.email },
      { label: 'Phone', value: details.phone }
    ] satisfies DealField[],
    note: 'A record of the contact details you unlocked. This is not a tax invoice.'
  }
}
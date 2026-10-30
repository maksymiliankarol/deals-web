import { formatUsdWhole } from '../lib/format'
import type { Lang } from '../lib/locale'
import type { Messages } from '../locales/en'

// Tier ids must match the server (deals-api: schemas.ts and lib/pricing.ts)
export const TIERS = [0, 1, 2, 3] as const

// Upper bound of each tier in USD, except the last (open-ended)
const BOUNDS = [5_000, 25_000, 100_000]

// null for a tier we don't know, so the caller picks the fallback text
export function budgetLabel(t: Messages, lang: Lang, tier: number): string | null {
  const money = (dollars: number) => formatUsdWhole(dollars, lang)

  if (tier === 0) return t.budget.under(money(BOUNDS[0]))
  if (tier === BOUNDS.length) return t.budget.over(money(BOUNDS[BOUNDS.length - 1]))

  const from = BOUNDS[tier - 1]
  const to = BOUNDS[tier]
  if (from === undefined || to === undefined) return null
  return t.budget.range(money(from), money(to))
}
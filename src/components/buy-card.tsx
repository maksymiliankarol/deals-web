import { useState } from "react"
import { formatDate, formatUsd, parseDbDate } from "../lib/format"
import { useI18n } from "../lib/i18n-context"
import { truncate } from "../utils/truncate"
import { budgetLabel } from "../utils/pricing"
import type { BuyMatch } from "../types"

const PREVIEW_LENGTH = 200

interface BuyCardProps {
  match: BuyMatch
  onClick: () => void
}

const BuyCard = ({ match, onClick }: BuyCardProps) => {
  const { t, lang } = useI18n()
  const [expanded, setExpanded] = useState(false)

  const isLong = match.description.length > PREVIEW_LENGTH
  const text =
    expanded || !isLong
      ? match.description
      : truncate(match.description, PREVIEW_LENGTH)

  const budget = budgetLabel(t, lang, match.tier) ?? t.buyCard.budgetUnspecified
  const score = match.score.toLocaleString(lang, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return (
    <div className="flex flex-col gap-2 border-2 bg-white p-4">
      <div>
        <p className="whitespace-pre-wrap">{text}</p>
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="mt-1 cursor-pointer font-bold underline"
          >
            {expanded ? t.common.showLess : t.common.readMore}
          </button>
        )}
      </div>
      <p>
        {t.buyCard.budget(budget)} ·{" "}
        {t.buyCard.created(formatDate(parseDbDate(match.created_at), lang))}
      </p>
      <p>{t.buyCard.score(score)}</p>
      <button
        onClick={onClick}
        type="button"
        className="px-4 py-2 border-2 border-black bg-green text-white cursor-pointer hover:brightness-75"
      >
        {t.buyCard.unlock(formatUsd(match.price_cents, lang))}
      </button>
    </div>
  )
}

export default BuyCard
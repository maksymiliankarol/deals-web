import { useState } from "react"
import Dialog from "./dialog"
import { truncate } from "../utils/truncate"
import { formatDate, formatUsd } from "../lib/format"
import { useI18n } from "../lib/i18n-context"
import { downloadDealPdf } from "../lib/deal-pdf"
import { deleteUnlocked } from "../lib/unlocked-storage"
import type { SavedUnlock } from "../lib/unlocked-storage"

const PREVIEW_LENGTH = 200

interface UnlockedCardProps {
  unlocked: SavedUnlock
  onDeleted: (sessionId: string) => void
}

const UnlockedCard = ({ unlocked, onDeleted }: UnlockedCardProps) => {
  const { t, lang } = useI18n()
  const [expanded, setExpanded] = useState(false)
  const [pending, setPending] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Single source of truth for the description text
  const description = unlocked.description
  const isLong = description.length > PREVIEW_LENGTH

  const text =
    expanded || !isLong ? description : truncate(description, PREVIEW_LENGTH)

  async function handleDownload() {
    setPending(true)
    setError(null)

    try {
      await downloadDealPdf(unlocked, t, lang)
    } catch (err) {
      console.error(err)
      setError(t.pdf.failed)
    } finally {
      setPending(false)
    }
  }

  function handleDelete() {
    try {
      deleteUnlocked(unlocked.sessionId)
      onDeleted(unlocked.sessionId)
    } catch (err) {
      console.error(err)
      setConfirmOpen(false)
      setError(t.unlockedCard.deleteFailed)
    }
  }

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
        {t.unlockedCard.unlockedOn(
          formatDate(unlocked.purchased_at, lang),
          formatUsd(unlocked.price_cents, lang),
        )}
      </p>
      <p>
        {t.common.email}:{" "}
        <a href={`mailto:${unlocked.email}`} className="underline">
          {unlocked.email}
        </a>
      </p>
      <p>
        {t.common.phone}:{" "}
        <a href={`tel:${unlocked.phone}`} className="underline">
          {unlocked.phone}
        </a>
      </p>
      <div className="flex items-center justify-between gap-4 mt-4">
        <button
          type="button"
          onClick={handleDownload}
          disabled={pending}
          className="px-4 py-2 border-2 border-black bg-green text-white cursor-pointer hover:brightness-75 disabled:opacity-50"
        >
          {pending ? t.pdf.creating : t.pdf.download}
        </button>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          disabled={pending}
          className="px-4 py-2 border-2 border-black bg-red text-white cursor-pointer hover:brightness-75 disabled:opacity-50"
        >
          {t.common.delete}
        </button>
      </div>
      {error && <p role="alert" className="text-error">{error}</p>}

      <Dialog
        open={confirmOpen}
        title={t.unlockedCard.deleteTitle}
        confirmLabel={t.common.delete}
        variant="danger"
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
      >
        <p>{t.unlockedCard.deleteBody}</p>
      </Dialog>
    </div>
  )
}

export default UnlockedCard
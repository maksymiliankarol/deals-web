import { useState } from "react"
import Dialog from "../components/dialog"
import { truncate } from "../utils/truncate"
import { dateFormat, formatUsd } from "../utils/format"
import { downloadDealPdf } from "../lib/deal-pdf"
import { deleteUnlocked } from "../lib/unlocked-storage"
import type { SavedUnlock } from "../lib/unlocked-storage"

const PREVIEW_LENGTH = 200

interface UnlockedCardProps {
  unlocked: SavedUnlock
  onDeleted: (sessionId: string) => void
}

const UnlockedCard = ({ unlocked, onDeleted }: UnlockedCardProps) => {
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
      await downloadDealPdf(unlocked)
    } catch (err) {
      console.error(err)
      setError("Could not create the PDF. Please try again.")
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
      setError("Could not delete this item in this browser.")
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
            {expanded ? "Show less" : "Read more..."}
          </button>
        )}
      </div>
      <p>
        Unlocked: {dateFormat.format(new Date(unlocked.purchased_at))} for{" "}
        {formatUsd(unlocked.price_cents)}
      </p>
      <p>
        Email:{" "}
        <a href={`mailto:${unlocked.email}`} className="underline">
          {unlocked.email}
        </a>
      </p>
      <p>
        Phone:{" "}
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
          {pending ? "Creating PDF…" : "Download PDF"}
        </button>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          disabled={pending}
          className="px-4 py-2 border-2 border-black bg-red text-white cursor-pointer hover:brightness-75 disabled:opacity-50"
        >
          Delete
        </button>
      </div>
      {error && <p role="alert" className="text-error">{error}</p>}

      <Dialog
        open={confirmOpen}
        title="Delete this unlocked listing?"
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
      >
        <p>
          This removes it from this device. If you haven't saved the PDF or the
          contact details elsewhere, you may not be able to get them back.
        </p>
      </Dialog>
    </div>
  )
}

export default UnlockedCard
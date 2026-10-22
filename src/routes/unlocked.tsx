import { useState } from "react"
import { Link } from "react-router"
import { ChildLayout } from "../layouts/child-layout"
import Dialog from "../components/dialog"
import UnlockedCard from "../components/unlocked-card"
import { RETENTION_DAYS, clearUnlocked, pruneUnlocked } from "../lib/unlocked-storage"

export function Unlocked() {
  // Read once on mount; the route remounts on every visit. This also removes
  // broken and expired entries from storage.
  const [listings, setListings] = useState(pruneUnlocked)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleDeleted(sessionId: string) {
    setListings((prev) => prev.filter((l) => l.sessionId !== sessionId))
  }

  function handleClearAll() {
    try {
      clearUnlocked()
      setListings([])
    } catch (err) {
      console.error(err)
      setError("Could not delete the items in this browser.")
    }
    setConfirmOpen(false)
  }

  return (
    <ChildLayout>
      {listings.length === 0 ? (
        <div className="flex flex-col gap-4">
          <p>You haven't unlocked any listings yet.</p>
          <Link
            to="/my-listings"
            className="px-4 py-2 bg-blue w-fit text-white border-2 border-black hover:brightness-75"
          >
            Unlock your first listing
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="border-2 border-black bg-red p-4 text-white">
            <p>
              <strong>Important:</strong> Items below are stored in your browser and
              removed after {RETENTION_DAYS} days. Make sure you've downloaded the PDF
              or saved the contact details for each one another way.
            </p>
          </div>
          {listings.map((listing) => (
            <UnlockedCard
              key={listing.sessionId}
              unlocked={listing}
              onDeleted={handleDeleted}
            />
          ))}
          <button
            type="button"
            onClick={() => {
              setError(null)
              setConfirmOpen(true)
            }}
            className="self-start bg-red text-white px-4 py-2 border-2 border-black cursor-pointer hover:brightness-75"
          >
            Delete all
          </button>
          {error && <p role="alert" className="text-error">{error}</p>}

          <Dialog
            open={confirmOpen}
            title="Delete all unlocked listings?"
            confirmLabel="Delete all"
            variant="danger"
            onConfirm={handleClearAll}
            onClose={() => setConfirmOpen(false)}
          >
            <p>
              This removes all {listings.length} items from this device. If you haven't
              saved the PDFs or the contact details elsewhere, you may not be able to
              get them back.
            </p>
          </Dialog>
        </div>
      )}
    </ChildLayout>
  )
}
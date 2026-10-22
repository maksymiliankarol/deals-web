import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { deleteSellListing, getSellListing } from "../lib/sell-storage"
import { ApiError, searchBuys, startUnlock } from "../lib/api"
import { formatUsd } from "../utils/format"
import type { BuyMatch } from "../types"
import { ChildLayout } from "../layouts/child-layout"
import Dialog from "../components/dialog"
import BuyCard from "../components/buy-card"
import Turnstile from "../components/turnstile"

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" })

export function MyListing() {
  const { id } = useParams()
  const navigate = useNavigate()
  const listing = useMemo(() => (id ? getSellListing(id) : undefined), [id])

  const [matches, setMatches] = useState<BuyMatch[] | null>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const [unlockTarget, setUnlockTarget] = useState<BuyMatch | null>(null)
  const [unlockPending, setUnlockPending] = useState(false)
  const [unlockError, setUnlockError] = useState<string | null>(null)
  const [unlockToken, setUnlockToken] = useState<string | null>(null)
  const [unlockResetKey, setUnlockResetKey] = useState(0)

  // Coming back from Stripe with the Back button can restore this page from the
  // browser cache with "pending" still on, so reset it.
  useEffect(() => {
    const reset = (e: PageTransitionEvent) => {
      if (!e.persisted) return
      setUnlockPending(false)
      setUnlockTarget(null)
    }
    window.addEventListener("pageshow", reset)
    return () => window.removeEventListener("pageshow", reset)
  }, [])
  
  
  async function handleSearch() {
    if (!listing) return

    setPending(true)
    setError(null)

    try {
      const result = await searchBuys(listing.description)
      setMatches(result.matches)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setPending(false)
    }
  }

  async function handleUnlock() {
    if (!listing || !unlockTarget || !unlockToken) return

    setUnlockPending(true)
    setUnlockError(null)

    try {
    const { url } = await startUnlock(unlockTarget.id, listing.id, unlockToken)
      // Leave "pending" on: the browser is about to leave for Stripe.
      window.location.assign(url)
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        // Taken by someone else, or a checkout for it is already open.
        const takenId = unlockTarget.id
        setMatches((prev) => prev?.filter((m) => m.id !== takenId) ?? null)
        setUnlockTarget(null)
        setError("That demand is no longer available.")
      } else {
        setUnlockError(
          err instanceof ApiError ? err.message : "Could not start checkout. Please try again."
        )
      }
      setUnlockPending(false)
      setUnlockTarget(null)
      setUnlockResetKey((k) => k + 1)
    }
  }

  function handleDelete() {
    if (!listing) return

    try {
      deleteSellListing(listing.id)
      // replace: Back shouldn't return to a page for a listing that's gone.
      navigate("/my-listings", { replace: true })
    } catch {
      setConfirmOpen(false)
      setDeleteError("Could not delete the listing in this browser")
    }
  }
  
  return (
    <ChildLayout size="xl">
      {!listing ? (
        <p>
          This listing wasn't found in your browser storage. It may have been cleared.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <p>{listing.description}</p>
            <p>Created: {dateFormat.format(new Date(listing.createdAt))}</p>

            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              disabled={pending}
              className="bg-red text-white px-4 py-2 border-2 border-black cursor-pointer hover:brightness-75 disabled:opacity-50"
            >
              Delete this listing
            </button>
            {deleteError && <p role="alert" className="text-error">{deleteError}</p>}

            <Dialog
              open={confirmOpen}
              title="Delete this listing?"
              confirmLabel="Delete"
              variant="danger"
              onConfirm={handleDelete}
              onClose={() => setConfirmOpen(false)}
            >
              <p>This can't be undone.</p>
            </Dialog>
          </div>

          <div className="flex flex-col gap-4">
            {!matches && (
              <button
                type="button"
                onClick={handleSearch}
                disabled={pending}
                className="bg-green text-white px-4 py-2 border-2 border-black cursor-pointer hover:brightness-75 disabled:opacity-50"
              >
                {pending ? "Searching…" : "Find Matching Demand"}
              </button>
            )}

            {error && <p role="alert" className="text-error">{error}</p>}

            {matches === null && !error && (
              <p>Press the button to look for demand that matches this listing.</p>
            )}

            {matches?.length === 0 && <p>No matching demand found.</p>}

            {matches?.map((match) => (
              <BuyCard 
                key={match.id} 
                match={match} 
                onClick={() => {
                  setUnlockError(null)
                  setUnlockTarget(match)
                }}
              />
            ))}

            <Dialog
              open={unlockTarget !== null}
              title="Unlock contact details?"
              confirmLabel={
                unlockTarget ? `Pay ${formatUsd(unlockTarget.price_cents)}` : "Pay"
              }
              confirmDisabled={!unlockToken}
              pending={unlockPending}
              onConfirm={handleUnlock}
              onClose={() => setUnlockTarget(null)}
            >
              <p>
                You'll pay on Stripe's secure page and get this buyer's email and
                phone. Nobody else will be able to unlock this demand.
              </p>
              {unlockTarget && <Turnstile onToken={setUnlockToken} resetKey={unlockResetKey} />}
              {unlockError && <p role="alert" className="text-error">{unlockError}</p>}

            </Dialog>
          </div>
        </div>
      )}
    </ChildLayout>
  )
}
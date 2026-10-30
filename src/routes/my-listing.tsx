import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { deleteSellListing, getSellListing } from "../lib/sell-storage"
import { ApiError, searchBuys, startUnlock } from "../lib/api"
import { describeError } from "../lib/errors"
import { formatDate, formatUsd } from "../lib/format"
import { useI18n } from "../lib/i18n-context"
import type { BuyMatch } from "../types"
import { ChildLayout } from "../layouts/child-layout"
import Dialog from "../components/dialog"
import BuyCard from "../components/buy-card"
import Turnstile from "../components/turnstile"

export function MyListing() {
  const { t, lang } = useI18n()
  const { id } = useParams()
  const navigate = useNavigate()
  const listing = useMemo(() => (id ? getSellListing(id) : undefined), [id])

  const [matches, setMatches] = useState<BuyMatch[] | null>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [searchToken, setSearchToken] = useState<string | null>(null)
  const [searchResetKey, setSearchResetKey] = useState(0)

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
    if (!listing || !searchToken) return

    setPending(true)
    setError(null)

    try {
      const result = await searchBuys(listing.description, searchToken)
      setMatches(result.matches)
    } catch (err) {
      setError(describeError(t, err))
    } finally {
      setPending(false)
      // A token works once, whatever the outcome
      setSearchToken(null)
      setSearchResetKey((k) => k + 1)
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
        setError(describeError(t, err))
      } else {
        setUnlockError(describeError(t, err, t.errors.checkout_failed))
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
      setDeleteError(t.myListing.deleteFailed)
    }
  }

  return (
    <ChildLayout size="xl">
      {!listing ? (
        <p>{t.myListing.notFound}</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <p>{listing.description}</p>
            <p>{t.myListing.created(formatDate(listing.createdAt, lang))}</p>

            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              disabled={pending}
              className="bg-red text-white px-4 py-2 border-2 border-black cursor-pointer hover:brightness-75 disabled:opacity-50"
            >
              {t.myListing.delete}
            </button>
            {deleteError && <p role="alert" className="text-error">{deleteError}</p>}

            <Dialog
              open={confirmOpen}
              title={t.myListing.deleteTitle}
              confirmLabel={t.common.delete}
              variant="danger"
              onConfirm={handleDelete}
              onClose={() => setConfirmOpen(false)}
            >
              <p>{t.myListing.deleteBody}</p>
            </Dialog>
          </div>

          <div className="flex flex-col gap-4">
            {!matches && (
              <>
                <div className="fixed right-4 bottom-4 z-50">
                  <Turnstile onToken={setSearchToken} resetKey={searchResetKey} />
                </div>
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={pending || !searchToken}
                  className="bg-green text-white px-4 py-2 border-2 border-black cursor-pointer hover:brightness-75 disabled:opacity-50"
                >
                  {pending
                    ? t.myListing.searching
                    : !searchToken
                      ? t.common.verifying
                      : t.myListing.findMatches}
                </button>
              </>
            )}

            {error && <p role="alert" className="text-error">{error}</p>}

            {matches === null && !error && <p>{t.myListing.hint}</p>}

            {matches?.length === 0 && <p>{t.myListing.noMatches}</p>}

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
              title={t.myListing.unlockTitle}
              confirmLabel={
                unlockTarget
                  ? unlockToken
                    ? t.myListing.pay(formatUsd(unlockTarget.price_cents, lang))
                    : t.common.verifying
                  : t.myListing.payFallback
              }
              confirmDisabled={!unlockToken}
              pending={unlockPending}
              onConfirm={handleUnlock}
              onClose={() => setUnlockTarget(null)}
            >
              <p>{t.myListing.unlockIntro}</p>
              <p>
                {t.myListing.termsBefore}
                <Link to="/terms-of-service" className="underline hover:decoration-2">
                  {t.myListing.termsLink}
                </Link>
                {t.myListing.termsAfter}
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
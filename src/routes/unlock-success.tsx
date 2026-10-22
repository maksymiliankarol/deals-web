import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router"
import { ApiError, getUnlockedDetails } from "../lib/api"
import type { UnlockedDetails } from "../types"
import { canRenderInPdf, downloadDealPdf } from "../lib/deal-pdf"
import { saveUnlocked } from "../lib/unlocked-storage"
import { ChildLayout } from "../layouts/child-layout"

// State type: add `saved`
type State =
  | { status: "loading" }
  | { status: "ready"; details: UnlockedDetails; saved: boolean }
  | { status: "error"; message: string }

function errorMessage(err: unknown) {
  if (err instanceof ApiError) {
    if (err.status === 404) return "We couldn't find this payment."
    if (err.status === 402) return "Your payment hasn't been confirmed yet. Try again in a moment."
    if (err.status === 410) return "These details are no longer available."
    if (err.status === 502) return "Couldn't reach the payment provider. Try again."
    return err.message
  }
  return "Something went wrong."
}

export function UnlockSuccess() {
  const [params] = useSearchParams()
  const sessionId = params.get("session_id")

  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<State>({ status: "loading" })

  const [pdfPending, setPdfPending] = useState(false)
  const [pdfError, setPdfError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) return

    let cancelled = false

    getUnlockedDetails(sessionId)
      .then((details) => {
        let saved = true
        try {
          saveUnlocked(sessionId, details)
        } catch (err) {
          console.error("Could not save the unlock on this device", err)
          saved = false
        }

        if (!cancelled) setState({ status: "ready", details, saved })
      })
      .catch((err) => {
        if (!cancelled) setState({ status: "error", message: errorMessage(err) })
      })

    return () => {
      cancelled = true
    }
  }, [sessionId, attempt])

  function retry() {
    setState({ status: "loading" })
    setAttempt((a) => a + 1)
  }

  async function handleDownload(details: UnlockedDetails) {
    setPdfPending(true)
    setPdfError(null)

    try {
      await downloadDealPdf(details)
    } catch (err) {
      console.error(err)
      setPdfError("Could not create the PDF. Please try again.")
    } finally {
      setPdfPending(false)
    }
  }

  return (
    <ChildLayout>
      {!sessionId ? (
        <p>This page needs a payment link.</p>
      ) : state.status === "loading" ? (
        <p>Confirming your payment…</p>
      ) : state.status === "error" ? (
        <div className="flex flex-col gap-4">
          <p role="alert" className="text-error">{state.message}</p>
          <button
            type="button"
            onClick={retry}
            className="self-start border-2 border-black bg-white px-3 py-2 cursor-pointer hover:brightness-75"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-green">Success!</h1>
          <p>
            You've unlocked this listing. You can now reach the buyer using the email
            and phone below.
          </p>

          <div className="flex flex-col gap-2 border-2 bg-white p-4">
            <p>
              Email:{" "}
              <a href={`mailto:${state.details.email}`} className="underline">
                {state.details.email}
              </a>
            </p>
            <p>
              Phone:{" "}
              <a href={`tel:${state.details.phone}`} className="underline">
                {state.details.phone}
              </a>
            </p>
          </div>

          <p>
            Please make sure you've downloaded the PDF or saved these contact details
            another way.{" "}
            {state.saved ? (
              <>
                A copy is kept in your{" "}
                <Link to="/unlocked" className="underline">unlocked list</Link> on this
                device, but it disappears if you clear your browser data.
              </>
            ) : (
              <>They couldn't be saved on this device.</>
            )}
          </p>

          <button
            type="button"
            onClick={() => handleDownload(state.details)}
            disabled={pdfPending}
            className="self-start bg-green text-white px-3 py-2 border-2 border-black cursor-pointer hover:brightness-75 disabled:opacity-50"
          >
            {pdfPending ? "Creating PDF…" : "Download PDF"}
          </button>
          {pdfError && <p role="alert" className="text-error">{pdfError}</p>}
          {!canRenderInPdf(
            [state.details.description, state.details.email, state.details.phone].join(" ")
          ) && (
            <p>
              Some characters in these details can't be shown in the PDF. Everything is
              still on this page.
            </p>
          )}
        </div>
      )}
    </ChildLayout>
  )
}
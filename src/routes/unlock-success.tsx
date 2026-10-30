import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router"
import { getUnlockedDetails } from "../lib/api"
import { describeError } from "../lib/errors"
import { useI18n } from "../lib/i18n-context"
import type { UnlockedDetails } from "../types"
import { canRenderInPdf, downloadDealPdf } from "../lib/deal-pdf"
import { saveUnlocked } from "../lib/unlocked-storage"
import { ChildLayout } from "../layouts/child-layout"

// The error itself is kept, not its text, so the message follows the language
type State =
  | { status: "loading" }
  | { status: "ready"; details: UnlockedDetails; saved: boolean }
  | { status: "error"; error: unknown }

export function UnlockSuccess() {
  const { t, lang } = useI18n()
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
      .catch((error) => {
        if (!cancelled) setState({ status: "error", error })
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
      await downloadDealPdf(details, t, lang)
    } catch (err) {
      console.error(err)
      setPdfError(t.pdf.failed)
    } finally {
      setPdfPending(false)
    }
  }

  return (
    <ChildLayout>
      {!sessionId ? (
        <p>{t.unlockSuccess.needsLink}</p>
      ) : state.status === "loading" ? (
        <p>{t.unlockSuccess.confirming}</p>
      ) : state.status === "error" ? (
        <div className="flex flex-col gap-4">
          <p role="alert" className="text-error">{describeError(t, state.error)}</p>
          <button
            type="button"
            onClick={retry}
            className="self-start border-2 border-black bg-white px-3 py-2 cursor-pointer hover:brightness-75"
          >
            {t.common.tryAgain}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-green">{t.common.success}</h1>
          <p>{t.unlockSuccess.intro}</p>

          <div className="flex flex-col gap-2 border-2 bg-white p-4">
            <p>
              {t.common.email}:{" "}
              <a href={`mailto:${state.details.email}`} className="underline">
                {state.details.email}
              </a>
            </p>
            <p>
              {t.common.phone}:{" "}
              <a href={`tel:${state.details.phone}`} className="underline">
                {state.details.phone}
              </a>
            </p>
          </div>

          <p>
            {t.unlockSuccess.saveReminder}{" "}
            {state.saved ? (
              <>
                {t.unlockSuccess.savedBefore}
                <Link to="/unlocked" className="underline">
                  {t.unlockSuccess.savedLink}
                </Link>
                {t.unlockSuccess.savedAfter}
              </>
            ) : (
              <>{t.unlockSuccess.notSaved}</>
            )}
          </p>

          <button
            type="button"
            onClick={() => handleDownload(state.details)}
            disabled={pdfPending}
            className="self-start bg-green text-white px-3 py-2 border-2 border-black cursor-pointer hover:brightness-75 disabled:opacity-50"
          >
            {pdfPending ? t.pdf.creating : t.pdf.download}
          </button>
          {pdfError && <p role="alert" className="text-error">{pdfError}</p>}
          {!canRenderInPdf(
            [state.details.description, state.details.email, state.details.phone].join(" ")
          ) && <p>{t.unlockSuccess.pdfUnsupported}</p>}
        </div>
      )}
    </ChildLayout>
  )
}
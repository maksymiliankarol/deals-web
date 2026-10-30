import { Navigate, useLocation } from "react-router"
import { ChildLayout } from "../layouts/child-layout"
import { useI18n } from "../lib/i18n-context"
import type { BuyPostedState } from "../types"

export function BuyPosted() {
  const { t } = useI18n()

  // Set by the buy form right after a successful post. Opening this URL
  // directly has no state, so it redirects. A refresh keeps it, because it
  // lives in the history entry.
  const state = useLocation().state as BuyPostedState | null

  if (typeof state?.id !== "number") return <Navigate to="/buy" replace />

  return (
    <ChildLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-green">{t.common.success}</h1>
        <p>{t.buyPosted.intro}</p>

        <div className="flex flex-col gap-2 border-2 bg-white p-4">
          <p>
            {t.common.email}: <span>{state.email}</span>
          </p>
          <p>
            {t.common.phone}: <span>{state.phone}</span>
          </p>
        </div>

        <p>{t.buyPosted.expiry}</p>
        <p>{t.buyPosted.close}</p>
      </div>
    </ChildLayout>
  )
}
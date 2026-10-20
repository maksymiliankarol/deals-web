import { Navigate, useLocation } from "react-router"
import { ChildLayout } from "../layouts/child-layout"
import type { BuyPostedState } from "../types"

export function BuyPosted() {
  // Set by the buy form right after a successful post. Opening this URL
  // directly has no state, so it redirects. A refresh keeps it, because it
  // lives in the history entry.
  const state = useLocation().state as BuyPostedState | null

  if (typeof state?.id !== "number") return <Navigate to="/buy" replace />

  return (
    <ChildLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-green">Success!</h1>
        <p>
          Anyone who wants to work on your need can now
          reach you using the email and phone below.
        </p>

        <div className="flex flex-col gap-2 border-2 bg-white p-4">
          <p>
            Email:{" "}
            <span>
              {state.email}
            </span>
          </p>
          <p>
            Phone:{" "}
            <span>
              {state.phone}
            </span>
          </p>
        </div>

        <p>
          If nobody contacts you within 3 days, it means no one decided to work
          on your need, and the listing expires.
        </p>
        <p>You can now safely close this page.</p>
      </div>
    </ChildLayout>
  )
}
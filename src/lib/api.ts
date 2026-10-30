import type { Buy, BuyMatch, UnlockedDetails } from "../types"

const API_URL: string = import.meta.env.VITE_API_URL
// Fails at startup if the variable is missing (.env.local in dev, .env.production in builds).
if (!API_URL) throw new Error("VITE_API_URL is not set")
  
// The slowest call is posting a buy (Turnstile check + AI check + insert).
const TIMEOUT_MS = 20_000

const TURNSTILE_HEADER = "x-turnstile-token"

// Sent by deals-api. Keep in sync with deals-api (src/lib/error-codes.ts).
export type ServerErrorCode =
  | "invalid_input"
  | "body_too_large"
  | "rate_limited"
  | "too_many_checkouts"
  | "verification_required"
  | "verification_failed"
  | "verification_unavailable"
  | "contact_info"
  | "listing_unavailable"
  | "checkout_failed"
  | "session_not_found"
  | "payment_unavailable"
  | "payment_incomplete"
  | "details_gone"
  | "not_found"
  | "internal"

  // Raised here, never sent by the server
export type ClientErrorCode = "network" | "timeout" | "bad_response"

export type ErrorCode = ServerErrorCode | ClientErrorCode

export class ApiError extends Error {
  // 0 means there was no response at all (offline, blocked, timed out).
  status: number
  // null: the server sent no usable code (a proxy or error page in the way)
  code: ErrorCode | null

  constructor(status: number, code: ErrorCode | null = null) {
    // for the console only: users get text from describeError
    super(code ?? `Request failed: ${status}`)
    this.status = status
    this.code = code
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response

  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      signal: AbortSignal.timeout(TIMEOUT_MS)
    })
  } catch (err) {
    // fetch only throws when there is no response at all. Nothing else aborts
    // these requests, so an abort here is the timeout.
    if (err instanceof DOMException && (err.name === "TimeoutError" || err.name === "AbortError")) {
      throw new ApiError(0, "timeout")
    }
    throw new ApiError(0, "network")
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { code?: unknown } | null
    const code = typeof body?.code === "string" ? (body.code as ErrorCode) : null
    throw new ApiError(res.status, code)
  }

  try {
    return (await res.json()) as T
  } catch {
    // A 2xx that isn't JSON (a proxy or error page in the way).
    throw new ApiError(502, "bad_response")
  }
}

const post = <T>(path: string, data: unknown, headers: Record<string, string> = {}) =>
  request<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(data)
  })

// Only ever send the browser to Stripe's hosted checkout.
const isStripeCheckoutUrl = (value: string) => {
  try {
    const url = new URL(value)
    return url.protocol === "https:" && url.hostname === "checkout.stripe.com"
  } catch {
    return false
  }
}

export const createBuy = (input: Buy, token: string) =>
  post<{ id: number }>("/api/buy", input, { [TURNSTILE_HEADER]: token })

export const searchBuys = (description: string, token: string) =>
  post<{ matches: BuyMatch[] }>("/api/search", { description }, { [TURNSTILE_HEADER]: token })

export async function startUnlock(buyId: number, listingId: string, token: string) {
  const { url } = await post<{ url: string }>(
    `/api/unlock/${buyId}`,
    { listingId },
    { [TURNSTILE_HEADER]: token }
  )

  if (!isStripeCheckoutUrl(url)) throw new ApiError(502, "bad_response")

  return { url }
}

export const getUnlockedDetails = (sessionId: string) =>
  request<UnlockedDetails>(`/api/unlock/session/${encodeURIComponent(sessionId)}`)
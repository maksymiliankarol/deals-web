import type { Buy, BuyMatch, UnlockedDetails } from "../types"

const API_URL: string = import.meta.env.VITE_API_URL
// The production build is checked in vite.config.ts; this covers a missing .env in dev.
if (!API_URL) throw new Error("VITE_API_URL is not set")

// The slowest call is posting a buy (Turnstile check + AI check + insert).
const TIMEOUT_MS = 20_000

const TURNSTILE_HEADER = "x-turnstile-token"

// What users see when the server gave no usable message of its own.
function defaultMessage(status: number) {
  if (status === 0) return "Can't reach the server. Check your connection and try again."
  if (status === 403) return "Verification failed. Please try again."
  if (status === 404) return "We couldn't find that."
  if (status === 413) return "That request is too large."
  if (status === 429) return "Too many requests. Please wait a minute and try again."
  if (status >= 500) return "Something went wrong on our side. Please try again."
  return "Something went wrong. Please check your input and try again."
}

export class ApiError extends Error {
  // 0 means there was no response at all (offline, blocked, timed out).
  status: number
  field?: string

  constructor(status: number, message?: string, field?: string) {
    super(message ?? defaultMessage(status))
    this.status = status
    this.field = field
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
      throw new ApiError(0, "The server took too long to respond. Please try again.")
    }
    throw new ApiError(0)
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as
      | { error?: unknown; field?: unknown }
      | null

    // Only trust server messages for client errors; 5xx keeps the generic text.
    const message =
      res.status < 500 && typeof body?.error === "string" ? body.error : undefined
    const field = typeof body?.field === "string" ? body.field : undefined

    throw new ApiError(res.status, message, field)
  }

  try {
    return (await res.json()) as T
  } catch {
    // A 2xx that isn't JSON (a proxy or error page in the way).
    throw new ApiError(502)
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

export const searchBuys = (description: string) =>
  post<{ matches: BuyMatch[] }>("/api/search", { description })

export async function startUnlock(buyId: number, listingId: string, token: string) {
  const { url } = await post<{ url: string }>(
    `/api/unlock/${buyId}`,
    { listingId },
    { [TURNSTILE_HEADER]: token }
  )

  if (!isStripeCheckoutUrl(url)) throw new ApiError(502)

  return { url }
}

export const getUnlockedDetails = (sessionId: string) =>
  request<UnlockedDetails>(`/api/unlock/session/${encodeURIComponent(sessionId)}`)
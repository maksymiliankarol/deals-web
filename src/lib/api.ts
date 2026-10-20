import type { Buy, BuyMatch, UnlockedDetails } from "../types"

const API_URL: string = import.meta.env.VITE_API_URL

export class ApiError extends Error {
  status: number
  field?: string

  constructor(status: number, message?: string, field?: string) {
    super(message ?? `Request failed: ${status}`)
    this.status = status
    this.field = field
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, init)

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as
      | { error?: unknown; field?: unknown }
      | null

    // Only trust server messages for client errors; 5xx keeps the generic text.
    const message =
      res.status < 500 && typeof body?.error === 'string' ? body.error : undefined
    const field = typeof body?.field === 'string' ? body.field : undefined

    throw new ApiError(res.status, message, field)
  }

  return res.json() as Promise<T>
}

const post = <T>(path: string, data: unknown) =>
  request<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

export const createBuy = (input: Buy) =>
  post<{ id: number }>('/api/buy', input)

export const searchBuys = (description: string) =>
  post<{ matches: BuyMatch[] }>('/api/search', { description })

export const startUnlock = (buyId: number, listingId: string) =>
  post<{ url: string }>(`/api/unlock/${buyId}`, { listingId })

export const getUnlockedDetails = (sessionId: string) =>
  request<UnlockedDetails>(`/api/unlock/session/${encodeURIComponent(sessionId)}`)
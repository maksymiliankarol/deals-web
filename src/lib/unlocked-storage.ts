import type { UnlockedDetails } from "../types"

export type SavedUnlock = UnlockedDetails & {
  // Stripe session id: the same unlock saved twice is one entry.
  sessionId: string
}

const KEY = "unlocked-listings"

export function getUnlockedList(): SavedUnlock[] {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? (parsed as SavedUnlock[]) : []
  } catch {
    return []
  }
}

export function saveUnlocked(sessionId: string, details: UnlockedDetails) {
  const list = getUnlockedList()
  if (list.some((item) => item.sessionId === sessionId)) return

  // Newest first. setItem can throw (storage full, or blocked in private mode).
  localStorage.setItem(KEY, JSON.stringify([{ ...details, sessionId }, ...list]))
}

export function deleteUnlocked(sessionId: string) {
  const remaining = getUnlockedList().filter((item) => item.sessionId !== sessionId)
  localStorage.setItem(KEY, JSON.stringify(remaining))
}
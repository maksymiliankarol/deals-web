import type { UnlockedDetails } from "../types"
import { isRecord, isValidDate, readList } from "./storage"

export type SavedUnlock = UnlockedDetails & {
  // Stripe session id: the same unlock saved twice is one entry.
  sessionId: string
}

const KEY = "unlocked-listings"

// Buyer contact details shouldn't sit in a browser forever. Shown to the user
// on the Unlocked page, so change the wording there if you change the number.
export const RETENTION_DAYS = 90
const RETENTION_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000

// Only what the pages need: a wrong type here would crash them.
const isSavedUnlock = (value: unknown): value is SavedUnlock =>
  isRecord(value) &&
  typeof value.sessionId === "string" &&
  typeof value.description === "string" &&
  typeof value.email === "string" &&
  typeof value.phone === "string" &&
  Number.isInteger(value.tier) &&
  Number.isFinite(value.price_cents) &&
  isValidDate(value.purchased_at)

const isFresh = (item: SavedUnlock) =>
  Date.now() - Date.parse(item.purchased_at) < RETENTION_MS

export const getUnlockedList = () => readList(KEY, isSavedUnlock).filter(isFresh)

// Returns the list and also rewrites storage without broken or expired entries.
// Idempotent, so it's fine as a lazy useState initializer.
export function pruneUnlocked(): SavedUnlock[] {
  const kept = getUnlockedList()

  try {
    if (kept.length === 0) localStorage.removeItem(KEY)
    else localStorage.setItem(KEY, JSON.stringify(kept))
  } catch {
    // Storage blocked: nothing stored, nothing to prune.
  }

  return kept
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

export function clearUnlocked() {
  localStorage.removeItem(KEY)
}
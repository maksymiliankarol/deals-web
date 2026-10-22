export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null

export const isValidDate = (value: unknown): value is string =>
  typeof value === "string" && !Number.isNaN(Date.parse(value))

// Reads a JSON list from localStorage and keeps only the entries that pass
// `isItem`. A broken entry (older version, hand-edited, half-written) is dropped
// instead of crashing the page that renders it.
export function readList<T>(
  key: string,
  isItem: (value: unknown) => value is T
): T[] {
  try {
    const raw = localStorage.getItem(key)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter(isItem) : []
  } catch {
    return []
  }
}
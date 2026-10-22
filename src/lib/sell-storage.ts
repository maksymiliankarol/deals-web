import { isRecord, isValidDate, readList } from './storage'

export type SellListing = {
  id: string
  description: string
  createdAt: string // ISO 8601
}

const KEY = 'sell-listings'

// Only what the pages need: a wrong type here would crash them.
const isSellListing = (value: unknown): value is SellListing =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  typeof value.description === 'string' &&
  isValidDate(value.createdAt)

export const getSellListings = () => readList(KEY, isSellListing)

export function getSellListing(id: string): SellListing | undefined {
  return getSellListings().find((listing) => listing.id === id)
}

export function addSellListing(description: string): SellListing {
  const listing: SellListing = {
    id: crypto.randomUUID(),
    description,
    createdAt: new Date().toISOString()
  }

  // Newest first. setItem can throw (storage full, or blocked in private mode).
  localStorage.setItem(KEY, JSON.stringify([listing, ...getSellListings()]))

  return listing
}

export function deleteSellListing(id: string) {
  const remaining = getSellListings().filter((listing) => listing.id !== id)
  localStorage.setItem(KEY, JSON.stringify(remaining))
}
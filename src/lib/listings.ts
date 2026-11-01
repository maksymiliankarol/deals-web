const KEY = "deals:sell-listings";

export type Listing = { id: string; text: string; createdAt: string };

export function getListings(): Listing[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(listings: Listing[]): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(listings));
    return true;
  } catch {
    return false;
  }
}

export function addListing(text: string): boolean {
  const listing: Listing = {
    id: crypto.randomUUID(),
    text,
    createdAt: new Date().toISOString(),
  };
  return save([listing, ...getListings()]);
}

export function removeListing(id: string): Listing[] {
  const next = getListings().filter((l) => l.id !== id);
  save(next);
  return next;
}
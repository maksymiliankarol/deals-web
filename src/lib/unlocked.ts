import type { Unlocked } from "./api";

const KEY = "deals:unlocked";

export function getSaved(): Unlocked[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(items: Unlocked[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // storage full or blocked: the on-screen details are still shown once
  }
}

export function saveUnlocked(item: Unlocked) {
  write([item, ...getSaved().filter((s) => s.id !== item.id)]); // newest first, no duplicates
}

export function removeSaved(id: number): Unlocked[] {
  const next = getSaved().filter((s) => s.id !== id);
  write(next);
  return next;
}
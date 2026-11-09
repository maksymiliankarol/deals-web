import type { Messages } from "../locales/en";

const API_URL = import.meta.env.VITE_API_URL as string;

export type BuyInput = {
  phone: string;
  email: string;
  description: string;
};

export type Match = {
  id: number;
  description: string;
  created_at: string;
  score: number;
};

export type Unlocked = {
  id: number;
  description: string;
  email: string;
  phone: string;
  price: number;
  currency: string;
  listed_at: string;
  unlocked_at: string;
};

export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(status: number, code?: string) {
    super(`API error ${status}`);
    this.status = status;
    this.code = code;
  }
}

async function toApiError(res: Response) {
  const body = await res.json().catch(() => null);
  return new ApiError(res.status, body?.code);
}

export type ErrorKind = keyof Messages["errors"];

export function getErrorKind(err: unknown): ErrorKind {
  if (err instanceof ApiError) {
    if (err.code === "too_many_reservations") return "tooManyReservations";
    if (err.code === "contact_details") return "contactDetails";
    if (err.status === 429) return "tooManyRequests";
    if (err.status === 400) return "badRequest";
    if (err.status === 409) return "unavailable";
    if (err.status === 404) return "notFound";
    if (err.status === 410) return "alreadyRevealed";
  }
  return "generic";
}

export async function createBuy(input: BuyInput) {
  const res = await fetch(`${API_URL}/buy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) throw await toApiError(res);
  return res.json();
}

export async function searchBuys(q: string): Promise<Match[]> {
  const res = await fetch(`${API_URL}/search?${new URLSearchParams({ q })}`);
  if (!res.ok) throw new ApiError(res.status);
  return res.json();
}

export async function startUnlock(id: number): Promise<string> {
  const res = await fetch(`${API_URL}/unlock/${id}`, { method: "POST" });
  if (!res.ok) throw new ApiError(res.status);
  return (await res.json()).url;
}

export async function getUnlocked(sessionId: string): Promise<Unlocked | null> {
  const res = await fetch(`${API_URL}/unlock/${encodeURIComponent(sessionId)}`);
  if (res.status === 202) return null;
  if (!res.ok) throw new ApiError(res.status);
  return res.json();
}
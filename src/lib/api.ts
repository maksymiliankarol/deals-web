import type { Messages } from "../locales/en";
import type { BuyInput, Match } from "../types";

const API_URL = import.meta.env.VITE_API_URL as string;

export class ApiError extends Error {
  status: number;
  constructor(status: number) {
    super(`API error ${status}`);
    this.status = status;
  }
}

export type ErrorKind = keyof Messages["errors"];

export function getErrorKind(err: unknown): ErrorKind {
  if (err instanceof ApiError) {
    if (err.status === 429) return "tooManyRequests";
    if (err.status === 400) return "badRequest";
  }
  return "generic";
}
export async function createBuy(input: BuyInput) {
  const res = await fetch(`${API_URL}/buy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) throw new ApiError(res.status);
  return res.json();
}

export async function searchBuys(q: string): Promise<Match[]> {
  const res = await fetch(`${API_URL}/search?${new URLSearchParams({ q })}`);
  if (!res.ok) throw new ApiError(res.status);
  return res.json();
}
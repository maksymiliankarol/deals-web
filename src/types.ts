export type Buy = {
  email: string
  phone: string
  description: string
  tier: number
}

export type BuyPostedState = { 
  id: number 
  email: string
  phone: string
}

export type BuyMatch = {
  id: number
  description: string
  tier: number
  created_at: string
  price_cents: number
  score: number
}

export type UnlockedDetails = {
  sessionId?: string
  description: string
  tier: number
  email: string
  phone: string
  price_cents: number
  purchased_at: string
}
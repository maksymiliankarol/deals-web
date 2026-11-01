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
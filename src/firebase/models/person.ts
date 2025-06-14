export type Gender = "male" | "female" | "other";

export interface Person {
  name: string;
  datesINeedAPresent: { month: number; day: number }[];
  previousPresents: string;
  gender: Gender;
  age: string;
  budgetMin: number;
  budgetMax: number;
  interests: string;
  userId: string;
  id?: string;
} 
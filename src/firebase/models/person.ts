export interface Person {
  name: string;
  datesINeedAPresent: { month: number; day: number }[];
  previousPresents: string;
  gender: string;
  age: string;
  budget: string;
  interests: string;
  userId: string;
  id?: string;
}
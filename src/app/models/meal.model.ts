export interface Meal {
  id: string;  // Генеруватимемо через Date.now() або UUID
  title: string;
  calories: number;
  date: string;
}

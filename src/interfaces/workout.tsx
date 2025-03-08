import { Exercise } from '@/interfaces/exercise';
export interface Workout {
  id: string;
  name: string;
  date: Date;
  exercises: Exercise[];
  category?: string;
  completed?: boolean;
}
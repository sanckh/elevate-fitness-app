import { Exercise } from './exercise';
export interface Workout {
  id: string;
  name: string;
  date: Date;
  userId: string;
  exercises: Exercise[];
  category?: string;
  completed?: boolean;
}
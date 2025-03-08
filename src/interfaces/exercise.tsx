import { Workout } from './workout'
export interface Exercise {
    id: string;
    name: string;
    sets: ExerciseSet[];
    notes?: string;
    reps?: number; 
    weight?: number; 
}
export interface ExerciseHistoryItem {
    date: Date;
    workoutId: string;
    workoutName: string;
    sets: ExerciseSet[];
}

export interface ExerciseSet {
    id: string;
    reps: number;
    weight?: number;
}

export interface ExerciseProgressChartProps {
    exerciseName: string;
    workouts: Workout[];
}

export interface ExerciseSelectorProps {
    exercises: string[];
    selectedExercise: string | null;
    onSelectExercise: (exercise: string) => void;
}

export interface ExerciseSetListProps {
    sets: ExerciseSet[];
    onSetsChange: (sets: ExerciseSet[]) => void;
}
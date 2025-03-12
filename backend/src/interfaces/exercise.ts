
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
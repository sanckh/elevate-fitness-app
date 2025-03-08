import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';
// import { Exercise, Workout } from '@/pages/WorkoutDetail';
import { Exercise } from '@/interfaces/exercise';
import { Workout } from '@/interfaces/workout';
import { ExerciseSet } from '@/interfaces/exercise';
import ExerciseSetList from '@/components/ExerciseSetList';

interface WorkoutFormProps {
  initialWorkout?: Partial<Workout>;
  onSubmit: (workout: Omit<Workout, 'id'> | Workout) => void;
  onCancel: () => void;
}

const WorkoutForm = ({ initialWorkout, onSubmit, onCancel }: WorkoutFormProps) => {
  const [workoutName, setWorkoutName] = useState(initialWorkout?.name || '');
  
  // Initialize with default exercise if none provided
  const defaultExercise = {
    id: crypto.randomUUID(),
    name: '',
    sets: [
      {
        id: crypto.randomUUID(),
        reps: 10,
        weight: undefined
      }
    ]
  };
  
  const [exercises, setExercises] = useState<Exercise[]>(
    initialWorkout?.exercises || [defaultExercise]
  );

  const handleAddExercise = () => {
    setExercises([
      ...exercises,
      {
        id: crypto.randomUUID(),
        name: '',
        sets: [
          {
            id: crypto.randomUUID(),
            reps: 10,
            weight: undefined
          }
        ]
      }
    ]);
  };

  const handleRemoveExercise = (id: string) => {
    setExercises(exercises.filter(exercise => exercise.id !== id));
  };

  const handleExerciseChange = (id: string, field: keyof Exercise, value: any) => {
    setExercises(
      exercises.map(exercise => 
        exercise.id === id 
          ? { ...exercise, [field]: value } 
          : exercise
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!workoutName.trim()) {
      alert('Please enter a workout name');
      return;
    }
    
    if (exercises.some(ex => !ex.name.trim())) {
      alert('Please fill in all exercise names');
      return;
    }
    
    const workout = {
      ...(initialWorkout?.id ? { id: initialWorkout.id } : {}),
      name: workoutName,
      exercises,
      date: initialWorkout?.date || new Date(),
    };
    
    onSubmit(workout as Workout);
    //onSubmit(workout as any);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="workout-name">Workout Name</Label>
        <Input
          id="workout-name"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
          placeholder="e.g., Upper Body, Leg Day, etc."
          required
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Exercises</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleAddExercise}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Exercise
          </Button>
        </div>
        
        {exercises.map((exercise, index) => (
          <Card key={exercise.id} className="p-4 space-y-4">
            <div className="flex justify-between items-start">
              <span className="font-medium">Exercise {index + 1}</span>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => handleRemoveExercise(exercise.id)}
                disabled={exercises.length === 1}
                className="h-8 w-8 p-0 text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor={`exercise-name-${exercise.id}`}>Name</Label>
                <Input
                  id={`exercise-name-${exercise.id}`}
                  value={exercise.name}
                  onChange={(e) => handleExerciseChange(exercise.id, 'name', e.target.value)}
                  placeholder="e.g., Bench Press, Squats, etc."
                  required
                />
              </div>
              
              <div>
                <ExerciseSetList 
                  sets={exercise.sets}
                  onSetsChange={(newSets) => handleExerciseChange(exercise.id, 'sets', newSets)}
                />
              </div>
              
              <div>
                <Label htmlFor={`exercise-notes-${exercise.id}`}>Notes (Optional)</Label>
                <Input
                  id={`exercise-notes-${exercise.id}`}
                  value={exercise.notes || ''}
                  onChange={(e) => handleExerciseChange(exercise.id, 'notes', e.target.value)}
                  placeholder="Any additional details..."
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialWorkout?.id ? 'Update Workout' : 'Add Workout'}
        </Button>
      </div>
    </form>
  );
};

export default WorkoutForm;

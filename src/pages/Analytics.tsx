import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ExerciseProgressChart from '@/components/ExerciseProgressChart';
import ExerciseSelector from '@/components/ExerciseSelector';
import { Workout } from '@/pages/Workouts';

// Helper function to determine if a workout should be marked as completed based on date
export const isWorkoutCompleted = (workoutDate: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to beginning of today
  const compareDate = new Date(workoutDate);
  compareDate.setHours(0, 0, 0, 0); // Set to beginning of workout date
  
  return compareDate <= today;
};

// Placeholder data for testing
const placeholderWorkouts: Workout[] = [
  {
    id: '1',
    name: 'Upper Body Workout',
    date: new Date('2023-01-05'),
    completed: isWorkoutCompleted(new Date('2023-01-05')),
    exercises: [
      { 
        id: '1-1',
        name: 'Bench Press', 
        sets: [
          { id: '1-1-1', reps: 10, weight: 135 },
          { id: '1-1-2', reps: 8, weight: 155 },
          { id: '1-1-3', reps: 6, weight: 175 }
        ] 
      },
      { 
        id: '1-2',
        name: 'Shoulder Press', 
        sets: [
          { id: '1-2-1', reps: 10, weight: 85 },
          { id: '1-2-2', reps: 8, weight: 95 },
          { id: '1-2-3', reps: 6, weight: 105 }
        ] 
      }
    ]
  },
  {
    id: '2',
    name: 'Upper Body Workout',
    date: new Date('2023-01-15'),
    completed: isWorkoutCompleted(new Date('2023-01-15')),
    exercises: [
      { 
        id: '2-1',
        name: 'Bench Press', 
        sets: [
          { id: '2-1-1', reps: 10, weight: 145 },
          { id: '2-1-2', reps: 8, weight: 165 },
          { id: '2-1-3', reps: 6, weight: 185 }
        ] 
      },
      { 
        id: '2-2',
        name: 'Shoulder Press', 
        sets: [
          { id: '2-2-1', reps: 10, weight: 90 },
          { id: '2-2-2', reps: 8, weight: 100 },
          { id: '2-2-3', reps: 6, weight: 110 }
        ] 
      }
    ]
  },
  {
    id: '3',
    name: 'Upper Body Workout',
    date: new Date('2023-01-25'),
    completed: isWorkoutCompleted(new Date('2023-01-25')),
    exercises: [
      { 
        id: '3-1',
        name: 'Bench Press', 
        sets: [
          { id: '3-1-1', reps: 10, weight: 155 },
          { id: '3-1-2', reps: 8, weight: 175 },
          { id: '3-1-3', reps: 6, weight: 195 }
        ] 
      },
      { 
        id: '3-2',
        name: 'Shoulder Press', 
        sets: [
          { id: '3-2-1', reps: 10, weight: 95 },
          { id: '3-2-2', reps: 8, weight: 105 },
          { id: '3-2-3', reps: 6, weight: 115 }
        ] 
      }
    ]
  }
];

const Analytics = () => {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Load workouts from localStorage or use placeholder data
  const loadWorkouts = (): Workout[] => {
    const storedWorkouts = localStorage.getItem('workouts');
    if (storedWorkouts) {
      try {
        const parsedWorkouts = JSON.parse(storedWorkouts).map((workout: any) => ({
          ...workout,
          date: new Date(workout.date)
        }));
        
        // If we have valid workouts with exercises, return them
        if (parsedWorkouts.length > 0 && 
            parsedWorkouts.some((w: any) => w.exercises && w.exercises.length > 0)) {
          return parsedWorkouts;
        }
      } catch (error) {
        console.error('Error parsing workouts:', error);
      }
    }
    
    // Return placeholder data if no valid workouts found
    return placeholderWorkouts;
  };

  const workouts = loadWorkouts();
  
  // Extract all unique exercise names from all workouts
  const uniqueExerciseNames = Array.from(
    new Set(
      workouts
        .flatMap(workout => workout.exercises || [])
        .map(exercise => exercise.name)
    )
  ).sort();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 mt-20">
        <h1 className="text-3xl font-bold mb-6">Workout Analytics</h1>
        
        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="progress">Exercise Progress</TabsTrigger>
            <TabsTrigger value="summary">Workout Summary</TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exercise Progress Tracker</CardTitle>
                <CardDescription>
                  Track your progression for specific exercises over time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {uniqueExerciseNames.length > 0 ? (
                  <ExerciseSelector 
                    exercises={uniqueExerciseNames}
                    selectedExercise={selectedExercise}
                    onSelectExercise={setSelectedExercise}
                  />
                ) : (
                  <div className="text-center p-4 bg-secondary/20 rounded-lg">
                    <p className="text-muted-foreground">
                      No exercises found. Add workouts with exercises to see analytics.
                    </p>
                  </div>
                )}
                
                {selectedExercise ? (
                  <ExerciseProgressChart 
                    exerciseName={selectedExercise}
                    workouts={workouts}
                  />
                ) : (
                  <div className="text-center p-8 bg-secondary/20 rounded-lg">
                    <p className="text-muted-foreground">
                      {uniqueExerciseNames.length > 0 
                        ? "Select an exercise to view your progress over time" 
                        : "Add workouts with exercises to see progress charts"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="summary" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>
                  More detailed analytics will be available in future updates
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 text-center bg-secondary/20 rounded-lg">
                <p className="text-muted-foreground">
                  Workout summaries, volume tracking, and more analytics features are coming soon!
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Analytics;

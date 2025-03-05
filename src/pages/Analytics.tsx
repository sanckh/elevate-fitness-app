
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ExerciseProgressChart from '@/components/ExerciseProgressChart';
import ExerciseSelector from '@/components/ExerciseSelector';
import { Workout } from '@/pages/Workouts';

// Placeholder data for testing
const placeholderWorkouts: Workout[] = [
  {
    id: '1',
    name: 'Upper Body Workout',
    date: new Date('2023-01-05'),
    exercises: [
      { 
        name: 'Bench Press', 
        sets: [
          { reps: 10, weight: 135 },
          { reps: 8, weight: 155 },
          { reps: 6, weight: 175 }
        ] 
      },
      { 
        name: 'Shoulder Press', 
        sets: [
          { reps: 10, weight: 85 },
          { reps: 8, weight: 95 },
          { reps: 6, weight: 105 }
        ] 
      }
    ]
  },
  {
    id: '2',
    name: 'Upper Body Workout',
    date: new Date('2023-01-15'),
    exercises: [
      { 
        name: 'Bench Press', 
        sets: [
          { reps: 10, weight: 145 },
          { reps: 8, weight: 165 },
          { reps: 6, weight: 185 }
        ] 
      },
      { 
        name: 'Shoulder Press', 
        sets: [
          { reps: 10, weight: 90 },
          { reps: 8, weight: 100 },
          { reps: 6, weight: 110 }
        ] 
      }
    ]
  },
  {
    id: '3',
    name: 'Upper Body Workout',
    date: new Date('2023-01-25'),
    exercises: [
      { 
        name: 'Bench Press', 
        sets: [
          { reps: 10, weight: 155 },
          { reps: 8, weight: 175 },
          { reps: 6, weight: 195 }
        ] 
      },
      { 
        name: 'Shoulder Press', 
        sets: [
          { reps: 10, weight: 95 },
          { reps: 8, weight: 105 },
          { reps: 6, weight: 115 }
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

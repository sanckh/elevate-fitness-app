import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from "@/components/Header";
import { Footer } from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ExerciseProgressChart from '@/components/ExerciseProgressChart';
import ExerciseSelector from '@/components/ExerciseSelector';
import BodyProgressionChart from '@/components/BodyProgressionChart';
import BodyMetricSelector from '@/components/BodyMetricSelector';
import { Workout } from '@/interfaces/workout';
import { ProgressEntry } from '@/interfaces/progression';
import { Exercise } from '@/interfaces/exercise';
import { ErrorBoundary } from 'react-error-boundary';

const Analytics = () => {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [selectedBodyMetric, setSelectedBodyMetric] = useState<'weight' | 'bodyFat'>('weight');
  const navigate = useNavigate();
  
  const workouts = useMemo<Workout[]>(() => {
    try {
      const storedWorkouts = localStorage.getItem('workouts');
      if (!storedWorkouts) {
        return [];
      }
      
      let parsedWorkouts;
      try {
        parsedWorkouts = JSON.parse(storedWorkouts);
        
        if (!Array.isArray(parsedWorkouts)) {
          return [];
        }
        
        const validWorkouts = parsedWorkouts.map((workout: Workout) => {
          let workoutDate;
          try {
            workoutDate = new Date(workout.date);
            if (isNaN(workoutDate.getTime())) {
              workoutDate = new Date();
            }
          } catch (e) {
            workoutDate = new Date();
          }
          
          const { completed, ...workoutWithoutCompleted } = workout;
          
          return {
            ...workoutWithoutCompleted,
            date: workoutDate,
            exercises: Array.isArray(workout.exercises) ? workout.exercises : []
          };
        });
        
        const workoutsWithExercises = validWorkouts.filter((workout: Workout) => {
          return workout && 
                 workout.exercises && 
                 Array.isArray(workout.exercises) &&
                 workout.exercises.some((exercise: Exercise) => 
                   exercise && typeof exercise.name === 'string' && exercise.name.trim() !== ''
                 );
        });
        
        if (workoutsWithExercises.length > 0) {
          return workoutsWithExercises;
        }
      } catch (error) {
        console.error('Error parsing workouts:', error);
      }
      return [];
    } catch (error) {
      console.error('Error loading workouts:', error);
      return [];
    }
  }, []);
  
  const uniqueExerciseNames = useMemo(() => {
    if (!Array.isArray(workouts) || workouts.length === 0) {
      return [];
    }
    
    try {
      const exerciseSet = new Set<string>();
      
      workouts.forEach(workout => {
        if (!workout || !workout.exercises || !Array.isArray(workout.exercises)) {
          return;
        }
        
        workout.exercises.forEach(exercise => {
          if (exercise && typeof exercise.name === 'string' && exercise.name.trim() !== '') {
            exerciseSet.add(exercise.name);
          }
        });
      });
      
      return Array.from(exerciseSet).sort();
    } catch (error) {
      console.error('Error extracting exercise names:', error);
      return [];
    }
  }, [workouts]);
  
  const progressEntries = useMemo<ProgressEntry[]>(() => {
    try {
      const storedEntries = localStorage.getItem('progressEntries');
      if (!storedEntries) {
        return [];
      }
      
      let parsedEntries;
      try {
        parsedEntries = JSON.parse(storedEntries);
        
        if (!Array.isArray(parsedEntries)) {
          return [];
        }
        
        const validEntries = parsedEntries.map((entry: ProgressEntry) => {
          let entryDate;
          try {
            entryDate = new Date(entry.date);
            if (isNaN(entryDate.getTime())) {
              entryDate = new Date();
            }
          } catch (e) {
            entryDate = new Date();
          }
          
          return {
            ...entry,
            userId : entry.userId,
            date: entryDate,
            measurements: typeof entry.measurements === 'object' ? entry.measurements : {
              chest: 0,
              waist: 0,
              arms: 0
            },
            photos: Array.isArray(entry.photos) ? entry.photos : []
          };
        });
        
        if (validEntries.length > 0) {
          return validEntries;
        }
      } catch (error) {
        console.error('Error parsing progression entries:', error);
      }
      
      return [];
    } catch (error) {
      console.error('Error loading progression entries:', error);
      return [];
    }
  }, []);

 

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 mt-20">
        <h1 className="text-3xl font-bold mb-6">Workout Analytics</h1>
        
        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
            <TabsTrigger value="progress">Exercise Progress</TabsTrigger>
            <TabsTrigger value="body">Body Progress</TabsTrigger>
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
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <ExerciseSelector 
                    exercises={uniqueExerciseNames || []}
                    selectedExercise={selectedExercise || ''}
                    onSelectExercise={setSelectedExercise}
                  />
                </ErrorBoundary>
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
          <TabsContent value="body" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Body Progression Tracker</CardTitle>
                <CardDescription>
                  Track your body weight and body fat percentage changes over time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <BodyMetricSelector 
                  selectedMetric={selectedBodyMetric}
                  onSelectMetric={setSelectedBodyMetric}
                />
                
                <BodyProgressionChart 
                  progressEntries={progressEntries}
                  metricType={selectedBodyMetric}
                />
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
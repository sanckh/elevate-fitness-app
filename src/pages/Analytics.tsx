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
import { Workout } from '@/pages/Workouts';

const placeholderWorkouts: Workout[] = [
  {
    id: '1',
    name: 'Upper Body Workout',
    date: new Date('2023-01-05'),
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

const placeholderProgressEntries = [
  {
    id: '1',
    date: new Date('2023-01-05'),
    weight: 180,
    bodyFat: 18,
    measurements: {
      chest: 42,
      waist: 34,
      arms: 15,
    },
    photos: [
      '/placeholder.svg',
      '/placeholder.svg',
    ]
  },
  {
    id: '2',
    date: new Date('2023-02-05'),
    weight: 178,
    bodyFat: 17.5,
    measurements: {
      chest: 42.5,
      waist: 33.5,
      arms: 15.2,
    },
    photos: [
      '/placeholder.svg',
      '/placeholder.svg',
    ]
  },
  {
    id: '3',
    date: new Date('2023-03-05'),
    weight: 175,
    bodyFat: 16.8,
    measurements: {
      chest: 43,
      waist: 33,
      arms: 15.5,
    },
    photos: [
      '/placeholder.svg',
      '/placeholder.svg',
    ]
  },
  {
    id: '4',
    date: new Date('2023-04-05'),
    weight: 173,
    bodyFat: 16,
    measurements: {
      chest: 43.5,
      waist: 32.5,
      arms: 15.8,
    },
    photos: [
      '/placeholder.svg',
      '/placeholder.svg',
    ]
  },
];

const Analytics = () => {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [selectedBodyMetric, setSelectedBodyMetric] = useState<'weight' | 'bodyFat'>('weight');
  const navigate = useNavigate();
  
  const workouts = useMemo(() => {
    try {
      const storedWorkouts = localStorage.getItem('workouts');
      if (!storedWorkouts) {
        console.log('No workouts found in localStorage, using placeholder data');
        return placeholderWorkouts;
      }
      
      let parsedWorkouts;
      try {
        parsedWorkouts = JSON.parse(storedWorkouts);
        
        if (!Array.isArray(parsedWorkouts)) {
          console.log('Parsed workouts is not an array, using placeholder data');
          return placeholderWorkouts;
        }
        
        const validWorkouts = parsedWorkouts.map((workout: any) => {
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
        
        const workoutsWithExercises = validWorkouts.filter((workout: any) => {
          return workout && 
                 workout.exercises && 
                 Array.isArray(workout.exercises) &&
                 workout.exercises.some((exercise: any) => 
                   exercise && typeof exercise.name === 'string' && exercise.name.trim() !== ''
                 );
        });
        
        if (workoutsWithExercises.length > 0) {
          return workoutsWithExercises;
        }
      } catch (error) {
        console.error('Error parsing workouts:', error);
      }
      
      return placeholderWorkouts;
    } catch (error) {
      console.error('Error loading workouts:', error);
      return placeholderWorkouts;
    }
  }, []);
  
  const uniqueExerciseNames = useMemo(() => {
    if (!Array.isArray(workouts) || workouts.length === 0) {
      console.log('No workouts available for extracting exercise names');
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
  
  const progressEntries = useMemo(() => {
    try {
      const storedEntries = localStorage.getItem('progressEntries');
      if (!storedEntries) {
        console.log('No progression entries found in localStorage, using placeholder data');
        return placeholderProgressEntries;
      }
      
      let parsedEntries;
      try {
        parsedEntries = JSON.parse(storedEntries);
        
        if (!Array.isArray(parsedEntries)) {
          console.log('Parsed progression entries is not an array, using placeholder data');
          return placeholderProgressEntries;
        }
        
        const validEntries = parsedEntries.map((entry: any) => {
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
      
      return placeholderProgressEntries;
    } catch (error) {
      console.error('Error loading progression entries:', error);
      return placeholderProgressEntries;
    }
  }, []);

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

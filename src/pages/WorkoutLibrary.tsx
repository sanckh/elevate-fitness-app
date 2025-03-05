
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Workout } from '@/pages/WorkoutDetail';

const WorkoutLibrary = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    // Load existing workouts or show demo templates
    const storedWorkouts = localStorage.getItem('workouts');
    if (storedWorkouts) {
      setWorkouts(JSON.parse(storedWorkouts));
    }
  }, []);

  const handleAddToCalendar = (template: Workout) => {
    // Create a new workout based on the template
    const newWorkout: Workout = {
      id: crypto.randomUUID(),
      name: template.name,
      date: new Date(),
      exercises: template.exercises.map(exercise => ({
        ...exercise,
        id: crypto.randomUUID(),
        sets: exercise.sets.map(set => ({
          ...set,
          id: crypto.randomUUID()
        }))
      }))
    };

    // Add to existing workouts
    const storedWorkouts = localStorage.getItem('workouts');
    const workouts = storedWorkouts ? JSON.parse(storedWorkouts) : [];
    workouts.push(newWorkout);
    localStorage.setItem('workouts', JSON.stringify(workouts));

    toast({
      title: "Workout Added",
      description: `${newWorkout.name} added to your calendar`,
    });

    navigate('/workouts');
  };

  // Template workouts
  const upperBodyWorkout: Workout = {
    id: 'template-upper-body',
    name: 'Upper Body Workout',
    date: new Date(),
    exercises: [
      {
        id: 'bench-press',
        name: 'Bench Press',
        sets: [
          { id: 'bp-1', reps: 8, weight: 135 },
          { id: 'bp-2', reps: 8, weight: 135 },
          { id: 'bp-3', reps: 8, weight: 135 }
        ]
      },
      {
        id: 'barbell-row',
        name: 'Barbell Row',
        sets: [
          { id: 'br-1', reps: 8, weight: 95 },
          { id: 'br-2', reps: 8, weight: 95 },
          { id: 'br-3', reps: 8, weight: 95 }
        ]
      },
      {
        id: 'overhead-press',
        name: 'Overhead Press',
        sets: [
          { id: 'op-1', reps: 8, weight: 65 },
          { id: 'op-2', reps: 8, weight: 65 },
          { id: 'op-3', reps: 8, weight: 65 }
        ]
      }
    ]
  };

  const lowerBodyWorkout: Workout = {
    id: 'template-lower-body',
    name: 'Lower Body Workout',
    date: new Date(),
    exercises: [
      {
        id: 'squat',
        name: 'Squat',
        sets: [
          { id: 'sq-1', reps: 8, weight: 185 },
          { id: 'sq-2', reps: 8, weight: 185 },
          { id: 'sq-3', reps: 8, weight: 185 }
        ]
      },
      {
        id: 'deadlift',
        name: 'Deadlift',
        sets: [
          { id: 'dl-1', reps: 5, weight: 225 },
          { id: 'dl-2', reps: 5, weight: 225 },
          { id: 'dl-3', reps: 5, weight: 225 }
        ]
      },
      {
        id: 'leg-press',
        name: 'Leg Press',
        sets: [
          { id: 'lp-1', reps: 10, weight: 180 },
          { id: 'lp-2', reps: 10, weight: 180 },
          { id: 'lp-3', reps: 10, weight: 180 }
        ]
      }
    ]
  };

  const fullBodyWorkout: Workout = {
    id: 'template-full-body',
    name: 'Full Body Workout',
    date: new Date(),
    exercises: [
      {
        id: 'squat',
        name: 'Squat',
        sets: [
          { id: 'sq-1', reps: 5, weight: 185 },
          { id: 'sq-2', reps: 5, weight: 185 },
          { id: 'sq-3', reps: 5, weight: 185 }
        ]
      },
      {
        id: 'bench-press',
        name: 'Bench Press',
        sets: [
          { id: 'bp-1', reps: 5, weight: 135 },
          { id: 'bp-2', reps: 5, weight: 135 },
          { id: 'bp-3', reps: 5, weight: 135 }
        ]
      },
      {
        id: 'barbell-row',
        name: 'Barbell Row',
        sets: [
          { id: 'br-1', reps: 5, weight: 95 },
          { id: 'br-2', reps: 5, weight: 95 },
          { id: 'br-3', reps: 5, weight: 95 }
        ]
      },
      {
        id: 'overhead-press',
        name: 'Overhead Press',
        sets: [
          { id: 'op-1', reps: 5, weight: 65 },
          { id: 'op-2', reps: 5, weight: 65 },
          { id: 'op-3', reps: 5, weight: 65 }
        ]
      }
    ]
  };

  const pushPullLegsWorkout: Workout = {
    id: 'template-ppl',
    name: 'Push/Pull/Legs Split',
    date: new Date(),
    exercises: [
      {
        id: 'bench-press',
        name: 'Bench Press',
        sets: [
          { id: 'bp-1', reps: 8, weight: 135 },
          { id: 'bp-2', reps: 8, weight: 135 },
          { id: 'bp-3', reps: 8, weight: 135 }
        ]
      },
      {
        id: 'incline-press',
        name: 'Incline Press',
        sets: [
          { id: 'ip-1', reps: 8, weight: 115 },
          { id: 'ip-2', reps: 8, weight: 115 },
          { id: 'ip-3', reps: 8, weight: 115 }
        ]
      },
      {
        id: 'tricep-extension',
        name: 'Tricep Extension',
        sets: [
          { id: 'te-1', reps: 12, weight: 30 },
          { id: 'te-2', reps: 12, weight: 30 },
          { id: 'te-3', reps: 12, weight: 30 }
        ]
      }
    ]
  };

  const cardioWorkout: Workout = {
    id: 'template-cardio',
    name: 'Cardio Session',
    date: new Date(),
    exercises: [
      {
        id: 'treadmill',
        name: 'Treadmill',
        sets: [
          { id: 'tm-1', reps: 1, weight: 0, notes: '20 minutes, 6.0 mph' }
        ]
      },
      {
        id: 'stationary-bike',
        name: 'Stationary Bike',
        sets: [
          { id: 'sb-1', reps: 1, weight: 0, notes: '15 minutes, level 8 resistance' }
        ]
      },
      {
        id: 'elliptical',
        name: 'Elliptical',
        sets: [
          { id: 'el-1', reps: 1, weight: 0, notes: '10 minutes, moderate intensity' }
        ]
      }
    ]
  };

  const templates = [upperBodyWorkout, lowerBodyWorkout, fullBodyWorkout, pushPullLegsWorkout, cardioWorkout];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 mt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Workout Library</h1>
          <Button onClick={() => navigate('/workouts/new')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Workout
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{template.name}</CardTitle>
                <CardDescription>
                  {template.exercises.length} exercises
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {template.exercises.map((exercise) => (
                    <div key={exercise.id} className="text-sm">
                      <span className="font-medium">{exercise.name}</span>
                      <span className="text-muted-foreground ml-2">
                        {exercise.sets.length} set{exercise.sets.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => handleAddToCalendar(template)}
                >
                  Add to Your Calendar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WorkoutLibrary;

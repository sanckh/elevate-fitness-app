
import { useState, useEffect } from 'react';
import { Dumbbell, Search, Plus, Filter } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Exercise, Workout } from '@/pages/Workouts';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const workoutCategories = [
  { id: 'all', name: 'All Workouts' },
  { id: 'strength', name: 'Strength' },
  { id: 'cardio', name: 'Cardio' },
  { id: 'flexibility', name: 'Flexibility' },
  { id: 'hiit', name: 'HIIT' }
];

// Sample pre-defined workouts
const predefinedWorkouts: Workout[] = [
  {
    id: 'upper-body-1',
    name: 'Upper Body Power',
    date: new Date(),
    completed: false,
    category: 'strength',
    exercises: [
      { id: 'ex1', name: 'Bench Press', sets: 4, reps: 8, weight: 135 },
      { id: 'ex2', name: 'Pull-ups', sets: 3, reps: 10 },
      { id: 'ex3', name: 'Shoulder Press', sets: 3, reps: 12, weight: 45 },
      { id: 'ex4', name: 'Tricep Extensions', sets: 3, reps: 15, weight: 25 }
    ]
  },
  {
    id: 'lower-body-1',
    name: 'Leg Day Challenge',
    date: new Date(),
    completed: false,
    category: 'strength',
    exercises: [
      { id: 'ex5', name: 'Squats', sets: 4, reps: 10, weight: 175 },
      { id: 'ex6', name: 'Lunges', sets: 3, reps: 12, weight: 30 },
      { id: 'ex7', name: 'Leg Press', sets: 3, reps: 15, weight: 200 },
      { id: 'ex8', name: 'Calf Raises', sets: 4, reps: 20, weight: 100 }
    ]
  },
  {
    id: 'cardio-1',
    name: '30-Minute HIIT',
    date: new Date(),
    completed: false,
    category: 'hiit',
    exercises: [
      { id: 'ex9', name: 'Jumping Jacks', sets: 1, reps: 50 },
      { id: 'ex10', name: 'Mountain Climbers', sets: 1, reps: 40 },
      { id: 'ex11', name: 'Burpees', sets: 1, reps: 20 },
      { id: 'ex12', name: 'High Knees', sets: 1, reps: 60 }
    ]
  },
  {
    id: 'core-1',
    name: 'Core Crusher',
    date: new Date(),
    completed: false,
    category: 'strength',
    exercises: [
      { id: 'ex13', name: 'Planks', sets: 3, reps: 1, notes: 'Hold for 60 seconds' },
      { id: 'ex14', name: 'Russian Twists', sets: 3, reps: 20, weight: 15 },
      { id: 'ex15', name: 'Leg Raises', sets: 3, reps: 15 },
      { id: 'ex16', name: 'Ab Rollouts', sets: 3, reps: 12 }
    ]
  },
  {
    id: 'stretch-1',
    name: 'Full Body Stretch',
    date: new Date(),
    completed: false,
    category: 'flexibility',
    exercises: [
      { id: 'ex17', name: 'Hamstring Stretch', sets: 1, reps: 1, notes: 'Hold for 30 seconds each leg' },
      { id: 'ex18', name: 'Shoulder Stretch', sets: 1, reps: 1, notes: 'Hold for 30 seconds each side' },
      { id: 'ex19', name: 'Quad Stretch', sets: 1, reps: 1, notes: 'Hold for 30 seconds each leg' },
      { id: 'ex20', name: 'Hip Flexor Stretch', sets: 1, reps: 1, notes: 'Hold for 30 seconds each side' }
    ]
  }
];

const WorkoutLibrary = () => {
  const [userWorkouts, setUserWorkouts] = useState<Workout[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load user's saved workouts from localStorage
  useEffect(() => {
    const storedWorkouts = localStorage.getItem('workouts');
    if (storedWorkouts) {
      const parsedWorkouts = JSON.parse(storedWorkouts).map((workout: any) => ({
        ...workout,
        date: new Date(workout.date)
      }));
      setUserWorkouts(parsedWorkouts);
    }
  }, []);

  // Filter workouts based on search term and category
  const filteredPredefinedWorkouts = predefinedWorkouts.filter(workout => {
    const matchesSearch = workout.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || workout.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredUserWorkouts = userWorkouts.filter(workout => {
    return workout.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSelectWorkout = (workout: Workout) => {
    const today = new Date();
    const workoutToAdd = {
      ...workout,
      id: crypto.randomUUID(),
      date: today
    };

    const updatedWorkouts = [...userWorkouts, workoutToAdd];
    localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
    setUserWorkouts(updatedWorkouts);

    toast({
      title: "Workout Added",
      description: `${workout.name} has been added to today's schedule.`,
    });

    navigate('/workouts');
  };

  const handleCreateWorkout = () => {
    navigate('/workouts');
    // You could also navigate to a specific "create workout" mode
    // by passing state or query parameters
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 mt-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Dumbbell className="mr-2 h-8 w-8" />
              Workout Library
            </h1>
            <p className="text-muted-foreground">
              Browse pre-designed workouts or create your own
            </p>
          </div>
          <Button onClick={handleCreateWorkout} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Custom Workout
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 space-y-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search workouts..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <h3 className="font-medium mb-2">Categories</h3>
              <div className="space-y-1">
                {workoutCategories.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Workout List */}
          <div className="flex-1">
            <Tabs defaultValue="suggested">
              <TabsList className="mb-4">
                <TabsTrigger value="suggested">Suggested Workouts</TabsTrigger>
                <TabsTrigger value="my-workouts">My Workouts ({userWorkouts.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="suggested" className="space-y-4">
                {filteredPredefinedWorkouts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPredefinedWorkouts.map(workout => (
                      <Card key={workout.id} className="h-full flex flex-col">
                        <CardHeader>
                          <CardTitle>{workout.name}</CardTitle>
                          <CardDescription>
                            {workout.exercises.length} exercises
                          </CardDescription>
                          <Badge className="w-fit">{workout.category}</Badge>
                        </CardHeader>
                        <CardContent className="flex-1">
                          <h4 className="font-medium mb-2">Exercises:</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            {workout.exercises.slice(0, 3).map(exercise => (
                              <li key={exercise.id}>
                                {exercise.name}: {exercise.sets} sets x {exercise.reps} reps
                              </li>
                            ))}
                            {workout.exercises.length > 3 && (
                              <li className="text-muted-foreground">
                                +{workout.exercises.length - 3} more
                              </li>
                            )}
                          </ul>
                        </CardContent>
                        <CardFooter>
                          <Button
                            onClick={() => handleSelectWorkout(workout)}
                            className="w-full"
                          >
                            Add to Calendar
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 bg-muted/50 rounded-lg">
                    <p className="text-muted-foreground">No workouts match your search criteria</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="my-workouts">
                {filteredUserWorkouts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredUserWorkouts.map(workout => (
                      <Card key={workout.id} className="h-full flex flex-col">
                        <CardHeader>
                          <CardTitle>{workout.name}</CardTitle>
                          <CardDescription>
                            {workout.exercises.length} exercises
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                          <h4 className="font-medium mb-2">Exercises:</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            {workout.exercises.slice(0, 3).map(exercise => (
                              <li key={exercise.id}>
                                {exercise.name}: {exercise.sets} sets x {exercise.reps} reps
                              </li>
                            ))}
                            {workout.exercises.length > 3 && (
                              <li className="text-muted-foreground">
                                +{workout.exercises.length - 3} more
                              </li>
                            )}
                          </ul>
                        </CardContent>
                        <CardFooter>
                          <Button
                            onClick={() => handleSelectWorkout(workout)}
                            className="w-full"
                          >
                            Add to Calendar
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 bg-muted/50 rounded-lg">
                    <p className="text-muted-foreground mb-4">You haven't created any workouts yet</p>
                    <Button onClick={handleCreateWorkout}>Create Your First Workout</Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WorkoutLibrary;


import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Header } from "@/components/Header";
import Footer from '@/components/Footer';
import WorkoutForm from '@/components/WorkoutForm';
import WorkoutList from '@/components/WorkoutList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Exercise } from '@/pages/WorkoutDetail';

export type Workout = {
  id: string;
  date: Date;
  name: string;
  exercises: Exercise[];
  category?: string; // Added category field
};

const Workouts = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isAddingWorkout, setIsAddingWorkout] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load workouts from localStorage on component mount
  useEffect(() => {
    const storedWorkouts = localStorage.getItem('workouts');
    if (storedWorkouts) {
      try {
        const parsedWorkouts = JSON.parse(storedWorkouts).map((workout: any) => {
          const workoutDate = new Date(workout.date);
          // Remove completed property from loaded workouts
          const { completed, ...workoutWithoutCompleted } = workout;
          return {
            ...workoutWithoutCompleted,
            date: workoutDate
          };
        });
        setWorkouts(parsedWorkouts);
      } catch (error) {
        console.error('Error parsing workouts:', error);
      }
    }
  }, []);

  // Save workouts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);

  // Filtered workouts for the selected date
  const selectedDateWorkouts = workouts.filter(
    workout => format(new Date(workout.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  // Calendar date with workout indicator
  const workoutDates = workouts.map(workout => new Date(workout.date));
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setIsAddingWorkout(false);
      setEditingWorkout(null);
    }
  };

  const handleAddWorkout = (workout: Omit<Workout, 'id'>) => {
    const newWorkout = {
      ...workout,
      id: crypto.randomUUID(),
      date: selectedDate
    };

    setWorkouts([...workouts, newWorkout as Workout]);
    setIsAddingWorkout(false);
    toast({
      title: "Workout Added",
      description: `${workout.name} has been added to your calendar.`,
    });
  };

  const handleEditWorkout = (updatedWorkout: Workout) => {
    setWorkouts(
      workouts.map(workout => 
        workout.id === updatedWorkout.id ? updatedWorkout : workout
      )
    );
    setEditingWorkout(null);
    toast({
      title: "Workout Updated",
      description: `${updatedWorkout.name} has been updated.`,
    });
  };

  const handleDeleteWorkout = (workoutId: string) => {
    const workoutToDelete = workouts.find(w => w.id === workoutId);
    setWorkouts(workouts.filter(workout => workout.id !== workoutId));
    toast({
      title: "Workout Deleted",
      description: workoutToDelete ? `${workoutToDelete.name} has been removed.` : "Workout has been removed.",
      variant: "destructive",
    });
  };

  const handleViewWorkoutDetails = (workoutId: string) => {
    navigate(`/workouts/${workoutId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 mt-20">
        <h1 className="text-3xl font-bold mb-6">Workout Calendar</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 col-span-1 shadow-md flex flex-col items-center">
            <div className="w-full flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-md"
                modifiers={{
                  workout: workoutDates,
                }}
                modifiersClassNames={{
                  workout: "bg-primary/10 text-primary font-medium border border-primary/20",
                }}
              />
            </div>
          </Card>

          <Card className="p-4 col-span-1 md:col-span-2 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">
                {format(selectedDate, 'MMMM d, yyyy')}
              </h2>
              {!isAddingWorkout && !editingWorkout && (
                <Button 
                  onClick={() => setIsAddingWorkout(true)} 
                  className="flex items-center gap-1"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Workout
                </Button>
              )}
            </div>

            <Tabs defaultValue="workouts" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="workouts">Workouts</TabsTrigger>
                <TabsTrigger value="manage" disabled={!isAddingWorkout && !editingWorkout}>
                  {editingWorkout ? 'Edit Workout' : isAddingWorkout ? 'Add Workout' : 'Manage'}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="workouts" className="space-y-4">
                {selectedDateWorkouts.length > 0 ? (
                  <WorkoutList 
                    workouts={selectedDateWorkouts} 
                    onEdit={setEditingWorkout}
                    onDelete={handleDeleteWorkout}
                    onView={handleViewWorkoutDetails}
                  />
                ) : (
                  <div className="text-center p-8 bg-secondary/20 rounded-lg">
                    <p className="text-muted-foreground mb-4">No workouts scheduled for this day</p>
                    {!isAddingWorkout && (
                      <Button 
                        onClick={() => setIsAddingWorkout(true)}
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <PlusCircle className="h-4 w-4" />
                        Add Workout
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="manage">
                {(isAddingWorkout || editingWorkout) && (
                  <WorkoutForm 
                    initialWorkout={editingWorkout || undefined}
                    onSubmit={editingWorkout ? handleEditWorkout : handleAddWorkout}
                    onCancel={() => {
                      setIsAddingWorkout(false);
                      setEditingWorkout(null);
                    }}
                  />
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Workouts;

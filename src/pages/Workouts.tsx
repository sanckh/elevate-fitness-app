import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Header } from "@/components/Header";
import { Footer } from '@/components/Footer';
import WorkoutForm from '@/components/WorkoutForm';
import WorkoutList from '@/components/WorkoutList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, FolderPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Workout } from '@/interfaces/workout';
import WorkoutSelectionDialog from '@/components/WorkoutSelectionDialog';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { saveWorkout,deleteWorkout } from '@/api/workout';

const Workouts = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isAddingWorkout, setIsAddingWorkout] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [workoutDialogOpen, setWorkoutDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (user?.uid) {
        try {
          const response = await axios.get(`http://localhost:3000/api/workout/get/${user.uid}`);
          const fetchedWorkouts = response.data.map((workout: Workout) => ({
            ...workout,
            date: new Date(workout.date), // Ensure the date is a Date object
          }));
          setWorkouts(fetchedWorkouts);
        } catch (error) {
          console.error('Error fetching workouts:', error);
          toast({
            title: 'Error',
            description: 'Failed to fetch workouts',
            variant: 'destructive',
          });
        }
      }
    };

    fetchWorkouts();
  }, [user]);

  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);

  const selectedDateWorkouts = workouts.filter(
    workout => format(new Date(workout.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  const workoutDates = workouts.map(workout => new Date(workout.date));

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setIsAddingWorkout(false);
      setEditingWorkout(null);
    }
  };

  const handleSelectWorkout = (selectedWorkout: Workout) => {
    const newWorkout = {
      ...selectedWorkout,
      id: crypto.randomUUID(),
      date: selectedDate,
      userId: user.uid
    };

    const payload={
      workout:newWorkout
    }

     //Save to database
     saveWorkout(payload)
    
    setWorkouts([...workouts, newWorkout]);
    
    toast({
      title: "Workout Added",
      description: `${selectedWorkout.name} has been added to your calendar.`,
    });
    
    setWorkoutDialogOpen(false);
  };

  const handleCreateNewWorkout = () => {
    navigate('/exercise-search');
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
     //Delete from database
     deleteWorkout(workoutId);

     //update the local storage
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
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => setWorkoutDialogOpen(true)} 
                    className="flex items-center gap-1"
                  >
                    <FolderPlus className="h-4 w-4" />
                    Add Existing
                  </Button>
                  <Button 
                    onClick={handleCreateNewWorkout} 
                    className="flex items-center gap-1"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Create New
                  </Button>
                </div>
              )}
            </div>

            <Tabs defaultValue="workouts" className="w-full">
              <TabsList className="grid w-full grid-cols-1 mb-4">
                <TabsTrigger value="workouts">Workouts</TabsTrigger>
                {/* <TabsTrigger value="manage" disabled={!isAddingWorkout && !editingWorkout}>
                  {editingWorkout ? 'Edit Workout' : isAddingWorkout ? 'Add Workout' : 'Manage'}
                </TabsTrigger> */}
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
                      <div className="flex flex-col sm:flex-row justify-center gap-3">
                        <Button 
                          onClick={() => setWorkoutDialogOpen(true)}
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <FolderPlus className="h-4 w-4" />
                          Add Existing Workout
                        </Button>
                        <Button 
                          onClick={handleCreateNewWorkout}
                          className="flex items-center gap-1"
                        >
                          <PlusCircle className="h-4 w-4" />
                          Create New Workout
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
              
              {/* <TabsContent value="manage">
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
              </TabsContent> */}
            </Tabs>
          </Card>
        </div>
        
        <WorkoutSelectionDialog 
          open={workoutDialogOpen}
          onOpenChange={setWorkoutDialogOpen}
          onSelectWorkout={handleSelectWorkout}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Workouts;

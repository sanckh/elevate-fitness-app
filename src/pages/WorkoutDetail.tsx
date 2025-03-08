import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Location } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Edit, Trash2, Save, X, History, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Header } from "@/components/Header";
import { Footer } from '@/components/Footer';
import WorkoutForm from '@/components/WorkoutForm';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import ExerciseSetList from '@/components/ExerciseSetList';
import WorkoutSelectionDialog from '@/components/WorkoutSelectionDialog';
import { LocationState } from '@/interfaces/locationState';
import { Exercise } from '@/interfaces/exercise';
import { Workout } from '@/interfaces/workout';
import { ExerciseSet } from '@/interfaces/exercise';

const WorkoutDetail = () => {
  const { workoutId, date } = useParams();
  const navigate = useNavigate();
  const location = useLocation() as Location & { state: LocationState };
  const { toast } = useToast();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [allWorkouts, setAllWorkouts] = useState<Workout[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [dateFormatted, setDateFormatted] = useState<string>('');
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [editedExercise, setEditedExercise] = useState<Exercise | null>(null);
  const [workoutDialogOpen, setWorkoutDialogOpen] = useState(false);
  
  useEffect(() => {
    const storedWorkouts = localStorage.getItem('workouts');
    if (storedWorkouts) {
      try {
        const parsedWorkouts = JSON.parse(storedWorkouts).map((w: Workout) => {
          const workoutDate = new Date(w.date);
          // Remove completed property if it exists
          const { completed, ...workoutWithoutCompleted } = w;
          return {
            ...workoutWithoutCompleted,
            date: workoutDate
          };
        });
        
        const updatedWorkouts = parsedWorkouts.map((w: Workout) => {
          const workoutDate = new Date(w.date);
          const updatedExercises = w.exercises.map((ex: Exercise) => {
            if (typeof ex.sets === 'number' && !Array.isArray(ex.sets)) {
              const newSets: ExerciseSet[] = [];
              for (let i = 0; i < ex.sets; i++) {
                newSets.push({
                  id: crypto.randomUUID(),
                  reps: ex.reps || 10,
                  weight: ex.weight,
                });
              }
              return {
                ...ex,
                sets: newSets,
              };
            }
            return {
              ...ex,
              sets: Array.isArray(ex.sets) ? ex.sets : []
            };
          });
          
          return {
            ...w,
            date: workoutDate,
            exercises: updatedExercises
          };
        });
        
        setAllWorkouts(updatedWorkouts);
        
        if (workoutId) {
          const foundWorkout = updatedWorkouts.find((w: Workout) => w.id === workoutId);
          if (foundWorkout) {
            setWorkout(foundWorkout);
            setDateFormatted(format(new Date(foundWorkout.date), 'MMMM d, yyyy'));
          }
        } else if (date) {
          const targetDate = new Date(date);
          setDateFormatted(format(targetDate, 'MMMM d, yyyy'));
          
          const workoutsForDate = updatedWorkouts.filter((w: Workout) => 
            format(new Date(w.date), 'yyyy-MM-dd') === format(targetDate, 'yyyy-MM-dd')
          );
          
          if (workoutsForDate.length > 0) {
            setWorkout(workoutsForDate[0]);
          }
        }
        
        localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
      } catch (error) {
        console.error("Error parsing workouts:", error);
        toast({
          title: "Error",
          description: "Failed to load workout data",
          variant: "destructive",
        });
      }
    }
  }, [workoutId, date, toast]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleBack = () => {
    // Check if we came from workout-library
    if (location.state?.from === 'workout-library') {
      navigate('/workout-library');
    } else {
      navigate('/workouts');
    }
  };

  const handleDelete = () => {
    if (!workout) return;
    
    const updatedWorkouts = allWorkouts.filter(w => w.id !== workout.id);
    localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
    
    toast({
      title: "Workout Deleted",
      description: `${workout.name} has been removed.`,
      variant: "destructive",
    });
    
    navigate('/workouts');
  };

  const handleUpdateWorkout = (updatedWorkout: Workout) => {
    const newWorkouts = allWorkouts.map(w => 
      w.id === updatedWorkout.id ? updatedWorkout : w
    );
    
    localStorage.setItem('workouts', JSON.stringify(newWorkouts));
    setWorkout(updatedWorkout);
    setAllWorkouts(newWorkouts);
    setIsEditing(false);
    
    toast({
      title: "Workout Updated",
      description: `${updatedWorkout.name} has been updated.`,
    });
  };

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExerciseId(exercise.id);
    setEditedExercise({...exercise});
  };

  const handleCancelEditExercise = () => {
    setEditingExerciseId(null);
    setEditedExercise(null);
  };

  const handleExerciseFieldChange = (field: keyof Exercise, value: any) => {
    if (!editedExercise) return;
    setEditedExercise({...editedExercise, [field]: value});
  };

  const handleSetsChange = (exerciseId: string, newSets: ExerciseSet[]) => {
    if (!workout) return;
    
    const updatedExercises = workout.exercises.map(ex => {
      if (ex.id === exerciseId) {
        return { ...ex, sets: newSets };
      }
      return ex;
    });
    
    const updatedWorkout = { ...workout, exercises: updatedExercises };
    const updatedWorkouts = allWorkouts.map(w => 
      w.id === workout.id ? updatedWorkout : w
    );
    
    localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
    setWorkout(updatedWorkout);
    setAllWorkouts(updatedWorkouts);
    
    toast({
      title: "Sets Updated",
      description: "Exercise sets have been updated.",
    });
  };

  const handleSaveExercise = () => {
    if (!workout || !editedExercise) return;

    const updatedExercises = workout.exercises.map(ex => 
      ex.id === editingExerciseId ? editedExercise : ex
    );

    const updatedWorkout = {...workout, exercises: updatedExercises};
    const updatedWorkouts = allWorkouts.map(w => 
      w.id === workout.id ? updatedWorkout : w
    );
    
    localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
    setWorkout(updatedWorkout);
    setAllWorkouts(updatedWorkouts);
    setEditingExerciseId(null);
    setEditedExercise(null);

    toast({
      title: "Exercise Updated",
      description: `${editedExercise.name} has been updated.`,
    });
  };

  const calculateExerciseVolume = (exercise: Exercise) => {
    return exercise.sets.reduce((total, set) => {
      return total + (set.reps * (set.weight || 0));
    }, 0);
  };

  const getTotalSets = (exercises: Exercise[]) => {
    return exercises.reduce((total, ex) => total + ex.sets.length, 0);
  };

  const handleSelectWorkout = (selectedWorkout: Workout) => {
    const newWorkout = {
      ...selectedWorkout,
      id: crypto.randomUUID(),
      date: new Date()
    };
    
    setAllWorkouts([...allWorkouts, newWorkout]);
    setWorkout(newWorkout);
    
    toast({
      title: "Workout Added",
      description: `${selectedWorkout.name} has been added to your calendar.`,
    });
  };

  if (isEditing && workout) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 mt-20">
          <Button 
            variant="outline" 
            className="mb-6" 
            onClick={() => setIsEditing(false)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Workout
          </Button>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Edit Workout</h1>
            <WorkoutForm 
              initialWorkout={workout}
              onSubmit={handleUpdateWorkout}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 mt-20">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Calendar
          </Button>
          <Link to="/workouts" className="ml-auto flex items-center text-sm text-muted-foreground hover:text-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            View Calendar
          </Link>
        </div>
        
        {workout ? (
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-md">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      {workout.name}
                    </CardTitle>
                    <CardDescription>
                      {dateFormatted} • {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''} • {getTotalSets(workout.exercises)} total sets
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleEdit}
                      className="h-9 w-9 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleDelete}
                      className="h-9 w-9 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-lg mb-4">Exercises</h3>
                <div className="space-y-6">
                  {workout.exercises.map((exercise, index) => (
                    <div key={exercise.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xl font-medium">{exercise.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-sm">Exercise {index + 1}</span>
                          {editingExerciseId === exercise.id ? (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={handleSaveExercise}
                                className="h-8 w-8 p-0"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={handleCancelEditExercise}
                                className="h-8 w-8 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditExercise(exercise)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <Separator className="my-3" />
                      
                      <div className="mt-4">
                        {editingExerciseId === exercise.id ? (
                          <ExerciseSetList 
                            sets={editedExercise?.sets || []}
                            onSetsChange={(newSets) => handleExerciseFieldChange('sets', newSets)}
                          />
                        ) : (
                          <ExerciseSetList 
                            sets={exercise.sets} 
                            onSetsChange={(newSets) => handleSetsChange(exercise.id, newSets)}
                          />
                        )}
                      </div>
                      
                      {exercise.sets.some(set => set.weight) && (
                        <div className="mt-4 bg-secondary/10 rounded-md p-2 text-sm text-secondary-foreground">
                          <span className="font-medium">Volume:</span> {calculateExerciseVolume(exercise)} lbs
                        </div>
                      )}
                      
                      {(exercise.notes || editingExerciseId === exercise.id) && (
                        <div className="mt-4 bg-secondary/20 p-3 rounded-md">
                          <div className="text-sm text-muted-foreground mb-1">Notes</div>
                          {editingExerciseId === exercise.id ? (
                            <Input
                              value={editedExercise?.notes || ''}
                              onChange={(e) => handleExerciseFieldChange('notes', e.target.value)}
                              placeholder="Add notes here..."
                            />
                          ) : (
                            <div>{exercise.notes}</div>
                          )}
                        </div>
                      )}
                      
                      <div className="mt-4 flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/exercise/history/${encodeURIComponent(exercise.name)}`)}
                          className="flex items-center gap-2"
                        >
                          <History className="h-4 w-4" />
                          History
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/exercise/graph/${encodeURIComponent(exercise.name)}`)}
                          className="flex items-center gap-2"
                        >
                          <LineChart className="h-4 w-4" />
                          Graph
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Workout ID: {workout.id.substring(0, 8)}...
                </div>
                <Button onClick={handleEdit}>Edit Workout</Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <Card className="shadow-md max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>No Workout Found</CardTitle>
              <CardDescription>
                {dateFormatted ? `No workout scheduled for ${dateFormatted}` : 'The requested workout was not found.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 p-8">
              <p className="text-center text-muted-foreground mb-4">
                Would you like to add a workout for this day?
              </p>
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/workouts')}
                >
                  Return to Calendar
                </Button>
                <Button onClick={() => setWorkoutDialogOpen(true)}>
                  Add Workout
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
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

export default WorkoutDetail;

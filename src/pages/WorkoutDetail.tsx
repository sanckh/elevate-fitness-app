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
import { editWorkout, deleteWorkout, fetchWorkouts } from '@/api/workout';
import { useAuth } from '@/context/AuthContext';

const WorkoutDetail = () => {
  const { workoutId, date } = useParams();
  const navigate = useNavigate();
  const location = useLocation() as Location & { state: LocationState };
  const { toast } = useToast();
  const { user } = useAuth();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFormatted, setDateFormatted] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [editedExercise, setEditedExercise] = useState<Exercise | null>(null);
  const [workoutDialogOpen, setWorkoutDialogOpen] = useState(false);

  useEffect(() => {
    const loadWorkout = async () => {
      if (!user?.uid) return;
      setIsLoading(true);
      
      try {
        const workouts = await fetchWorkouts(user.uid);
        
        if (workoutId) {
          const foundWorkout = workouts.find(w => w.id === workoutId);
          if (foundWorkout) {
            setWorkout(foundWorkout);
            setDateFormatted(format(new Date(foundWorkout.date), 'MMMM d, yyyy'));
          } else {
            setWorkout(null);
          }
        } else if (date) {
          const targetDate = new Date(date);
          setDateFormatted(format(targetDate, 'MMMM d, yyyy'));
          
          const workoutsForDate = workouts.filter(w => 
            format(new Date(w.date), 'yyyy-MM-dd') === format(targetDate, 'yyyy-MM-dd')
          );
          
          if (workoutsForDate.length > 0) {
            setWorkout(workoutsForDate[0]);
          } else {
            setWorkout(null);
          }
        }
      } catch (error) {
        console.error('Error loading workout:', error);
        toast({
          title: "Error",
          description: "Failed to load workout. Please try again.",
          variant: "destructive",
        });
        setWorkout(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkout();
  }, [workoutId, date, user?.uid, toast]);

  useEffect(() => {
    if (!workout || !user?.uid) return;

    const currentWorkout = workout; 

    const refreshInterval = setInterval(async () => {
      try {
        const workouts = await fetchWorkouts(user.uid);
        const updatedWorkout = workouts.find(w => w.id === currentWorkout.id);
        if (updatedWorkout && JSON.stringify(updatedWorkout) !== JSON.stringify(currentWorkout)) {
          setWorkout(updatedWorkout);
        }
      } catch (error) {
        console.error('Error refreshing workout:', error);
      }
    }, 30000); 

    return () => clearInterval(refreshInterval);
  }, [workout?.id, user?.uid, workout]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleBack = () => {
    if (location.state?.from === 'workout-library') {
      navigate('/workout-library');
    } else {
      navigate('/workouts');
    }
  };

  const handleDelete = async () => {
    if (!workout) return;
    
    try {
      await deleteWorkout(workout.id);
      toast({
        title: "Workout Deleted",
        description: `${workout.name} has been removed.`,
        variant: "destructive",
      });
      navigate('/workouts');
    } catch (error) {
      console.error('Error deleting workout:', error);
      toast({
        title: "Error",
        description: "Failed to delete workout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateWorkout = async (updatedWorkout: Workout) => {
    try {
      const savedWorkout = await editWorkout({ workout: updatedWorkout });
      setWorkout(savedWorkout);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Workout updated successfully",
      });
    } catch (error) {
      console.error('Error updating workout:', error);
      toast({
        title: "Error",
        description: "Failed to update workout. Please try again.",
        variant: "destructive",
      });
    }
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

  const handleUpdateSets = async (exerciseId: string, newSets: ExerciseSet[]) => {
    if (!workout || !workout.exercises) return;

    const previousWorkout = { ...workout };

    const updatedWorkout: Workout = {
      ...workout,
      exercises: workout.exercises.map(ex =>
        ex.id === exerciseId
          ? { ...ex, sets: newSets }
          : ex
      )
    };

    setWorkout(updatedWorkout);

    try {
      const savedWorkout = await editWorkout({ workout: updatedWorkout });
      
      if (user?.uid) {
        const workouts = await fetchWorkouts(user.uid);
        const refreshedWorkout = workouts.find(w => w.id === workout.id);
        if (refreshedWorkout) {
          setWorkout(refreshedWorkout);
        }
      }

      toast({
        title: "Success",
        description: "Sets updated successfully",
      });
    } catch (error) {
      console.error('Error updating sets:', error);
      setWorkout(previousWorkout);
      toast({
        title: "Error",
        description: "Failed to update sets. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveExercise = async () => {
    if (!workout || !editedExercise) return;

    const previousWorkout = { ...workout };
    const previousEditingId = editingExerciseId;
    const previousEditedExercise = editedExercise;

    const updatedExercises = workout.exercises?.map(ex => 
      ex.id === editingExerciseId ? editedExercise : ex
    ) || [];

    const updatedWorkout: Workout = {
      ...workout,
      exercises: updatedExercises
    };

    setWorkout(updatedWorkout);
    setEditingExerciseId(null);
    setEditedExercise(null);

    try {
      const savedWorkout = await editWorkout({ workout: updatedWorkout });
      
      if (user?.uid) {
        const workouts = await fetchWorkouts(user.uid);
        const refreshedWorkout = workouts.find(w => w.id === workout.id);
        if (refreshedWorkout) {
          setWorkout(refreshedWorkout);
        }
      }

      toast({
        title: "Success",
        description: "Exercise updated successfully",
      });
    } catch (error) {
      console.error('Error updating exercise:', error);
      setWorkout(previousWorkout);
      setEditingExerciseId(previousEditingId);
      setEditedExercise(previousEditedExercise);
      toast({
        title: "Error",
        description: "Failed to update exercise. Please try again.",
        variant: "destructive",
      });
    }
  };

  const calculateExerciseVolume = (exercise: Exercise) => {
    return exercise.sets.reduce((total, set) => {
      return total + (set.reps * (set.weight || 0));
    }, 0);
  };

  const getTotalSets = (exercises: Exercise[] | null | undefined) => {
    if (!exercises) return 0;
    return exercises.reduce((total, ex) => total + (ex.sets?.length || 0), 0);
  };

  const handleSelectWorkout = async (selectedWorkout: Workout) => {
    const newWorkout = {
      ...selectedWorkout,
      id: crypto.randomUUID(),
      date: new Date()
    };

    try {
      const savedWorkout = await editWorkout({ workout: newWorkout });
      setWorkout(savedWorkout);
      toast({
        title: "Workout Added",
        description: `${selectedWorkout.name} has been added to your calendar.`,
      });
    } catch (error) {
      console.error('Error adding workout:', error);
      toast({
        title: "Error",
        description: "Failed to add workout. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto p-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Loading Workout...</h1>
        </div>
        <Card className="shadow-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mb-4" />
            <p className="text-muted-foreground">Loading workout details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="container max-w-4xl mx-auto p-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Workout Not Found</h1>
        </div>
        <Card className="shadow-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <p className="text-muted-foreground mb-4">No workout found for {dateFormatted || 'this date'}.</p>
            <Button onClick={() => navigate('/workouts')}>Return to Calendar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isEditing) {
    return (
      <WorkoutForm 
        initialWorkout={workout}
        onSubmit={handleUpdateWorkout}
        onCancel={() => setIsEditing(false)}
      />
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
        
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-md">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    {workout.name}
                  </CardTitle>
                  <CardDescription>
                    {dateFormatted} • {workout.exercises?.length || 0} exercise{(workout.exercises?.length || 0) !== 1 ? 's' : ''} • {getTotalSets(workout.exercises)} total sets
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
                {workout.exercises?.map((exercise, index) => (
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
                          onSetsChange={(newSets) => handleUpdateSets(exercise.id, newSets)}
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
                {workout?.id ? `Workout ID: ${workout.id.substring(0, 8)}...` : 'Loading...'}
              </div>
              <Button onClick={handleEdit}>Edit Workout</Button>
            </CardFooter>
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

export default WorkoutDetail;

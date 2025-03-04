
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, CheckCircle, Edit, Trash2 } from 'lucide-react';
import { Workout, Exercise } from '@/pages/Workouts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WorkoutForm from '@/components/WorkoutForm';
import { Link } from 'react-router-dom';

const WorkoutDetail = () => {
  const { workoutId, date } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [allWorkouts, setAllWorkouts] = useState<Workout[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [dateFormatted, setDateFormatted] = useState<string>('');
  
  // Fetch workouts from localStorage
  useEffect(() => {
    const storedWorkouts = localStorage.getItem('workouts');
    if (storedWorkouts) {
      const parsedWorkouts = JSON.parse(storedWorkouts).map((w: any) => ({
        ...w,
        date: new Date(w.date)
      }));
      setAllWorkouts(parsedWorkouts);
      
      // Find the specific workout based on ID or date
      if (workoutId) {
        const foundWorkout = parsedWorkouts.find((w: Workout) => w.id === workoutId);
        if (foundWorkout) {
          setWorkout(foundWorkout);
          setDateFormatted(format(new Date(foundWorkout.date), 'MMMM d, yyyy'));
        }
      } else if (date) {
        const targetDate = new Date(date);
        setDateFormatted(format(targetDate, 'MMMM d, yyyy'));
        
        // Find workouts for this specific date
        const workoutsForDate = parsedWorkouts.filter((w: Workout) => 
          format(new Date(w.date), 'yyyy-MM-dd') === format(targetDate, 'yyyy-MM-dd')
        );
        
        if (workoutsForDate.length > 0) {
          setWorkout(workoutsForDate[0]); // Show the first workout for this date
        }
      }
    }
  }, [workoutId, date]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleBack = () => {
    navigate('/workouts');
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

  const handleToggleComplete = () => {
    if (!workout) return;
    
    const updatedWorkout = { ...workout, completed: !workout.completed };
    const updatedWorkouts = allWorkouts.map(w => 
      w.id === workout.id ? updatedWorkout : w
    );
    
    localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
    setWorkout(updatedWorkout);
    setAllWorkouts(updatedWorkouts);
    
    toast({
      title: updatedWorkout.completed ? "Workout Completed" : "Workout Marked Incomplete",
      description: `${workout.name} has been ${updatedWorkout.completed ? 'marked as completed' : 'marked as incomplete'}.`
    });
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
                      {workout.completed && (
                        <Badge variant="outline" className="bg-primary/20 text-primary border-primary/20">
                          Completed
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {dateFormatted} • {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleToggleComplete}
                      title={workout.completed ? "Mark as incomplete" : "Mark as completed"}
                      className="h-9 w-9 p-0"
                    >
                      <CheckCircle className={`h-4 w-4 ${workout.completed ? 'text-primary fill-primary' : ''}`} />
                    </Button>
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
                        <span className="text-muted-foreground text-sm">Exercise {index + 1}</span>
                      </div>
                      
                      <Separator className="my-3" />
                      
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="bg-muted/50 rounded-md p-3 text-center">
                          <div className="text-sm text-muted-foreground mb-1">Sets</div>
                          <div className="font-semibold text-lg">{exercise.sets}</div>
                        </div>
                        <div className="bg-muted/50 rounded-md p-3 text-center">
                          <div className="text-sm text-muted-foreground mb-1">Reps</div>
                          <div className="font-semibold text-lg">{exercise.reps}</div>
                        </div>
                        <div className="bg-muted/50 rounded-md p-3 text-center">
                          <div className="text-sm text-muted-foreground mb-1">Weight</div>
                          <div className="font-semibold text-lg">
                            {exercise.weight ? `${exercise.weight} lbs` : 'N/A'}
                          </div>
                        </div>
                      </div>
                      
                      {exercise.notes && (
                        <div className="mt-4 bg-secondary/20 p-3 rounded-md">
                          <div className="text-sm text-muted-foreground mb-1">Notes</div>
                          <div>{exercise.notes}</div>
                        </div>
                      )}
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
            <CardContent className="flex justify-center p-8">
              <Button onClick={() => navigate('/workouts')}>
                Return to Workout Calendar
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default WorkoutDetail;

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, CheckCircle, Edit, Trash2, Save, X } from 'lucide-react';
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
import { Input } from '@/components/ui/input';

const WorkoutDetail = () => {
  const { workoutId, date } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [allWorkouts, setAllWorkouts] = useState<Workout[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [dateFormatted, setDateFormatted] = useState<string>('');
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [editedExercise, setEditedExercise] = useState<Exercise | null>(null);
  
  const [editingSets, setEditingSets] = useState<string | null>(null);
  const [editingReps, setEditingReps] = useState<string | null>(null);
  const [editingWeight, setEditingWeight] = useState<string | null>(null);
  const [tempSetValue, setTempSetValue] = useState<string>('');
  const [tempRepValue, setTempRepValue] = useState<string>('');
  const [tempWeightValue, setTempWeightValue] = useState<string>('');
  
  useEffect(() => {
    const storedWorkouts = localStorage.getItem('workouts');
    if (storedWorkouts) {
      const parsedWorkouts = JSON.parse(storedWorkouts).map((w: any) => ({
        ...w,
        date: new Date(w.date)
      }));
      setAllWorkouts(parsedWorkouts);
      
      if (workoutId) {
        const foundWorkout = parsedWorkouts.find((w: Workout) => w.id === workoutId);
        if (foundWorkout) {
          setWorkout(foundWorkout);
          setDateFormatted(format(new Date(foundWorkout.date), 'MMMM d, yyyy'));
        }
      } else if (date) {
        const targetDate = new Date(date);
        setDateFormatted(format(targetDate, 'MMMM d, yyyy'));
        
        const workoutsForDate = parsedWorkouts.filter((w: Workout) => 
          format(new Date(w.date), 'yyyy-MM-dd') === format(targetDate, 'yyyy-MM-dd')
        );
        
        if (workoutsForDate.length > 0) {
          setWorkout(workoutsForDate[0]);
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

  const startEditingField = (exerciseId: string, field: 'sets' | 'reps' | 'weight', currentValue: any) => {
    if (field === 'sets') {
      setEditingSets(exerciseId);
      setTempSetValue(currentValue?.toString() || '');
    } else if (field === 'reps') {
      setEditingReps(exerciseId);
      setTempRepValue(currentValue?.toString() || '');
    } else if (field === 'weight') {
      setEditingWeight(exerciseId);
      setTempWeightValue(currentValue?.toString() || '');
    }
  };

  const saveEditedField = (exerciseId: string, field: 'sets' | 'reps' | 'weight') => {
    if (!workout) return;
    
    let tempValue = '';
    if (field === 'sets') tempValue = tempSetValue;
    else if (field === 'reps') tempValue = tempRepValue;
    else if (field === 'weight') tempValue = tempWeightValue;
    
    const updatedExercises = workout.exercises.map(ex => {
      if (ex.id === exerciseId) {
        let value: any = tempValue;
        if (field === 'sets' || field === 'reps') {
          value = parseInt(tempValue) || 1;
        } else if (field === 'weight') {
          value = tempValue ? parseInt(tempValue) : undefined;
        }
        return { ...ex, [field]: value };
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
    
    cancelFieldEditing();
    
    toast({
      title: "Exercise Updated",
      description: `Exercise ${field} has been updated.`,
    });
  };

  const cancelFieldEditing = () => {
    setEditingSets(null);
    setEditingReps(null);
    setEditingWeight(null);
    setTempSetValue('');
    setTempRepValue('');
    setTempWeightValue('');
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
                      
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="bg-muted/50 rounded-md p-3 text-center cursor-pointer" onClick={() => startEditingField(exercise.id, 'sets', exercise.sets)}>
                          <div className="text-sm text-muted-foreground mb-1">Sets</div>
                          {editingSets === exercise.id ? (
                            <div className="flex items-center justify-center">
                              <Input
                                type="number"
                                min="1"
                                value={tempSetValue}
                                onChange={(e) => setTempSetValue(e.target.value)}
                                className="h-8 text-center font-semibold w-16"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveEditedField(exercise.id, 'sets');
                                  if (e.key === 'Escape') cancelFieldEditing();
                                }}
                              />
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => saveEditedField(exercise.id, 'sets')}
                                className="h-8 p-0 ml-1"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={cancelFieldEditing}
                                className="h-8 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="font-semibold text-lg hover:bg-muted/80 rounded-md transition-colors">
                              {exercise.sets}
                            </div>
                          )}
                        </div>
                        <div className="bg-muted/50 rounded-md p-3 text-center cursor-pointer" onClick={() => startEditingField(exercise.id, 'reps', exercise.reps)}>
                          <div className="text-sm text-muted-foreground mb-1">Reps</div>
                          {editingReps === exercise.id ? (
                            <div className="flex items-center justify-center">
                              <Input
                                type="number"
                                min="1"
                                value={tempRepValue}
                                onChange={(e) => setTempRepValue(e.target.value)}
                                className="h-8 text-center font-semibold w-16"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveEditedField(exercise.id, 'reps');
                                  if (e.key === 'Escape') cancelFieldEditing();
                                }}
                              />
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => saveEditedField(exercise.id, 'reps')}
                                className="h-8 p-0 ml-1"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={cancelFieldEditing}
                                className="h-8 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="font-semibold text-lg hover:bg-muted/80 rounded-md transition-colors">
                              {exercise.reps}
                            </div>
                          )}
                        </div>
                        <div className="bg-muted/50 rounded-md p-3 text-center cursor-pointer" onClick={() => startEditingField(exercise.id, 'weight', exercise.weight || '')}>
                          <div className="text-sm text-muted-foreground mb-1">Weight</div>
                          {editingWeight === exercise.id ? (
                            <div className="flex items-center justify-center">
                              <Input
                                type="number"
                                min="0"
                                step="5"
                                value={tempWeightValue}
                                onChange={(e) => setTempWeightValue(e.target.value)}
                                className="h-8 text-center font-semibold w-16"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveEditedField(exercise.id, 'weight');
                                  if (e.key === 'Escape') cancelFieldEditing();
                                }}
                              />
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => saveEditedField(exercise.id, 'weight')}
                                className="h-8 p-0 ml-1"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={cancelFieldEditing}
                                className="h-8 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="font-semibold text-lg hover:bg-muted/80 rounded-md transition-colors">
                              {exercise.weight ? `${exercise.weight} lbs` : 'N/A'}
                            </div>
                          )}
                        </div>
                      </div>
                      
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


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Plus, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from "@/components/Header";
import { Footer } from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Exercise } from '@/interfaces/exercise';
import { Workout } from '@/interfaces/workout';
import { ExerciseSet } from '@/interfaces/exercise';
import ExerciseSetList from '@/components/ExerciseSetList';
import { getExercisesByName } from '@/api/exercisedbapi';

const ExerciseSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await getExercisesByName(searchQuery);
      
      setSearchResults(response.slice(0, 10));
    } catch (error) {
      console.error('Error searching exercises:', error);
      toast({
        title: "Error",
        description: "Failed to search exercises. Please try again.",
        variant: "destructive",
      });

    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExercise = (exercise: Exercise) => {
    const newExercise: Exercise = {
      id: crypto.randomUUID(),
      name: exercise.name,
      sets: [
        {
          id: crypto.randomUUID(),
          reps: 10,
          weight: undefined
        }
      ]
    };
    
    setSelectedExercises([...selectedExercises, newExercise]);
    
    toast({
      title: "Exercise Added",
      description: `${exercise.name} has been added to your workout.`,
    });
  };

  const handleRemoveExercise = (id: string) => {
    setSelectedExercises(selectedExercises.filter(ex => ex.id !== id));
  };

  const handleUpdateSets = (exerciseId: string, newSets: ExerciseSet[]) => {
    setSelectedExercises(
      selectedExercises.map(ex => 
        ex.id === exerciseId 
          ? { ...ex, sets: newSets } 
          : ex
      )
    );
  };

  const handleSaveWorkout = () => {
    if (!workoutName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a workout name",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedExercises.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one exercise",
        variant: "destructive",
      });
      return;
    }
    
    const newWorkout: Omit<Workout, 'id'> = {
      name: workoutName,
      date: new Date(),
      exercises: selectedExercises,
    };
    
    const storedWorkouts = localStorage.getItem('workouts');
    let workouts: Workout[] = [];
    
    if (storedWorkouts) {
      try {
        workouts = JSON.parse(storedWorkouts);
      } catch (error) {
        console.error('Error parsing workouts:', error);
      }
    }
    
    const workoutWithId = {
      ...newWorkout,
      id: crypto.randomUUID()
    };
    
    workouts.push(workoutWithId);
    localStorage.setItem('workouts', JSON.stringify(workouts));
    
    toast({
      title: "Workout Saved",
      description: `${workoutName} has been saved to your workouts.`,
    });
    
    navigate('/workouts');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 mt-20">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-md mb-6">
            <CardHeader>
              <CardTitle>Create New Workout</CardTitle>
              <CardDescription>
                Search for exercises and build your custom workout
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="workout-name">Workout Name</Label>
                  <Input
                    id="workout-name"
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                    placeholder="e.g., Upper Body, Leg Day, etc."
                    className="mt-1"
                  />
                </div>
                
                <div className="pt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Label htmlFor="search" className="flex-none">Search Exercises</Label>
                    <div className="flex-1 flex gap-2">
                      <Input
                        id="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="e.g., bench press, squat, etc."
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      />
                      <Button 
                        onClick={handleSearch} 
                        disabled={isLoading}
                        className="flex items-center gap-1"
                      >
                        <Search className="h-4 w-4" />
                        Search
                      </Button>
                    </div>
                  </div>
                  
                  {isLoading ? (
                    <div className="text-center p-8">
                      <p>Loading results...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto p-2 border rounded-md">
                      {searchResults.map((exercise) => (
                        <div 
                          key={exercise.id} 
                          className="flex justify-between items-center p-3 hover:bg-secondary/10 rounded-md"
                        >
                          <div>
                            <h4 className="font-medium">{exercise.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {exercise.bodyPart} | {exercise.equipment}
                            </p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleAddExercise(exercise)}
                            className="flex items-center gap-1"
                          >
                            <Plus className="h-3 w-3" />
                            Add
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : searchQuery ? (
                    <div className="text-center p-8 bg-secondary/20 rounded-lg">
                      <p className="text-muted-foreground">No results found. Try different keywords.</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Selected Exercises</CardTitle>
              <CardDescription>
                {selectedExercises.length} exercise{selectedExercises.length !== 1 ? 's' : ''} added
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedExercises.length === 0 ? (
                <div className="text-center p-8 bg-secondary/20 rounded-lg">
                  <p className="text-muted-foreground">
                    No exercises added yet. Search and add exercises to your workout.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {selectedExercises.map((exercise, index) => (
                    <div key={exercise.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xl font-medium">{exercise.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-sm">Exercise {index + 1}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveExercise(exercise.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <ExerciseSetList 
                        sets={exercise.sets}
                        onSetsChange={(newSets) => handleUpdateSets(exercise.id, newSets)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/workouts')}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveWorkout}
                disabled={selectedExercises.length === 0 || !workoutName.trim()}
                className="flex items-center gap-1"
              >
                <Save className="h-4 w-4" />
                Save Workout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExerciseSearch;

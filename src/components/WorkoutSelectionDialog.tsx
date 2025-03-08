
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Folder, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { Workout } from '@/pages/WorkoutDetail';
import { Workout } from '@/interfaces/workout';

interface WorkoutSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectWorkout: (workout: Workout) => void;
}

const WorkoutSelectionDialog = ({ open, onOpenChange, onSelectWorkout }: WorkoutSelectionDialogProps) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const storedWorkouts = localStorage.getItem('workouts');
    if (storedWorkouts) {
      try {
        const parsedWorkouts = JSON.parse(storedWorkouts).map((w: Workout) => ({
          ...w,
          date: new Date(w.date)
        }));
        setWorkouts(parsedWorkouts);
      } catch (error) {
        console.error('Error parsing workouts:', error);
      }
    }
  }, []);

  const handleCreateWorkout = () => {
    onOpenChange(false);
    navigate('/exercise-search');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select a Workout</DialogTitle>
          <DialogDescription>
            Choose an existing workout or create a new one
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 mb-4"
            onClick={handleCreateWorkout}
          >
            <Plus className="h-4 w-4" />
            Create New Workout
          </Button>
          
          {workouts.length > 0 ? (
            <ScrollArea className="h-72">
              <div className="space-y-2">
                {workouts.map((workout) => (
                  <Card 
                    key={workout.id} 
                    className="p-3 cursor-pointer hover:bg-secondary/20 transition-colors"
                    onClick={() => {
                      onSelectWorkout(workout);
                      onOpenChange(false);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Folder className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{workout.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center p-8 bg-secondary/20 rounded-lg">
              <p className="text-muted-foreground mb-4">No saved workouts found</p>
              <Button onClick={handleCreateWorkout}>Create Your First Workout</Button>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutSelectionDialog;

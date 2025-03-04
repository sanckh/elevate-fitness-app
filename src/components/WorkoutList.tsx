
import { Workout } from '@/pages/Workouts';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Edit, Trash2 } from 'lucide-react';

interface WorkoutListProps {
  workouts: Workout[];
  onEdit: (workout: Workout) => void;
  onDelete: (workoutId: string) => void;
  onToggleComplete: (workoutId: string) => void;
}

const WorkoutList = ({ workouts, onEdit, onDelete, onToggleComplete }: WorkoutListProps) => {
  return (
    <div className="space-y-4">
      {workouts.map((workout) => (
        <Card key={workout.id} className={`${workout.completed ? 'border-primary bg-primary/5' : ''}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {workout.name}
                  {workout.completed && (
                    <Badge variant="outline" className="bg-primary/20 text-primary border-primary/20">
                      Completed
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                </CardDescription>
              </div>
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => onToggleComplete(workout.id)}
                  title={workout.completed ? "Mark as incomplete" : "Mark as completed"}
                >
                  <CheckCircle className={`h-4 w-4 ${workout.completed ? 'text-primary fill-primary' : ''}`} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => onEdit(workout)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-destructive"
                  onClick={() => onDelete(workout.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="exercises">
                <AccordionTrigger className="text-sm font-medium py-2">
                  View Exercises
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {workout.exercises.map((exercise) => (
                      <div key={exercise.id} className="border rounded-md p-3">
                        <div className="font-medium">{exercise.name}</div>
                        <div className="text-sm text-muted-foreground flex gap-3 mt-1">
                          <span>{exercise.sets} sets</span>
                          <span>{exercise.reps} reps</span>
                          {exercise.weight && <span>{exercise.weight} lbs</span>}
                        </div>
                        {exercise.notes && (
                          <div className="text-sm mt-2 italic">
                            Note: {exercise.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WorkoutList;

import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Workout } from "@/interfaces/workout";
import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

interface CopyWorkoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workouts: Workout[];
  onSelectWorkout: (workout: Workout, targetDate: Date) => void;
  targetDate: Date;
}

const CopyWorkoutDialog = ({
  open,
  onOpenChange,
  workouts,
  onSelectWorkout,
  targetDate,
}: CopyWorkoutDialogProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | undefined>(undefined);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const workoutsForDate = workouts.filter(
        (workout) =>
          format(new Date(workout.date), "yyyy-MM-dd") ===
          format(date, "yyyy-MM-dd")
      );
      setSelectedWorkout(workoutsForDate[0]);
    } else {
      setSelectedWorkout(undefined);
    }
  };

  const handleConfirm = () => {
    if (selectedDate && selectedWorkout) {
      onSelectWorkout(selectedWorkout, targetDate);
      onOpenChange(false);
      setSelectedDate(undefined);
      setSelectedWorkout(undefined);
    }
  };

  const workoutDates = workouts.map((workout) => new Date(workout.date));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Copy a Previous Workout</DialogTitle>
          <DialogDescription>
            Select a date to copy a workout to {format(targetDate, "MMMM d, yyyy")}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col md:flex-row gap-6">
          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="rounded-md"
              modifiers={{
                workout: workoutDates,
              }}
              modifiersClassNames={{
                workout:
                  "bg-primary/10 text-primary font-medium border border-primary/20",
              }}
            />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-medium mb-4">Workout Preview</h3>
            {selectedWorkout ? (
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-medium text-lg mb-2">{selectedWorkout.name}</h4>
                  <div className="space-y-2">
                    {selectedWorkout.exercises.map((exercise, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{exercise.name}</span>
                        <div className="text-muted-foreground">
                          {exercise.sets.map((set, setIndex) => (
                            <span key={setIndex} className="mr-2">
                              Set {setIndex + 1}: {set.reps} reps {set.weight && `@ ${set.weight}`}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center p-8 bg-secondary/20 rounded-lg">
                <p className="text-muted-foreground">
                  Select a date to preview the workout
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handleConfirm} disabled={!selectedWorkout}>
            Copy to {format(targetDate, "MMM d")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CopyWorkoutDialog;

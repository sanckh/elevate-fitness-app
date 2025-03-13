import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Workout } from "@/interfaces/workout";
import { useState } from "react";
import { format } from "date-fns";

interface CopyWorkoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workouts: Workout[];
  onSelectWorkout: (workout: Workout) => void;
}

const CopyWorkoutDialog = ({
  open,
  onOpenChange,
  workouts,
  onSelectWorkout,
}: CopyWorkoutDialogProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleConfirm = () => {
    if (selectedDate) {
      const workoutsForDate = workouts.filter(
        (workout) =>
          format(new Date(workout.date), "yyyy-MM-dd") ===
          format(selectedDate, "yyyy-MM-dd")
      );
      if (workoutsForDate.length > 0) {
        onSelectWorkout(workoutsForDate[0]); // Copy the first workout for the selected date
        onOpenChange(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Copy a Previous Workout</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md"
            modifiers={{
              workout: workouts.map((workout) => new Date(workout.date)),
            }}
            modifiersClassNames={{
              workout:
                "bg-primary/10 text-primary font-medium border border-primary/20",
            }}
          />
          <Button onClick={handleConfirm} disabled={!selectedDate}>
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CopyWorkoutDialog;

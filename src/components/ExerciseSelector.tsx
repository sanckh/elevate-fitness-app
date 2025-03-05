
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ExerciseSelectorProps {
  exercises: string[];
  selectedExercise: string | null;
  onSelectExercise: (exercise: string) => void;
}

const ExerciseSelector = ({ 
  exercises, 
  selectedExercise, 
  onSelectExercise 
}: ExerciseSelectorProps) => {
  const [open, setOpen] = useState(false);
  
  // Ensure exercises is a valid array of strings
  const safeExercises = Array.isArray(exercises) 
    ? exercises.filter(exercise => typeof exercise === 'string' && exercise.trim() !== '') 
    : [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedExercise
            ? selectedExercise
            : "Select an exercise..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        {/* Only render Command when we have safe exercises to work with */}
        {safeExercises.length > 0 ? (
          <Command>
            <CommandInput placeholder="Search exercises..." />
            <CommandEmpty>No exercise found.</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-y-auto">
              {safeExercises.map((exercise) => (
                <CommandItem
                  key={exercise}
                  value={exercise}
                  onSelect={() => {
                    onSelectExercise(exercise);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedExercise === exercise ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {exercise}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No exercises available
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default ExerciseSelector;

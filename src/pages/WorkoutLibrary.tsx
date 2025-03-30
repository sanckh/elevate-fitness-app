
import React, { useState, useEffect } from 'react';
import { useNavigate, NavigateOptions } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Edit, Trash2, Search, Dumbbell } from 'lucide-react';
import { Header } from "@/components/Header";
import { Footer } from '@/components/Footer';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Workout } from '@/interfaces/workout';
import { ExerciseSet } from '@/interfaces/exercise';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Exercise } from '@/interfaces/exercise';
import { deleteWorkout, saveWorkout,fetchWorkouts } from '@/api/workout';
import { useAuth } from '@/context/AuthContext';

const WorkoutSchema = z.object({
  name: z.string().min(2, {
    message: "Workout name must be at least 2 characters.",
  }),
  date: z.date(),
  notes: z.string().optional(),
  exercises: z.array(z.object({
    name: z.string(),
    sets: z.array(z.object({
      id: z.string(),
      reps: z.number(),
      weight: z.number().optional(),
    }))
  }))
})

interface NavigationState {
  from: string;
}

const WorkoutLibrary = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const {user} =useAuth()
  
  const form = useForm<z.infer<typeof WorkoutSchema>>({
    resolver: zodResolver(WorkoutSchema),
    defaultValues: {
      name: "",
      date: new Date(),
      notes: "",
      exercises: []
    },
  })

  function onSubmit(values: z.infer<typeof WorkoutSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
  }

  useEffect(() => {
    // Load workouts from local storage on component mount
    const storedWorkouts = localStorage.getItem('workouts');
    if (storedWorkouts) {
      setWorkouts(JSON.parse(storedWorkouts).map((w: Workout) => ({
        ...w,
        date: new Date(w.date)
      })));
    }
  }, []);

  useEffect(() => {
    // Save workouts to local storage whenever the workouts state changes
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleAddWorkout = () => {
    // Generate a unique ID for the new workout
    const newWorkoutId = crypto.randomUUID();

    // Create a new workout object with default values
    const newWorkout: Workout = {
      id: newWorkoutId,
      name: 'New Workout',
      date: new Date(),
      exercises: [],
    };

    // Add the new workout to the workouts state
    setWorkouts([...workouts, newWorkout]);

    // Close the dialog
    handleCloseDialog();
  };

  const handleEditWorkout = (workoutId: string) => {
    const navigationOptions: NavigateOptions = {
      state: { from: 'workout-library' } as NavigationState
    };
    navigate(`/workouts/${workoutId}`, navigationOptions);
  };

  const handleDeleteWorkout = (workoutId: string) => {

     //delete from db
     deleteWorkout(workoutId);
    // Filter out the workout with the given ID
    const updatedWorkouts = workouts.filter(workout => workout.id !== workoutId);

    // Update the workouts state with the filtered array
    setWorkouts(updatedWorkouts);
  };
    
  const filteredWorkouts = workouts.filter(workout =>
    workout.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 mt-20">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 ">
          <h1 className="text-2xl font-bold mb-4 md:mb-0 ">Workout Library</h1>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex-1 mr-4">
            <Input
              type="text"
              placeholder="Search workouts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="default" 
            onClick={() => navigate('/exercise-search')}
            className="flex items-center gap-2"
          >
            <Dumbbell className="h-4 w-4" />
            Create Custom Workout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Workouts</CardTitle>
            <CardDescription>Manage your workout routines.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkouts.map((workout) => (
                  <TableRow key={workout.id}>
                    <TableCell className="font-medium">{workout.name}</TableCell>
                    <TableCell>{format(workout.date, 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => handleEditWorkout(workout.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteWorkout(workout.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add Workout
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Workout</DialogTitle>
              <DialogDescription>
                Create a new workout routine.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workout Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Workout Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date()
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Select the date for this workout.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any relevant notes about this workout"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Describe your workout in detail.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Create</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default WorkoutLibrary;

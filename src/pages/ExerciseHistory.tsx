
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Header } from "@/components/Header";
import { Footer } from '@/components/Footer';
import { ExerciseSet } from '@/components/ExerciseSetList';
import { Workout } from '@/pages/WorkoutDetail';

interface ExerciseHistoryItem {
  date: Date;
  workoutId: string;
  workoutName: string;
  sets: ExerciseSet[];
}

const ExerciseHistory = () => {
  const { exerciseName } = useParams<{ exerciseName: string }>();
  const navigate = useNavigate();
  const [historyItems, setHistoryItems] = useState<ExerciseHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExerciseHistory = () => {
      if (!exerciseName) return;
      
      setLoading(true);
      
      try {
        const storedWorkouts = localStorage.getItem('workouts');
        if (!storedWorkouts) {
          setHistoryItems([]);
          setLoading(false);
          return;
        }
        
        const parsedWorkouts: Workout[] = JSON.parse(storedWorkouts).map((w: any) => ({
          ...w,
          date: new Date(w.date)
        }));
        
        // Filter workouts that contain this exercise and extract relevant data
        const history: ExerciseHistoryItem[] = [];
        
        parsedWorkouts.forEach(workout => {
          workout.exercises.forEach(exercise => {
            if (exercise.name.toLowerCase() === decodeURIComponent(exerciseName).toLowerCase()) {
              history.push({
                date: workout.date,
                workoutId: workout.id,
                workoutName: workout.name,
                sets: exercise.sets
              });
            }
          });
        });
        
        // Sort by date (most recent first)
        history.sort((a, b) => b.date.getTime() - a.date.getTime());
        
        setHistoryItems(history);
      } catch (error) {
        console.error("Error loading exercise history:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadExerciseHistory();
  }, [exerciseName]);

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
        
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Exercise History</CardTitle>
            <CardDescription>
              Tracking progress for {decodeURIComponent(exerciseName || '')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-8">
                <p>Loading history...</p>
              </div>
            ) : historyItems.length === 0 ? (
              <div className="text-center p-8 bg-secondary/20 rounded-lg">
                <p className="text-muted-foreground">
                  No history found for this exercise
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {historyItems.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{format(item.date, 'MMMM d, yyyy')}</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => navigate(`/workouts/${item.workoutId}`)}
                      >
                        View Workout
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{item.workoutName}</p>
                    <Separator className="my-2" />
                    
                    <div className="mt-3">
                      <h4 className="text-sm font-medium mb-2">Sets</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="text-left border-b">
                              <th className="px-2 py-2 text-sm">Set</th>
                              <th className="px-2 py-2 text-sm">Weight</th>
                              <th className="px-2 py-2 text-sm">Reps</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.sets.map((set, setIdx) => (
                              <tr key={set.id} className="border-b border-b-slate-100">
                                <td className="px-2 py-2">{setIdx + 1}</td>
                                <td className="px-2 py-2">{set.weight || 0} lbs</td>
                                <td className="px-2 py-2">{set.reps || 0}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {item.sets.some(set => set.weight) && (
                        <div className="mt-3 bg-secondary/10 rounded-md p-2 text-sm text-secondary-foreground">
                          <span className="font-medium">Volume:</span> {item.sets.reduce((total, set) => total + (set.reps * (set.weight || 0)), 0)} lbs
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ExerciseHistory;

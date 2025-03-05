
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, subMonths, subYears, isAfter } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Workout } from '@/pages/WorkoutDetail';

type TimeRange = '1m' | '3m' | '6m' | '1y' | 'all';

interface DataPoint {
  date: number; // timestamp for sorting
  formattedDate: string;
  weight: number;
}

const ExerciseGraph = () => {
  const { exerciseName } = useParams<{ exerciseName: string }>();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [allData, setAllData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadExerciseData = () => {
      if (!exerciseName) return;
      
      setLoading(true);
      
      try {
        const storedWorkouts = localStorage.getItem('workouts');
        if (!storedWorkouts) {
          setAllData([]);
          setLoading(false);
          return;
        }
        
        const parsedWorkouts: Workout[] = JSON.parse(storedWorkouts).map((w: any) => ({
          ...w,
          date: new Date(w.date)
        }));
        
        // Filter workouts that contain this exercise
        const relevantWorkouts = parsedWorkouts.filter(workout => 
          workout.exercises.some(exercise => 
            exercise.name.toLowerCase() === decodeURIComponent(exerciseName).toLowerCase()
          )
        ).sort((a, b) => a.date.getTime() - b.date.getTime());
        
        // Extract the data points
        const dataPoints: DataPoint[] = relevantWorkouts.map(workout => {
          // Find the exercise in this workout
          const exercise = workout.exercises.find(
            e => e.name.toLowerCase() === decodeURIComponent(exerciseName).toLowerCase()
          );
          
          // Calculate the max weight used in any set of this exercise
          const maxWeight = exercise?.sets.reduce((max, set) => {
            return set.weight && set.weight > max ? set.weight : max;
          }, 0) || 0;
          
          return {
            date: workout.date.getTime(),
            formattedDate: format(workout.date, 'MMM d, yyyy'),
            weight: maxWeight
          };
        });
        
        setAllData(dataPoints);
      } catch (error) {
        console.error("Error loading exercise data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadExerciseData();
  }, [exerciseName]);
  
  const filteredData = useMemo(() => {
    if (timeRange === 'all') return allData;
    
    const now = new Date();
    let cutoffDate: Date;
    
    switch (timeRange) {
      case '1m':
        cutoffDate = subMonths(now, 1);
        break;
      case '3m':
        cutoffDate = subMonths(now, 3);
        break;
      case '6m':
        cutoffDate = subMonths(now, 6);
        break;
      case '1y':
        cutoffDate = subYears(now, 1);
        break;
      default:
        return allData;
    }
    
    return allData.filter(dataPoint => isAfter(new Date(dataPoint.date), cutoffDate));
  }, [allData, timeRange]);

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
        
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Progress Graph</CardTitle>
            <CardDescription>
              Weight progression for {decodeURIComponent(exerciseName || '')}
            </CardDescription>
            
            <Tabs 
              defaultValue={timeRange} 
              className="mt-4" 
              onValueChange={(value) => setTimeRange(value as TimeRange)}
            >
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="1m">1 Month</TabsTrigger>
                <TabsTrigger value="3m">3 Months</TabsTrigger>
                <TabsTrigger value="6m">6 Months</TabsTrigger>
                <TabsTrigger value="1y">1 Year</TabsTrigger>
                <TabsTrigger value="all">All Time</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-8">
                <p>Loading data...</p>
              </div>
            ) : filteredData.length < 2 ? (
              <div className="text-center p-8 bg-secondary/20 rounded-lg">
                <p className="text-muted-foreground">
                  {filteredData.length === 0 
                    ? "No data available for this exercise in the selected time range" 
                    : "Not enough data points to show a trend. At least two workouts are needed."}
                </p>
              </div>
            ) : (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={filteredData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="formattedDate"
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                    />
                    <YAxis 
                      label={{ 
                        value: 'Weight (lbs)', 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { textAnchor: 'middle' }
                      }}
                    />
                    <Tooltip 
                      labelFormatter={(value) => `Date: ${value}`}
                      formatter={(value: number) => [`${value} lbs`, 'Weight']}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      name="Max Weight"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            
            <div className="mt-6 text-sm text-muted-foreground">
              <p>This graph shows your max weight progression for this exercise over time.</p>
              {filteredData.length > 0 && (
                <div className="mt-2">
                  <span className="font-medium">Starting weight:</span> {filteredData[0].weight} lbs
                  {filteredData.length > 1 && (
                    <>
                      <span className="ml-4 font-medium">Current weight:</span> {filteredData[filteredData.length - 1].weight} lbs
                      <span className="ml-4 font-medium">Progress:</span> {filteredData[filteredData.length - 1].weight - filteredData[0].weight} lbs
                    </>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ExerciseGraph;

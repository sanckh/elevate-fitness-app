
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, subMonths, subYears, isAfter } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from "@/components/Header";
import { Footer } from '@/components/Footer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Workout } from '@/pages/WorkoutDetail';

type TimeRange = '1m' | '3m' | '6m' | '1y' | 'all';
type MetricType = 'maxWeight' | 'oneRepMax' | 'maxReps' | 'maxVolume';

interface DataPoint {
  date: number; // timestamp for sorting
  formattedDate: string;
  weight: number;
  oneRepMax?: number;
  maxReps?: number;
  maxVolume?: number;
}

const ExerciseGraph = () => {
  const { exerciseName } = useParams<{ exerciseName: string }>();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [metricType, setMetricType] = useState<MetricType>('maxWeight');
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
          
          // Calculate the max weight and best 1RM for this exercise
          let maxWeight = 0;
          let bestOneRepMax = 0;
          let maxReps = 0;
          let maxVolume = 0;
          
          if (exercise && exercise.sets) {
            exercise.sets.forEach(set => {
              // Calculate max weight
              if (set.weight && set.weight > maxWeight) {
                maxWeight = set.weight;
              }
              
              // Calculate max reps
              if (set.reps && set.reps > maxReps) {
                maxReps = set.reps;
              }
              
              // Calculate 1RM for each set using the formula: 1RM = (Weight × Reps / 30.48) + Weight
              if (set.weight && set.reps) {
                const oneRepMax = (set.weight * set.reps / 30.48) + set.weight;
                if (oneRepMax > bestOneRepMax) {
                  bestOneRepMax = oneRepMax;
                }
                
                // Calculate volume for each set (weight × reps)
                const volume = set.weight * set.reps;
                if (volume > maxVolume) {
                  maxVolume = volume;
                }
              }
            });
          }
          
          return {
            date: workout.date.getTime(),
            formattedDate: format(workout.date, 'MMM d, yyyy'),
            weight: maxWeight,
            oneRepMax: bestOneRepMax,
            maxReps: maxReps,
            maxVolume: maxVolume
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

  const getYAxisLabel = () => {
    if (metricType === 'oneRepMax') return 'Estimated 1RM (lbs)';
    if (metricType === 'maxReps') return 'Max Repetitions';
    if (metricType === 'maxVolume') return 'Max Volume (lbs × reps)';
    return 'Weight (lbs)';
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
        
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Progress Graph</CardTitle>
            <CardDescription>
              {metricType === 'oneRepMax' 
                ? 'Estimated 1 Rep Max' 
                : metricType === 'maxReps'
                  ? 'Maximum Repetitions'
                  : metricType === 'maxVolume'
                    ? 'Maximum Volume (weight × reps)'
                    : 'Weight progression'} for {decodeURIComponent(exerciseName || '')}
            </CardDescription>
            
            <div className="flex flex-col md:flex-row md:items-center gap-4 mt-4">
              <div className="flex-1">
                <Tabs 
                  defaultValue={timeRange} 
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
              </div>
              <div className="w-full md:w-60">
                <Select 
                  value={metricType} 
                  onValueChange={(value) => setMetricType(value as MetricType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maxWeight">Max Weight</SelectItem>
                    <SelectItem value="oneRepMax">Estimated 1 Rep Max</SelectItem>
                    <SelectItem value="maxReps">Max Reps</SelectItem>
                    <SelectItem value="maxVolume">Max Volume</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
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
                        value: getYAxisLabel(), 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { textAnchor: 'middle' }
                      }}
                    />
                    <Tooltip 
                      labelFormatter={(value) => `Date: ${value}`}
                      formatter={(value: number, name: string) => {
                        let formattedName = 'Max Weight';
                        let unit = 'lbs';
                        
                        if (name === 'oneRepMax') {
                          formattedName = 'Estimated 1RM';
                          unit = 'lbs';
                        } else if (name === 'maxReps') {
                          formattedName = 'Max Reps';
                          unit = '';
                          return [`${Math.round(value)}`, formattedName];
                        } else if (name === 'maxVolume') {
                          formattedName = 'Max Volume';
                          unit = 'lbs × reps';
                        }
                        
                        return [`${Math.round(value)} ${unit}`, formattedName];
                      }}
                    />
                    <Legend />
                    {metricType === 'maxWeight' && (
                      <Line
                        type="monotone"
                        dataKey="weight"
                        name="Max Weight"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    )}
                    {metricType === 'oneRepMax' && (
                      <Line
                        type="monotone"
                        dataKey="oneRepMax"
                        name="Estimated 1RM"
                        stroke="#82ca9d"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    )}
                    {metricType === 'maxReps' && (
                      <Line
                        type="monotone"
                        dataKey="maxReps"
                        name="Max Reps"
                        stroke="#ffc658"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    )}
                    {metricType === 'maxVolume' && (
                      <Line
                        type="monotone"
                        dataKey="maxVolume"
                        name="Max Volume"
                        stroke="#ff8042"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            
            <div className="mt-6 text-sm text-muted-foreground">
              {metricType === 'oneRepMax' ? (
                <p>This graph shows your estimated one-rep max progression over time, calculated using the formula: 1RM = (Weight × Reps / 30.48) + Weight</p>
              ) : metricType === 'maxReps' ? (
                <p>This graph shows your maximum repetitions performed for this exercise over time.</p>
              ) : metricType === 'maxVolume' ? (
                <p>This graph shows your maximum volume (weight × reps) achieved for this exercise over time.</p>
              ) : (
                <p>This graph shows your max weight progression for this exercise over time.</p>
              )}
              
              {filteredData.length > 0 && (
                <div className="mt-2">
                  {metricType === 'maxWeight' ? (
                    <>
                      <span className="font-medium">Starting weight:</span> {filteredData[0].weight} lbs
                      {filteredData.length > 1 && (
                        <>
                          <span className="ml-4 font-medium">Current weight:</span> {filteredData[filteredData.length - 1].weight} lbs
                          <span className="ml-4 font-medium">Progress:</span> {filteredData[filteredData.length - 1].weight - filteredData[0].weight} lbs
                        </>
                      )}
                    </>
                  ) : metricType === 'oneRepMax' ? (
                    <>
                      <span className="font-medium">Starting 1RM:</span> {Math.round(filteredData[0].oneRepMax || 0)} lbs
                      {filteredData.length > 1 && (
                        <>
                          <span className="ml-4 font-medium">Current 1RM:</span> {Math.round(filteredData[filteredData.length - 1].oneRepMax || 0)} lbs
                          <span className="ml-4 font-medium">Progress:</span> {Math.round((filteredData[filteredData.length - 1].oneRepMax || 0) - (filteredData[0].oneRepMax || 0))} lbs
                        </>
                      )}
                    </>
                  ) : metricType === 'maxReps' ? (
                    <>
                      <span className="font-medium">Starting max reps:</span> {filteredData[0].maxReps || 0}
                      {filteredData.length > 1 && (
                        <>
                          <span className="ml-4 font-medium">Current max reps:</span> {filteredData[filteredData.length - 1].maxReps || 0}
                          <span className="ml-4 font-medium">Progress:</span> {(filteredData[filteredData.length - 1].maxReps || 0) - (filteredData[0].maxReps || 0)} reps
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <span className="font-medium">Starting max volume:</span> {Math.round(filteredData[0].maxVolume || 0)} lbs × reps
                      {filteredData.length > 1 && (
                        <>
                          <span className="ml-4 font-medium">Current max volume:</span> {Math.round(filteredData[filteredData.length - 1].maxVolume || 0)} lbs × reps
                          <span className="ml-4 font-medium">Progress:</span> {Math.round((filteredData[filteredData.length - 1].maxVolume || 0) - (filteredData[0].maxVolume || 0))} lbs × reps
                        </>
                      )}
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

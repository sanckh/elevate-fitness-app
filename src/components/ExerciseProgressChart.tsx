
import { useMemo } from 'react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Workout } from '@/pages/Workouts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface ExerciseProgressChartProps {
  exerciseName: string;
  workouts: Workout[];
}

interface ChartDataPoint {
  date: number;
  formattedDate: string;
  weight: number;
  oneRepMax?: number;
  maxReps?: number;
  maxVolume?: number;
}

type MetricType = 'maxWeight' | 'oneRepMax' | 'maxReps' | 'maxVolume';

const ExerciseProgressChart = ({ exerciseName, workouts }: ExerciseProgressChartProps) => {
  const [metricType, setMetricType] = useState<MetricType>('maxWeight');

  // Process the workout data to extract the progression for the selected exercise
  const chartData = useMemo(() => {
    // Validate inputs
    if (!exerciseName || typeof exerciseName !== 'string' || exerciseName.trim() === '') {
      console.log('Invalid exercise name provided');
      return [];
    }
    
    if (!workouts || !Array.isArray(workouts) || workouts.length === 0) {
      console.log('No valid workouts provided');
      return [];
    }
    
    try {
      // Filter workouts that contain the exercise
      const relevantWorkouts = workouts
        .filter(workout => 
          workout && 
          workout.exercises && 
          Array.isArray(workout.exercises) && 
          workout.exercises.some(exercise => 
            exercise && 
            exercise.name && 
            typeof exercise.name === 'string' &&
            exercise.name.toLowerCase() === exerciseName.toLowerCase()
          )
        )
        .sort((a, b) => {
          // Safely handle dates
          const dateA = a.date instanceof Date ? a.date : new Date(a.date || 0);
          const dateB = b.date instanceof Date ? b.date : new Date(b.date || 0);
          
          // Check if dates are valid
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            return 0;
          }
          
          return dateA.getTime() - dateB.getTime();
        });
      
      if (relevantWorkouts.length === 0) {
        console.log('No relevant workouts found for this exercise');
        return [];
      }
      
      // Extract the data points
      return relevantWorkouts.map(workout => {
        // Find the exercise in this workout
        const exercise = workout.exercises?.find(
          e => e && e.name && typeof e.name === 'string' && 
               e.name.toLowerCase() === exerciseName.toLowerCase()
        );
        
        // Calculate the max weight used in any set of this exercise
        const maxWeight = exercise?.sets?.reduce((max, set) => {
          return set && typeof set.weight === 'number' && set.weight > max ? set.weight : max;
        }, 0) || 0;
        
        // Calculate the max reps performed in any set of this exercise
        const maxReps = exercise?.sets?.reduce((max, set) => {
          return set && typeof set.reps === 'number' && set.reps > max ? set.reps : max;
        }, 0) || 0;
        
        // Calculate best 1RM for this exercise
        let bestOneRepMax = 0;
        
        // Calculate max volume (weight × reps) for this exercise
        let maxVolume = 0;
        
        if (exercise?.sets) {
          exercise.sets.forEach(set => {
            // Calculate 1RM for each set using the formula: 1RM = (Weight × Reps / 30.48) + Weight
            if (set && typeof set.weight === 'number' && typeof set.reps === 'number' && set.weight > 0 && set.reps > 0) {
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
        
        // Handle date safely
        let workoutDate;
        try {
          workoutDate = workout.date instanceof Date ? workout.date : new Date(workout.date || 0);
          if (isNaN(workoutDate.getTime())) {
            workoutDate = new Date(); // Default to current date if invalid
          }
        } catch (e) {
          workoutDate = new Date(); // Default to current date on error
        }
        
        return {
          date: workoutDate.getTime(), // Use timestamp for sorting
          formattedDate: format(workoutDate, 'MMM d, yyyy'),
          weight: maxWeight,
          oneRepMax: bestOneRepMax,
          maxReps: maxReps,
          maxVolume: maxVolume
        };
      });
    } catch (error) {
      console.error('Error processing chart data:', error);
      return [];
    }
  }, [exerciseName, workouts]);

  // Check if we have data to display
  const hasData = chartData && chartData.length > 0;
  
  const getYAxisLabel = () => {
    if (metricType === 'oneRepMax') return 'Estimated 1RM (lbs)';
    if (metricType === 'maxReps') return 'Max Repetitions';
    if (metricType === 'maxVolume') return 'Max Volume (lbs × reps)';
    return 'Weight (lbs)';
  };
  
  if (!hasData) {
    return (
      <div className="text-center p-8 bg-secondary/20 rounded-lg">
        <p className="text-muted-foreground">
          No data available for this exercise yet
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 w-full md:w-60">
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
      
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
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
      
      {metricType === 'oneRepMax' && (
        <div className="mt-2 text-sm text-muted-foreground">
          <p>Estimated using the formula: 1RM = (Weight × Reps / 30.48) + Weight</p>
        </div>
      )}
      
      {metricType === 'maxVolume' && (
        <div className="mt-2 text-sm text-muted-foreground">
          <p>Volume calculated as weight × reps for each set</p>
        </div>
      )}
    </div>
  );
};

export default ExerciseProgressChart;

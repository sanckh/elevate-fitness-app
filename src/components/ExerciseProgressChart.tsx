
import { useMemo } from 'react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Workout } from '@/pages/Workouts';
import { Exercise } from '@/pages/WorkoutDetail';

interface ExerciseProgressChartProps {
  exerciseName: string;
  workouts: Workout[];
}

interface ChartDataPoint {
  date: string;
  weight: number;
  formattedDate: string;
}

const ExerciseProgressChart = ({ exerciseName, workouts }: ExerciseProgressChartProps) => {
  // Process the workout data to extract the progression for the selected exercise
  const chartData = useMemo(() => {
    // Filter workouts that contain the exercise
    const relevantWorkouts = workouts
      .filter(workout => 
        workout.exercises.some(exercise => 
          exercise.name.toLowerCase() === exerciseName.toLowerCase()
        )
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Extract the data points
    return relevantWorkouts.map(workout => {
      // Find the exercise in this workout
      const exercise = workout.exercises.find(
        e => e.name.toLowerCase() === exerciseName.toLowerCase()
      );
      
      // Calculate the max weight used in any set of this exercise
      const maxWeight = exercise?.sets?.reduce((max, set) => {
        return set.weight && set.weight > max ? set.weight : max;
      }, 0) || 0;
      
      return {
        date: workout.date.getTime(), // Use timestamp for sorting
        formattedDate: format(workout.date, 'MMM d, yyyy'),
        weight: maxWeight
      };
    });
  }, [exerciseName, workouts]);

  // Check if we have data to display
  const hasData = chartData.length > 0;
  
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
    <div className="w-full h-96">
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
  );
};

export default ExerciseProgressChart;

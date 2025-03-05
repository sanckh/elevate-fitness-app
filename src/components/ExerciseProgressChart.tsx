
import { useMemo } from 'react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Workout } from '@/pages/Workouts';

interface ExerciseProgressChartProps {
  exerciseName: string;
  workouts: Workout[];
}

interface ChartDataPoint {
  date: number;
  formattedDate: string;
  weight: number;
}

const ExerciseProgressChart = ({ exerciseName, workouts }: ExerciseProgressChartProps) => {
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
          weight: maxWeight
        };
      });
    } catch (error) {
      console.error('Error processing chart data:', error);
      return [];
    }
  }, [exerciseName, workouts]);

  // Check if we have data to display
  const hasData = chartData && chartData.length > 0;
  
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

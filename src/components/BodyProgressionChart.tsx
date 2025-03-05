
import { useMemo } from 'react';
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { format } from 'date-fns';

type ProgressEntry = {
  id: string;
  date: Date;
  weight: number | string;
  bodyFat: number | string;
  measurements: {
    chest: number | string;
    waist: number | string;
    arms: number | string;
  };
  photos: string[];
};

type BodyProgressionChartProps = {
  progressEntries: ProgressEntry[];
  metricType: 'weight' | 'bodyFat';
};

const BodyProgressionChart = ({ progressEntries, metricType }: BodyProgressionChartProps) => {
  // Filter out entries where the selected metric is zero, undefined, or NaN
  const validEntries = useMemo(() => {
    return progressEntries
      .filter(entry => {
        const value = metricType === 'weight' 
          ? parseFloat(entry.weight.toString())
          : parseFloat(entry.bodyFat.toString());
        return !isNaN(value) && value > 0;
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(entry => ({
        ...entry,
        formattedDate: format(new Date(entry.date), 'MMM d, yyyy')
      }));
  }, [progressEntries, metricType]);

  // Extract the appropriate y-axis label and data value based on the metric type
  const getYAxisLabel = () => {
    return metricType === 'weight' ? 'Weight (lbs)' : 'Body Fat (%)';
  };

  // If no valid entries are found, show a message
  if (validEntries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-secondary/20 rounded-lg">
        <p className="text-muted-foreground text-center">
          No {metricType === 'weight' ? 'weight' : 'body fat'} data available. 
          Add body measurements in the Progress Tracker to see analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-80 mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={validEntries} margin={{ top: 5, right: 20, bottom: 25, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="formattedDate" 
            angle={-45} 
            textAnchor="end" 
            tick={{ fontSize: 12 }}
            interval={0}
            padding={{ left: 10, right: 10 }}
            height={60}
          />
          <YAxis 
            label={{ 
              value: getYAxisLabel(), 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle' },
              offset: 5
            }} 
          />
          <Tooltip 
            formatter={(value) => [`${value} ${metricType === 'weight' ? 'lbs' : '%'}`, metricType === 'weight' ? 'Weight' : 'Body Fat']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey={metricType} 
            name={metricType === 'weight' ? 'Weight' : 'Body Fat %'} 
            stroke={metricType === 'weight' ? '#3b82f6' : '#ef4444'} 
            strokeWidth={2} 
            dot={{ r: 4 }} 
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BodyProgressionChart;

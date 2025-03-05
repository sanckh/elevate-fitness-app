
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type BodyMetricSelectorProps = {
  selectedMetric: 'weight' | 'bodyFat';
  onSelectMetric: (metric: 'weight' | 'bodyFat') => void;
};

const BodyMetricSelector = ({ selectedMetric, onSelectMetric }: BodyMetricSelectorProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor="metric-select" className="text-sm font-medium">
        Select Metric
      </label>
      <Select
        value={selectedMetric}
        onValueChange={(value) => onSelectMetric(value as 'weight' | 'bodyFat')}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select metric" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="weight">Weight</SelectItem>
          <SelectItem value="bodyFat">Body Fat %</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default BodyMetricSelector;

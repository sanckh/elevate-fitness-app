export interface ChartDataPoint {
    date: number;
    formattedDate: string;
    weight: number;
    oneRepMax?: number;
    maxReps?: number;
    maxVolume?: number;
  }
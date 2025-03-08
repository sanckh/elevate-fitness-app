export interface DataPoint {
    date: number; // timestamp for sorting
    formattedDate: string;
    weight: number;
    oneRepMax?: number;
    maxReps?: number;
    maxVolume?: number;
  }
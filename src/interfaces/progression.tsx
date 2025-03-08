export interface Measurements {
    chest: number;
    waist: number;
    arms: number;
  }
  
  export interface ProgressEntry {
    id: string;
    date: Date;
    weight: number;
    bodyFat: number;
    measurements: Measurements;
    photos: string[];
  }
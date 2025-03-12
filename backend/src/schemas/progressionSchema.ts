
import { z } from 'zod';
const progressionSchema = z.object({
  id: z.string().min(1, "Progression ID is required"),
  userId: z.string().min(1, "User ID is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, {
    message: "Date must be in ISO 8601 format (e.g., 2025-03-14T00:00:00.000Z)",
  }),
  weight: z.number().min(0, "Weight must be a positive number"),
  bodyFat: z.number().min(0, "Body fat must be a positive number"),
  measurements: z.object({
    chest: z.number().min(0, "Chest measurement must be a positive number"),
    waist: z.number().min(0, "Waist measurement must be a positive number"),
    arms: z.number().min(0, "Arms measurement must be a positive number"),
  }),
  // photos: z.array(z.string().url("Photo URL must be a valid URL")).optional(),
});

export const saveProgressionRequestSchema = z.object({
  body: z.object({
    progression: progressionSchema,
  }),
});


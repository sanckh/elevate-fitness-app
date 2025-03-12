import { z } from 'zod'
const workoutSchema = z.object({
    name: z.string().min(2, { message: "Workout name must be at least 2 characters." }),
    date: z.string().datetime(),
    notes: z.string().optional(),
    id: z.string().min(1, { message: "Workout Id must be at least 1 characters." }),
    exercises: z.array(
        z.object({
            name: z.string(),
            sets: z.array(
                z.object({
                    id: z.string(),
                    reps: z.number(),
                    weight: z.number().optional(),
                })
            ),
        })
    ),
});


export const saveWorkoutRequestSchema = z.object({
    body: z.object({
        workout: workoutSchema,
    })
})

// Schema for the /get/:userId route
export const getWorkoutByUserSchema = z.object({
    params: z.object({
        userId: z.string().min(1, "User ID is required"), // Assuming userId is a string
    }),
});

// Schema for the /delete/:workoutId route
export const deleteWorkoutSchema = z.object({
    params: z.object({
        workoutId: z.string().min(1, "Workout ID is required"), // Assuming workoutId is a string
    }),
});

export const editWorkoutSchema = z.object({
    body: z.object({
      workout: z.object({
        id: z.string().min(1, { message: "Workout ID is required." }), // Required to identify the workout
        name: z.string().min(2, { message: "Workout name must be at least 2 characters." }).optional(),
        date: z.string().datetime().optional(),
        notes: z.string().optional(),
        exercises: z.array(
          z.object({
            name: z.string().optional(),
            sets: z.array(
              z.object({
                id: z.string().optional(),
                reps: z.number().optional(),
                weight: z.number().optional(),
              })
            ).optional(),
          })
        ).optional(),
      }),
    }),
  });
// src/routes/progressionRoutes.ts
import express from 'express';
import { saveWorkout, getWorkoutByUser, deleteWorkout, editWorkout } from '../controllers/workoutsController';
import { validateRequest } from '../middleware/validateRequest';
import { saveWorkoutRequestSchema, getWorkoutByUserSchema ,deleteWorkoutSchema, editWorkoutSchema} from '../schemas/workoutSchemas';

const router = express.Router();

router.post('/save',validateRequest(saveWorkoutRequestSchema), saveWorkout);
router.get('/get/:userId', validateRequest(getWorkoutByUserSchema), getWorkoutByUser);
router.delete('/delete/:workoutId', validateRequest(deleteWorkoutSchema), deleteWorkout);
router.put('/edit',validateRequest(editWorkoutSchema), editWorkout)



export default router;
// src/routes/progressionRoutes.ts
import express from 'express';
import { saveWorkout,getWorkoutByUser,deleteWorkout ,editWorkout} from '../controllers/workoutsController';

const router = express.Router();

router.post('/save', saveWorkout);
router.get('/get/:userId', getWorkoutByUser)
router.delete('/delete/:workoutId', deleteWorkout)
router.put('/edit', editWorkout)



export default router;
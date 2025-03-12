import { Request, Response } from 'express';
import { saveWorkoutEntry, fetchFromDb, deleteWorkoutEntry, editWorkoutEntry } from '../services/workoutService';

export const saveWorkout = async (req: Request, res: Response) => {

    const { workout } = req.body;

    try {
        await saveWorkoutEntry(workout);
        res.status(200).json({ message: 'Workout data saved successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to save workout data' + error });
    }

};

export const getWorkoutByUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const resWorkout = await fetchFromDb(userId);

        res.json(resWorkout)
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get workout data' + error });
    }
}

export const deleteWorkout = async (req: Request, res: Response) => {
    const { workoutId } = req.params; // Extract workoutId from the route parameters
    console.log(workoutId)
    try {
        await deleteWorkoutEntry(workoutId); // Call the service function to delete the workout
        res.status(200).json({ message: 'Workout deleted successfully' });
    } catch (error) {
        console.error('Error deleting workout:', error);
        res.status(500).json({ error: 'Failed to delete workout: ' + error });
    }
};

export const editWorkout = async (req: Request, res: Response) => {
    const { workout } = req.body;

    try {
        await editWorkoutEntry(workout);
        res.status(200).json({ message: 'Workout data updated successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update workout data' + error });
    }

}
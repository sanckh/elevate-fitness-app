import { Workout } from "@/interfaces/workout";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const deleteWorkout = async (workoutId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/workout/delete/${workoutId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete workout from the database");
    }

  } catch (error) {
    console.error('Error deleting workout:', error);
    throw error;
  }
};

export const saveWorkout = async (payload: {workout: Workout}): Promise<Workout> => {
  try {
    const response = await axios.post(`${API_URL}/workout/save`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.data) {
      throw new Error('No data returned from save workout endpoint');
    }
    return {
      ...response.data,
      date: new Date(response.data.date)
    };
  }
  catch (e) {
    console.error("Error! Workout not saved to Db", e);
    throw e;
  }
};

export const fetchWorkouts = async (userId: string): Promise<Workout[]> => {
  if (!userId) {
    return [];
  }
  try {
    const response = await axios.get(`${API_URL}/workout/get/${userId}`);
    
    if (!response.data) {
      throw new Error('No data returned from fetch workouts endpoint');
    }

    const fetchedWorkouts = response.data.map((workout: Omit<Workout, 'date'> & { date: string }) => ({
      ...workout,
      date: new Date(workout.date)
    }));

    return fetchedWorkouts;
  } catch (error) {
    console.error('Error fetching workouts:', error);
    throw error;
  }
};

export const editWorkout = async (payload: {workout: Workout}): Promise<Workout> => {
  try {
    const response = await axios.put(`${API_URL}/workout/edit`, payload);
    
    if (!response.data) {
      throw new Error('No data returned from edit workout endpoint');
    }
    
    const workout = {
      ...response.data,
      date: new Date(response.data.date)
    };

    return workout;
  }
  catch (error) {
    console.error("Error! Workout not saved to Db", error);
    throw error;
  }
};

import { Workout } from "@/interfaces/workout";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const deleteWorkout = async (workoutId: string) => {
    try {
      const response = await fetch(`${API_URL}/workout/delete/${workoutId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete workout from the database");
      }

    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };


  export const saveWorkout = async (payload: {workout: Workout}) => { 
    try {
      const response = await axios.post(`${API_URL}/workout/save`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    catch (e) {
      console.log("Error! Workout not saved to Db", e)
    }
  }


   export const fetchWorkouts = async (userId: string): Promise<Workout[]> => {
        if (!userId) {
          return [];
        }
        try {
          const response = await axios.get(`${API_URL}/workout/get/${userId}`);
          const fetchedWorkouts = response.data.map((workout: Workout) => ({
            ...workout,
            date: new Date(workout.date), 
          }));
          return fetchedWorkouts;
        } catch (error) {
          console.error('Error fetching workouts:', error);
          throw error;
        }
      };


      export const editWorkout= async (payload: {workout: Workout})=>{
    
        try {
          const response = await axios.put(`${API_URL}/workout/edit`, payload, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }
        catch (e) {
          console.log("Error! Workout not saved to Db", e)
        }
      }

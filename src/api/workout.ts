
import { Workout } from "@/interfaces/workout";
import axios from "axios";



export const deleteWorkout = async (workoutId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/workout/delete/${workoutId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete workout from the database");
      }

      console.log(`Workout with ID ${workoutId} deleted successfully from DB`);
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };


  export const saveWorkout = async (payload: {workout: Workout}) => { 
    try {
      const response = await axios.post('http://localhost:3000/api/workout/save', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    catch (e) {
      console.log("Error! Workout not saved to Db", e)
    }
  }


   export const fetchWorkouts = async (userId: string) => {
        if (userId) {
          try {
            const response = await axios.get(`http://localhost:3000/api/workout/get/${userId}`);
            const fetchedWorkouts = response.data.map((workout: Workout) => ({
              ...workout,
              date: new Date(workout.date), // Ensure the date is a Date object
            }));
            console.log(fetchWorkouts)
          } catch (error) {
            console.error('Error fetching workouts:', error);
          }
        }
      };


      export const editWorkout= async (payload: {workout: Workout})=>{
    
        try {
          const response = await axios.put('http://localhost:3000/api/workout/edit', payload, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }
        catch (e) {
          console.log("Error! Workout not saved to Db", e)
        }
      }

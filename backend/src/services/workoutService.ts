import { Workout } from "../interfaces/workout";
import { firestore as db } from "../config/firebase"; // Import Firestore instance from your Firebase setup
import { doc, setDoc, collection,getDocs,deleteDoc,query,where } from 'firebase/firestore';

export const saveWorkoutEntry = async (entry: Workout) => {
    try {
        // Reference to the Firestore document
        const entryRef = doc(db, `workouts/${entry.id}`); // Use userId as the document ID

        // Save the workout entry to Firestore
        await setDoc(entryRef, entry);
    } catch (error) {
        console.error("Failed to save workout data:", error);
        throw new Error("Failed to save workout data: " + error);
    }
};


export const fetchFromDb = async (userId: string): Promise<Workout[]> => {
    try {
        const workoutRef = collection(db, 'workouts');
        const q = query(workoutRef, where('userId', '==', userId)); // Query for userId inside workout objects
        const querySnapshot = await getDocs(q);
    
        if (!querySnapshot.empty) {
          const workouts: Workout[] = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
          })) as Workout[];
          return workouts;
        } else {
          return [];
        }
    } catch (error) {
        console.error("Failed to fetch workouts:", error);
        throw new Error("Failed to fetch workouts: " + error);
    }
};


export const deleteWorkoutEntry = async (workoutId: string): Promise<void> => {
  try {
     
      const workoutRef = doc(db, `workouts/${workoutId}`);
      await deleteDoc(workoutRef);
  } catch (error) {
      console.error("Failed to delete workout:", error);
      throw new Error("Failed to delete workout: " + error);
  }
};



export const editWorkoutEntry = async (entry: Workout): Promise<void> => {
    try {
        // Reference to the Firestore document
        const entryRef = doc(db, `workouts/${entry.id}`); // Use the workout ID as the document ID

        // Update the workout entry in Firestore, merging with existing data
        await setDoc(entryRef, entry, { merge: true });
    } catch (error) {
        console.error("Failed to update workout data:", error);
        throw new Error("Failed to update workout data: " + error);
    }
};


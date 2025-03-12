import { ProgressEntry } from "../interfaces/progression";
import { firestore, collection, doc, setDoc, getDocs, query, where } from "../config/firebase";
import { addDoc } from "firebase/firestore";

export const saveProgressEntry = async (entry: ProgressEntry) => {
  try {
    const progressionRef = doc(firestore, `progressions/${entry.id}`);
    await setDoc(progressionRef, entry);
  } catch (error) {
    console.error("Failed to save progression data:", error);
    throw new Error("Failed to save progression data: " + error);
  }
}

export const fetchProgressionEnteriesByUserId = async (userId: string): Promise<ProgressEntry[] | null> => {
  try {
    const progressionsRef = collection(firestore, "progressions");
    const q = query(progressionsRef, where('userId', '==', userId))
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const progressions: ProgressEntry[] = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
      })) as ProgressEntry[];
      return progressions;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch progression data:", error);
    throw new Error("Failed to fetch progression data");
  }
};



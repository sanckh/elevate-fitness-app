import { ProgressEntry } from "../interfaces/progression";
import { firestore, collection, doc, setDoc, getDocs, query, where, storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
    throw new Error("Failed to fetch progression data");
  }
};

export const uploadProgressionImage = async (userId: string, file: Express.Multer.File, photoIndex: number): Promise<string> => {
  try {
    const timestamp = Date.now();
    const fileName = `progression_photos/${userId}/${timestamp}_${photoIndex}.jpg`;
    const storageRef = ref(storage, fileName);

    // Upload the file to Firebase Storage
    await uploadBytes(storageRef, file.buffer, {
      contentType: file.mimetype,
    });

    // Get the download URL
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error) {
    console.error("Failed to upload progression image:", error);
    throw new Error("Failed to upload progression image");
  }
};

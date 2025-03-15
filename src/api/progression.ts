import { ProgressEntry } from "@/interfaces/progression";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchProgressions = async (userId: string): Promise<ProgressEntry[]> => {
  if (!userId) {
    return [];
  }
  try {
    const response = await axios.get(`${API_URL}/progressions/get/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching progressions:', error);
    throw error;
  }
};

export const uploadProgressionPhoto = async (file: File, userId: string, photoIndex: number): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('photoIndex', photoIndex.toString());
    
    const response = await axios.post(`${API_URL}/progressions/upload-photo/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.photoUrl;
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }
};

export const saveProgression = async (payload: { progression: ProgressEntry }): Promise<ProgressEntry> => {
  try {
    const response = await axios.post(`${API_URL}/progressions/save`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error saving progression:', error);
    throw error;
  }
};

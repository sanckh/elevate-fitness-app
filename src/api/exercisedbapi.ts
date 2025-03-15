// ExerciseDB API endpoints (from RapidAPI)
const RAPID_API_KEY = import.meta.env.VITE_RAPID_API_KEY;
const RAPID_API_HOST = import.meta.env.VITE_RAPID_API_HOST;

const headers = {
  'X-RapidAPI-Key': RAPID_API_KEY,
  'X-RapidAPI-Host': RAPID_API_HOST,
};

interface Exercise {
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  id: string;
  name: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
}

// Get all exercises
export const getAllExercises = async (): Promise<Exercise[]> => {
  try {
    const response = await fetch(`${RAPID_API_HOST}/exercises`, {
      headers,
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch exercises');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
};

// Get exercises by body part
export const getExercisesByBodyPart = async (bodyPart: string): Promise<Exercise[]> => {
  try {
    const response = await fetch(`${RAPID_API_HOST}/exercises/bodyPart/${bodyPart}`, {
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch exercises for body part: ${bodyPart}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error fetching exercises for body part ${bodyPart}:`, error);
    throw error;
  }
};

// Get list of all body parts
export const getBodyPartsList = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${RAPID_API_HOST}/exercises/bodyPartList`, {
      headers,
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch body parts list');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching body parts list:', error);
    throw error;
  }
};

// Get list of all equipment
export const getEquipmentList = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${RAPID_API_HOST}/exercises/equipmentList`, {
      headers,
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch equipment list');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching equipment list:', error);
    throw error;
  }
};

// Get list of all target muscles
export const getTargetList = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${RAPID_API_HOST}/exercises/targetList`, {
      headers,
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch target muscles list');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching target muscles list:', error);
    throw error;
  }
};

// Get exercises by equipment type
export const getExercisesByEquipment = async (equipment: string): Promise<Exercise[]> => {
  try {
    const response = await fetch(`${RAPID_API_HOST}/exercises/equipment/${equipment}`, {
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch exercises for equipment: ${equipment}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error fetching exercises for equipment ${equipment}:`, error);
    throw error;
  }
};

// Get exercises by target muscle
export const getExercisesByTarget = async (target: string): Promise<Exercise[]> => {
  try {
    const response = await fetch(`${RAPID_API_HOST}/exercises/target/${target}`, {
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch exercises for target: ${target}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error fetching exercises for target ${target}:`, error);
    throw error;
  }
};

// Get exercise by ID
export const getExerciseById = async (id: string): Promise<Exercise> => {
  try {
    const response = await fetch(`${RAPID_API_HOST}/exercises/exercise/${id}`, {
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch exercise with ID: ${id}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error fetching exercise with ID ${id}:`, error);
    throw error;
  }
};

// Get exercises by name
export const getExercisesByName = async (name: string): Promise<Exercise[]> => {
  try {
    const response = await fetch(`${RAPID_API_HOST}/exercises/name/${name}`, {
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch exercises with name: ${name}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error fetching exercises with name ${name}:`, error);
    throw error;
  }
};

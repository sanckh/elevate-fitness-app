
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Welcome endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Elevate Fitness API' });
});

// Exercise search endpoint
app.get('/api/exercises/search/:query', async (req: Request, res: Response) => {
  const { query } = req.params;
  
  try {
    const response = await axios.get(`https://exercisedb.p.rapidapi.com/exercises/name/${query}`, {
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY || '',
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    
    // Return mock data if API call fails
    res.json([
      { id: "1", name: "Barbell Bench Press", bodyPart: "chest", equipment: "barbell" },
      { id: "2", name: "Dumbbell Bench Press", bodyPart: "chest", equipment: "dumbbell" },
      { id: "3", name: "Incline Bench Press", bodyPart: "chest", equipment: "barbell" },
      { id: "4", name: "Push-up", bodyPart: "chest", equipment: "body weight" },
      { id: "5", name: "Dumbbell Fly", bodyPart: "chest", equipment: "dumbbell" }
    ]);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

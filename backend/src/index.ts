/* eslint-disable @typescript-eslint/no-require-imports */
import express, { Express, Request, Response } from 'express';
import progressionRoutes from './routes/progressionRoute';
import workoutRoutes from './routes/workoutRoutes'
const cors = require('cors')

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use('/api/progressions', progressionRoutes);
app.use('/api/workout', workoutRoutes)

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Elevate Fitness API' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

import express, { Express, Request, Response } from 'express';

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Elevate Fitness API' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

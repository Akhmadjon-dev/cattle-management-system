import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import db from './db';
import type { Cattle, HealthEvent, CreateCattleInput, CreateHealthEventInput } from '../../shared/type';

const app: Express = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

import express, { Express, Response } from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import cattleRoutes from './routes/cattle';
import healthEventsRoutes from './routes/healthEvents';
import analyticsRoutes from './routes/analytics';

const app: Express = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_, res: Response) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/cattle', cattleRoutes);
app.use('/cattle', healthEventsRoutes);
app.use('/analytics', analyticsRoutes);

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

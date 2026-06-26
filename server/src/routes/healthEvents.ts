import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { queries } from '../db';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { validateCreateHealthEvent } from '../middleware/validation';
import type { HealthEvent, Cattle } from '../../../shared/type';

const router = Router();

// POST /cattle/:id/health-events — add event
router.post(
  '/:cattleId/health-events',
  asyncHandler((req: Request, res: Response) => {
    const cattle = queries.getCattle.get(req.params.cattleId) as Cattle | undefined;
    if (!cattle) {
      throw new AppError('Cattle not found', 404);
    }

    const input = validateCreateHealthEvent(req.body);

    const id = randomUUID();
    const now = new Date().toISOString();

    queries.createHealthEvent.run(id, req.params.cattleId, input.type, input.date, input.notes || null, now);

    const event = queries.getHealthEvent.get(id) as HealthEvent;
    res.status(201).json({ data: event });
  }),
);

// GET /cattle/:id/health-events — list events for cattle
router.get(
  '/:cattleId/health-events',
  asyncHandler((req: Request, res: Response) => {
    const cattle = queries.getCattle.get(req.params.cattleId) as Cattle | undefined;
    if (!cattle) {
      throw new AppError('Cattle not found', 404);
    }

    const events = queries.getHealthEvents.all(req.params.cattleId) as HealthEvent[];
    res.json({ data: events, count: events.length });
  }),
);

export default router;

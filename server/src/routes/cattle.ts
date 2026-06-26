import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import db, { queries } from '../db';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { validateCreateCattle, validateUpdateCattle } from '../middleware/validation';
import type { Cattle } from '../../../shared/type';

const router = Router();

// GET /cattle — list with optional filters
router.get(
  '/',
  asyncHandler((req: Request, res: Response) => {
    const { status, breed, search } = req.query;

    let query = 'SELECT * FROM cattle WHERE 1=1';
    const params: unknown[] = [];

    // Default: show only active cattle unless status is explicitly specified
    if (!status || status === '') {
      query += ' AND status = ?';
      params.push('active');
    } else {
      query += ' AND status = ?';
      params.push(status as string);
    }

    if (breed && breed !== '') {
      query += ' AND breed = ?';
      params.push(breed as string);
    }

    if (search && search !== '') {
      query += ' AND tag LIKE ?';
      params.push(`%${(search as string).toUpperCase()}%`);
    }

    query += ' ORDER BY created_at DESC';

    const stmt = db.prepare(query);
    const cattle = stmt.all(...params) as Cattle[];

    res.json({ data: cattle, count: cattle.length });
  }),
);

// GET /cattle/:id — single record
router.get(
  '/:id',
  asyncHandler((req: Request, res: Response) => {
    const cattle = queries.getCattle.get(req.params.id) as Cattle | undefined;

    if (!cattle) {
      throw new AppError('Cattle not found', 404);
    }

    res.json({ data: cattle });
  }),
);

// POST /cattle — create
router.post(
  '/',
  asyncHandler((req: Request, res: Response) => {
    const input = validateCreateCattle(req.body);

    // Check tag uniqueness
    const existing = queries.getCattleByTag.get(input.tag) as Cattle | undefined;
    if (existing) {
      throw new AppError('Tag already exists', 400);
    }

    const id = randomUUID();
    const now = new Date().toISOString();

    queries.createCattle.run(id, input.tag, input.breed, input.gender, input.birth_date, 'active', now, now);

    const cattle = queries.getCattle.get(id) as Cattle;
    res.status(201).json({ data: cattle });
  }),
);

// PATCH /cattle/:id — partial update
router.patch(
  '/:id',
  asyncHandler((req: Request, res: Response) => {
    const cattle = queries.getCattle.get(req.params.id) as Cattle | undefined;
    if (!cattle) {
      throw new AppError('Cattle not found', 404);
    }

    const updates = validateUpdateCattle(req.body);

    // If tag is being updated, check uniqueness (excluding self)
    if (updates.tag && updates.tag !== cattle.tag) {
      const existing = queries.getCattleByTag.get(updates.tag) as Cattle | undefined;
      if (existing) {
        throw new AppError('Tag already exists', 400);
      }
    }

    const tag = updates.tag ?? cattle.tag;
    const breed = updates.breed ?? cattle.breed;
    const gender = updates.gender ?? cattle.gender;
    const birth_date = updates.birth_date ?? cattle.birth_date;
    const status = updates.status ?? cattle.status;
    const now = new Date().toISOString();

    queries.updateCattle.run(tag, breed, gender, birth_date, status, now, req.params.id);

    const updated = queries.getCattle.get(req.params.id) as Cattle;
    res.json({ data: updated });
  }),
);

// DELETE /cattle/:id — soft delete via status update
router.delete(
  '/:id',
  asyncHandler((req: Request, res: Response) => {
    const cattle = queries.getCattle.get(req.params.id) as Cattle | undefined;
    if (!cattle) {
      throw new AppError('Cattle not found', 404);
    }

    const now = new Date().toISOString();
    queries.updateCattleStatus.run('removed', now, req.params.id);

    res.status(204).send();
  }),
);

export default router;

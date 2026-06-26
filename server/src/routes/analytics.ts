import { Router, Request, Response } from 'express';
import db from '../db';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

interface StatusBreakdown {
  status: string;
  count: number;
}

interface BreedBreakdown {
  breed: string;
  count: number;
}

interface GenderBreakdown {
  gender: string;
  count: number;
}

interface AgeGroup {
  range: string;
  count: number;
}

// GET /analytics — dashboard metrics
router.get(
  '/',
  asyncHandler((req: Request, res: Response) => {
    // Total active count
    const totalActive = db.prepare('SELECT COUNT(*) as count FROM cattle WHERE status = ?').get('active') as { count: number };

    // Breakdown by status
    const byStatus = db.prepare(`
      SELECT status, COUNT(*) as count FROM cattle GROUP BY status ORDER BY count DESC
    `).all() as StatusBreakdown[];

    // Breakdown by breed (only active)
    const byBreed = db.prepare(`
      SELECT breed, COUNT(*) as count FROM cattle WHERE status = ? GROUP BY breed ORDER BY count DESC
    `).all('active') as BreedBreakdown[];

    // Breakdown by gender (only active)
    const byGender = db.prepare(`
      SELECT gender, COUNT(*) as count FROM cattle WHERE status = ? GROUP BY gender
    `).all('active') as GenderBreakdown[];

    // Age distribution (simple bucketing)
    const ageDistribution = db.prepare(`
      WITH age_groups AS (
        SELECT
          CASE
            WHEN (julianday('now') - julianday(birth_date)) / 365.25 < 1 THEN 1
            WHEN (julianday('now') - julianday(birth_date)) / 365.25 < 3 THEN 2
            WHEN (julianday('now') - julianday(birth_date)) / 365.25 < 5 THEN 3
            WHEN (julianday('now') - julianday(birth_date)) / 365.25 < 8 THEN 4
            ELSE 5
          END as bucket
        FROM cattle
        WHERE status = ?
      )
      SELECT
        CASE bucket
          WHEN 1 THEN '0-1 years'
          WHEN 2 THEN '1-3 years'
          WHEN 3 THEN '3-5 years'
          WHEN 4 THEN '5-8 years'
          WHEN 5 THEN '8+ years'
        END as range,
        COUNT(*) as count
      FROM age_groups
      GROUP BY bucket
      ORDER BY bucket
    `).all('active') as AgeGroup[];

    // Total overall count
    const totalCount = db.prepare('SELECT COUNT(*) as count FROM cattle').get() as { count: number };

    res.json({
      summary: {
        totalActive: totalActive.count,
        totalCount: totalCount.count,
      },
      byStatus,
      byBreed,
      byGender,
      ageDistribution,
    });
  }),
);

export default router;

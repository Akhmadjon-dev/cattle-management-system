import { Router, Request, Response } from 'express';
import db from '../db';
import { asyncHandler } from '../middleware/errorHandler';

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

interface HealthCoverage {
  totalActive: number;
  withHealthEvents: number;
  withoutHealthEvents: number;
  coveragePercent: number;
}

interface RemovalStats {
  totalRemoved: number;
  sold: number;
  deceased: number;
  removed: number;
  mortalityRate: number;
}

interface Alert {
  type: string;
  count: number;
  severity: 'info' | 'warning' | 'high';
  message: string;
}

interface BreedPerformance {
  breed: string;
  count: number;
  avgAge: number;
  healthEventsPerCattle: number;
}

interface AnalyticsResponse {
  summary: {
    totalActive: number;
    totalCount: number;
  };
  byStatus: StatusBreakdown[];
  byBreed: BreedBreakdown[];
  byGender: GenderBreakdown[];
  ageDistribution: AgeGroup[];
  healthCoverage: HealthCoverage;
  alerts: Alert[];
  removalStats: RemovalStats;
  breedPerformance: BreedPerformance[];
}

const router = Router();

// GET /analytics — comprehensive dashboard metrics (TIER 1 features)
router.get(
  '/',
  asyncHandler((req: Request, res: Response) => {
    // Total active count
    const totalActive = db.prepare('SELECT COUNT(*) as count FROM cattle WHERE status = ?').get('active') as { count: number };

    // Total overall count
    const totalCount = db.prepare('SELECT COUNT(*) as count FROM cattle').get() as { count: number };

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

    // TIER 1 FEATURE: Health Coverage
    const healthCoverageQuery = db.prepare(`
      SELECT
        COUNT(DISTINCT c.id) as total_active,
        COUNT(DISTINCT CASE WHEN he.id IS NOT NULL THEN c.id END) as with_events
      FROM cattle c
      LEFT JOIN health_events he ON c.id = he.cattle_id
      WHERE c.status = 'active'
    `).get() as { total_active: number; with_events: number };

    const totalActiveCattle = healthCoverageQuery.total_active;
    const withHealthEvents = healthCoverageQuery.with_events;
    const withoutHealthEvents = totalActiveCattle - withHealthEvents;
    const coveragePercent = totalActiveCattle > 0 ? Math.round((withHealthEvents / totalActiveCattle) * 100) : 0;

    const healthCoverage: HealthCoverage = {
      totalActive: totalActiveCattle,
      withHealthEvents,
      withoutHealthEvents,
      coveragePercent,
    };

    // TIER 1 FEATURE: Removal Statistics
    const removalBreakdown = db.prepare(`
      SELECT status, COUNT(*) as count FROM cattle
      WHERE status IN ('sold', 'deceased', 'removed')
      GROUP BY status
    `).all() as Array<{ status: string; count: number }>;

    const removalStats: RemovalStats = {
      totalRemoved: removalBreakdown.reduce((sum, r) => sum + r.count, 0),
      sold: removalBreakdown.find(r => r.status === 'sold')?.count || 0,
      deceased: removalBreakdown.find(r => r.status === 'deceased')?.count || 0,
      removed: removalBreakdown.find(r => r.status === 'removed')?.count || 0,
      mortalityRate: 0,
    };

    // Calculate mortality rate: (deceased / all cattle ever)
    if (totalCount.count > 0) {
      removalStats.mortalityRate = Math.round((removalStats.deceased / totalCount.count) * 100 * 10) / 10;
    }

    // TIER 1 FEATURE: Alerts for actionable insights
    const alerts: Alert[] = [];

    // Alert 1: Cattle with no health events
    if (withoutHealthEvents > 0) {
      alerts.push({
        type: 'no_health_events',
        count: withoutHealthEvents,
        severity: 'warning',
        message: `${withoutHealthEvents} cattle have no health records`,
      });
    }

    // Alert 2: Cattle overdue for checkup (no health event in last 90 days)
    const overdueQuery = db.prepare(`
      SELECT COUNT(*) as count FROM cattle c
      WHERE c.status = 'active'
        AND (
          NOT EXISTS (SELECT 1 FROM health_events WHERE cattle_id = c.id)
          OR (julianday('now') - julianday(
            (SELECT MAX(date) FROM health_events WHERE cattle_id = c.id)
          )) > 90
        )
    `).get() as { count: number };

    if (overdueQuery.count > 0) {
      alerts.push({
        type: 'overdue_checkup',
        count: overdueQuery.count,
        severity: 'high',
        message: `${overdueQuery.count} cattle overdue for health checkup (>90 days)`,
      });
    }

    // Alert 3: Cattle ready for breeding age (2-5 years old)
    const breedingReadyQuery = db.prepare(`
      SELECT COUNT(*) as count FROM cattle
      WHERE status = 'active'
        AND (julianday('now') - julianday(birth_date)) / 365.25 BETWEEN 2 AND 5
    `).get() as { count: number };

    if (breedingReadyQuery.count > 0) {
      alerts.push({
        type: 'breeding_age_ready',
        count: breedingReadyQuery.count,
        severity: 'info',
        message: `${breedingReadyQuery.count} cattle are at breeding age (2-5 years)`,
      });
    }

    // Sort alerts by severity (high > warning > info)
    const severityOrder = { high: 0, warning: 1, info: 2 };
    alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    // TIER 1 FEATURE: Breed Performance
    const breedPerformanceQuery = db.prepare(`
      SELECT
        c.breed,
        COUNT(DISTINCT c.id) as count,
        AVG((julianday('now') - julianday(c.birth_date)) / 365.25) as avg_age,
        CAST(COUNT(he.id) AS FLOAT) / COUNT(DISTINCT c.id) as health_events_per_cattle
      FROM cattle c
      LEFT JOIN health_events he ON c.id = he.cattle_id
      WHERE c.status = 'active'
      GROUP BY c.breed
      ORDER BY count DESC
    `).all() as Array<{
      breed: string;
      count: number;
      avg_age: number;
      health_events_per_cattle: number;
    }>;

    const breedPerformance: BreedPerformance[] = breedPerformanceQuery.map(bp => ({
      breed: bp.breed,
      count: bp.count,
      avgAge: Math.round(bp.avg_age * 10) / 10,
      healthEventsPerCattle: Math.round(bp.health_events_per_cattle * 10) / 10,
    }));

    const response: AnalyticsResponse = {
      summary: {
        totalActive: totalActive.count,
        totalCount: totalCount.count,
      },
      byStatus,
      byBreed,
      byGender,
      ageDistribution,
      healthCoverage,
      alerts,
      removalStats,
      breedPerformance,
    };

    res.json({ data: response });
  }),
);

export default router;

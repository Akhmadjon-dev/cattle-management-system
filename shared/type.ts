export type Gender = 'male' | 'female';
export type CattleStatus = 'active' | 'sold' | 'deceased' | 'removed';
export type HealthEventType = 'vaccination' | 'treatment' | 'checkup';

export interface Cattle {
  id: string;
  tag: string;
  breed: string;
  gender: Gender;
  birth_date: string;
  status: CattleStatus;
  created_at: string;
  updated_at: string;
}

export interface HealthEvent {
  id: string;
  cattle_id: string;
  type: HealthEventType;
  date: string;
  notes?: string;
  created_at: string;
}

export interface CreateCattleInput {
  tag: string;
  breed: string;
  gender: Gender;
  birth_date: string;
}

export interface CreateHealthEventInput {
  type: HealthEventType;
  date: string;
  notes?: string;
}

// TIER 1 Analytics - Actionable Insights
export interface HealthCoverage {
  totalActive: number;
  withHealthEvents: number;
  withoutHealthEvents: number;
  coveragePercent: number;
}

export interface RemovalStats {
  totalRemoved: number;
  sold: number;
  deceased: number;
  removed: number;
  mortalityRate: number;
}

export interface Alert {
  type: string;
  count: number;
  severity: 'info' | 'warning' | 'high';
  message: string;
}

export interface BreedPerformance {
  breed: string;
  count: number;
  avgAge: number;
  healthEventsPerCattle: number;
}

export interface AnalyticsData {
  summary: { totalActive: number; totalCount: number };
  byStatus: Array<{ status: string; count: number }>;
  byBreed: Array<{ breed: string; count: number }>;
  byGender: Array<{ gender: string; count: number }>;
  ageDistribution: Array<{ range: string; count: number }>;
  healthCoverage: HealthCoverage;
  alerts: Alert[];
  removalStats: RemovalStats;
  breedPerformance: BreedPerformance[];
}

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

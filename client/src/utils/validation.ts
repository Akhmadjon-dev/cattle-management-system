import type { Gender, CattleStatus, HealthEventType } from '@shared/type';

export const VALID_GENDERS: Gender[] = ['male', 'female'];
export const VALID_STATUSES: CattleStatus[] = ['active', 'sold', 'deceased', 'removed'];
export const VALID_HEALTH_EVENT_TYPES: HealthEventType[] = ['vaccination', 'treatment', 'checkup'];

/**
 * Validate gender is one of the allowed values
 */
export const isValidGender = (value: unknown): value is Gender => {
  return VALID_GENDERS.includes(value as Gender);
};

/**
 * Validate status is one of the allowed values
 */
export const isValidStatus = (value: unknown): value is CattleStatus => {
  return VALID_STATUSES.includes(value as CattleStatus);
};

/**
 * Validate health event type is one of the allowed values
 */
export const isValidHealthEventType = (value: unknown): value is HealthEventType => {
  return VALID_HEALTH_EVENT_TYPES.includes(value as HealthEventType);
};

/**
 * Validate date is in YYYY-MM-DD format
 */
export const isValidDateFormat = (date: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) return false;

  const d = new Date(date);
  return !isNaN(d.getTime());
};

/**
 * Validate that a date is not in the future
 */
export const isDateNotFuture = (date: string): boolean => {
  const d = new Date(date);
  return d <= new Date();
};

/**
 * Validate cattle tag (non-empty, reasonable length)
 */
export const isValidTag = (tag: string): boolean => {
  return tag.trim().length > 0 && tag.length <= 50;
};

/**
 * Validate breed (non-empty, reasonable length)
 */
export const isValidBreed = (breed: string): boolean => {
  return breed.trim().length > 0 && breed.length <= 50;
};

/**
 * Validate notes (optional, reasonable length)
 */
export const isValidNotes = (notes: string | undefined): boolean => {
  if (!notes) return true;
  return notes.length <= 500;
};

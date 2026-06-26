import { AppError } from './errorHandler';
import type { Gender, CattleStatus, HealthEventType, CreateCattleInput, CreateHealthEventInput } from '../../../shared/type';

const validGenders: Gender[] = ['male', 'female'];
const validStatuses: CattleStatus[] = ['active', 'sold', 'deceased', 'removed'];
const validEventTypes: HealthEventType[] = ['vaccination', 'treatment', 'checkup'];

const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(dateString);
};

export const validateCreateCattle = (data: unknown): CreateCattleInput => {
  if (typeof data !== 'object' || data === null) {
    throw new AppError('Invalid input', 400);
  }

  const input = data as Record<string, unknown>;

  if (!input.tag || typeof input.tag !== 'string' || input.tag.trim() === '') {
    throw new AppError('Tag is required and must be a non-empty string', 400);
  }

  if (!input.breed || typeof input.breed !== 'string' || input.breed.trim() === '') {
    throw new AppError('Breed is required', 400);
  }

  if (!input.gender || !validGenders.includes(input.gender as Gender)) {
    throw new AppError('Gender must be either "male" or "female"', 400);
  }

  if (!input.birth_date || !isValidDate(input.birth_date as string)) {
    throw new AppError('Birth date is required and must be in YYYY-MM-DD format', 400);
  }

  return {
    tag: input.tag.trim(),
    breed: input.breed.trim(),
    gender: input.gender as Gender,
    birth_date: input.birth_date as string,
  };
};

export const validateUpdateCattle = (data: unknown): Partial<CreateCattleInput> & { status?: CattleStatus } => {
  if (typeof data !== 'object' || data === null) {
    throw new AppError('Invalid input', 400);
  }

  const input = data as Record<string, unknown>;
  const result: Partial<CreateCattleInput> & { status?: CattleStatus } = {};

  if ('tag' in input) {
    if (typeof input.tag !== 'string' || input.tag.trim() === '') {
      throw new AppError('Tag must be a non-empty string', 400);
    }
    result.tag = input.tag.trim();
  }

  if ('breed' in input) {
    if (typeof input.breed !== 'string' || input.breed.trim() === '') {
      throw new AppError('Breed must be a non-empty string', 400);
    }
    result.breed = input.breed.trim();
  }

  if ('gender' in input) {
    if (!validGenders.includes(input.gender as Gender)) {
      throw new AppError('Gender must be either "male" or "female"', 400);
    }
    result.gender = input.gender as Gender;
  }

  if ('birth_date' in input) {
    if (!isValidDate(input.birth_date as string)) {
      throw new AppError('Birth date must be in YYYY-MM-DD format', 400);
    }
    result.birth_date = input.birth_date as string;
  }

  if ('status' in input) {
    if (!validStatuses.includes(input.status as CattleStatus)) {
      throw new AppError('Status must be one of: active, sold, deceased, removed', 400);
    }
    result.status = input.status as CattleStatus;
  }

  return result;
};

export const validateCreateHealthEvent = (data: unknown): CreateHealthEventInput => {
  if (typeof data !== 'object' || data === null) {
    throw new AppError('Invalid input', 400);
  }

  const input = data as Record<string, unknown>;

  if (!input.type || !validEventTypes.includes(input.type as HealthEventType)) {
    throw new AppError('Type must be one of: vaccination, treatment, checkup', 400);
  }

  if (!input.date || !isValidDate(input.date as string)) {
    throw new AppError('Date is required and must be in YYYY-MM-DD format', 400);
  }

  const notes = input.notes ? (input.notes as string).trim() : undefined;

  return {
    type: input.type as HealthEventType,
    date: input.date as string,
    notes,
  };
};

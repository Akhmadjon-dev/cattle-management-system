import db from './db';
import { randomUUID } from 'crypto';
import type { Cattle, HealthEvent } from '../../shared/type';

const randomId = () => randomUUID();

const breeds = [
  'Angus',
  'Brahman',
  'Hereford',
  'Jersey',
  'Charolais',
  'Simmental',
  'Holstein',
  'Limousin',
];

const getRandomDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString().split('T')[0];
};

const getBirthDate = (minYears: number, maxYears: number): string => {
  const today = new Date();
  const yearsAgo = minYears + Math.random() * (maxYears - minYears);
  const birthDate = new Date(today.getFullYear() - Math.floor(yearsAgo), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
  return birthDate.toISOString().split('T')[0];
};

const seedDatabase = (): void => {
  try {
    // Clear existing data
    db.exec('DELETE FROM health_events');
    db.exec('DELETE FROM cattle');

    const now = new Date().toISOString();
    const cattleIds: string[] = [];

    // Insert 20 cattle
    for (let i = 1; i <= 20; i++) {
      const id = randomId();
      cattleIds.push(id);

      const tag = `TAG-${String(i).padStart(4, '0')}`;
      const breed = breeds[Math.floor(Math.random() * breeds.length)];
      const gender = Math.random() > 0.5 ? 'male' : 'female';
      const birthDate = getBirthDate(1, 8);
      const statuses: Array<'active' | 'sold' | 'deceased' | 'removed'> = ['active', 'sold', 'deceased', 'removed'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      const insertCattle = db.prepare(`
        INSERT INTO cattle (id, tag, breed, gender, birth_date, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insertCattle.run(id, tag, breed, gender, birthDate, status, now, now);
    }

    // Insert health events (5-8 per cattle)
    const eventTypes: Array<'vaccination' | 'treatment' | 'checkup'> = [
      'vaccination',
      'treatment',
      'checkup',
    ];

    const eventNotes = [
      'Routine checkup - all vitals normal',
      'Vaccinated against disease X',
      'Treated for minor infection',
      'Annual health inspection',
      'Post-treatment follow-up',
      'Routine vaccination',
      'Parasite treatment',
      'Weight monitoring',
      'Horn trimming and health check',
      'Preventive care visit',
    ];

    for (const cattleId of cattleIds) {
      const eventCount = Math.floor(Math.random() * 4) + 5; // 5-8 events

      for (let j = 0; j < eventCount; j++) {
        const eventId = randomId();
        const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const eventDate = getRandomDate(365);
        const notes = eventNotes[Math.floor(Math.random() * eventNotes.length)];

        const insertEvent = db.prepare(`
          INSERT INTO health_events (id, cattle_id, type, date, notes, created_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `);

        insertEvent.run(eventId, cattleId, type, eventDate, notes, now);
      }
    }

    console.log('✅ Database seeded successfully!');
    console.log(`   - 20 cattle inserted`);
    console.log(`   - ~120 health events inserted`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedDatabase();

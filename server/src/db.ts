import Database from 'better-sqlite3';
import path from 'path';

const db: Database.Database = new Database(path.join(__dirname, '../cattle.db'));

db.pragma('journal_mode = WAL');

const initDatabase = (): void => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS cattle (
      id TEXT PRIMARY KEY,
      tag TEXT UNIQUE NOT NULL,
      breed TEXT NOT NULL,
      gender TEXT NOT NULL CHECK(gender IN ('male', 'female')),
      birth_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'sold', 'deceased', 'removed')),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS health_events (
      id TEXT PRIMARY KEY,
      cattle_id TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('vaccination', 'treatment', 'checkup')),
      date TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (cattle_id) REFERENCES cattle(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_cattle_status ON cattle(status);
    CREATE INDEX IF NOT EXISTS idx_cattle_breed ON cattle(breed);
    CREATE INDEX IF NOT EXISTS idx_health_events_cattle_id ON health_events(cattle_id);
  `);
};

initDatabase();

export default db;

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

// Query helpers for cleaner code in routes
export const queries: Record<string, Database.Statement<unknown[]>> = {
  // Cattle queries
  getCattle: db.prepare('SELECT * FROM cattle WHERE id = ?'),
  getAllCattle: db.prepare('SELECT * FROM cattle ORDER BY created_at DESC'),
  getCattleByTag: db.prepare('SELECT * FROM cattle WHERE tag = ?'),
  getCattleByStatus: db.prepare('SELECT * FROM cattle WHERE status = ? ORDER BY created_at DESC'),
  createCattle: db.prepare(`
    INSERT INTO cattle (id, tag, breed, gender, birth_date, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),
  updateCattle: db.prepare(`
    UPDATE cattle SET tag = ?, breed = ?, gender = ?, birth_date = ?, status = ?, updated_at = ?
    WHERE id = ?
  `),
  updateCattleStatus: db.prepare('UPDATE cattle SET status = ?, updated_at = ? WHERE id = ?'),
  deleteCattle: db.prepare('DELETE FROM cattle WHERE id = ?'),
  countCattle: db.prepare('SELECT COUNT(*) as count FROM cattle'),
  countByStatus: db.prepare('SELECT status, COUNT(*) as count FROM cattle GROUP BY status'),

  // Health events queries
  getHealthEvents: db.prepare('SELECT * FROM health_events WHERE cattle_id = ? ORDER BY date DESC'),
  getHealthEvent: db.prepare('SELECT * FROM health_events WHERE id = ?'),
  createHealthEvent: db.prepare(`
    INSERT INTO health_events (id, cattle_id, type, date, notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `),
  deleteHealthEvent: db.prepare('DELETE FROM health_events WHERE id = ?'),
};

export default db;

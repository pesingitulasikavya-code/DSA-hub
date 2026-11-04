import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  completedTopics: string[];
}

const databasePath = process.env.DSA_HUB_DB_PATH || path.resolve(process.cwd(), 'data', 'dsahub.sqlite');
fs.mkdirSync(path.dirname(databasePath), { recursive: true });

const database = new Database(databasePath);
database.pragma('journal_mode = WAL');
database.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS progress (
    email TEXT NOT NULL,
    topic_id TEXT NOT NULL,
    PRIMARY KEY (email, topic_id),
    FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
  );
`);

const selectUserStatement = database.prepare('SELECT id, name, email, password FROM users WHERE email = ?');
const insertUserStatement = database.prepare('INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)');
const selectProgressStatement = database.prepare('SELECT topic_id FROM progress WHERE email = ? ORDER BY topic_id');
const insertProgressStatement = database.prepare('INSERT OR IGNORE INTO progress (email, topic_id) VALUES (?, ?)');
const deleteProgressStatement = database.prepare('DELETE FROM progress WHERE email = ? AND topic_id = ?');

export function getStoredUser(email: string): StoredUser | undefined {
  const cleanEmail = email.toLowerCase().trim();
  const row = selectUserStatement.get(cleanEmail) as { id: string; name: string; email: string; password: string } | undefined;
  if (!row) return undefined;

  return {
    ...row,
    completedTopics: getStoredProgress(cleanEmail),
  };
}

export function createStoredUser(user: Omit<StoredUser, 'completedTopics'>): StoredUser {
  insertUserStatement.run(user.id, user.name.trim(), user.email.toLowerCase().trim(), user.password);
  return { ...user, completedTopics: [] };
}

export function getStoredProgress(email: string): string[] {
  const rows = selectProgressStatement.all(email.toLowerCase().trim()) as Array<{ topic_id: string }>;
  return rows.map((row) => row.topic_id);
}

export function toggleStoredProgress(email: string, topicId: string): string[] {
  const cleanEmail = email.toLowerCase().trim();
  const completedTopics = getStoredProgress(cleanEmail);

  if (completedTopics.includes(topicId)) {
    deleteProgressStatement.run(cleanEmail, topicId);
  } else {
    insertProgressStatement.run(cleanEmail, topicId);
  }

  return getStoredProgress(cleanEmail);
}

if (!getStoredUser('student@dsahub.edu')) {
  createStoredUser({
    id: 'student_01',
    name: 'Alan Turing',
    email: 'student@dsahub.edu',
    password: 'password123',
  });
}

import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'signups.db');

export function initDb() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        reject(err);
        return;
      }
      
      db.run(`
        CREATE TABLE IF NOT EXISTS signups (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT NOT NULL,
          birth_date TEXT,
          phone TEXT,
          region TEXT NOT NULL,
          constituency TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(db);
      });
    });
  });
}

export function saveSignup(db, data) {
  return new Promise((resolve, reject) => {
    const { first_name, last_name, email, birth_date, phone, region, constituency } = data;
    const query = `
      INSERT INTO signups (first_name, last_name, email, birth_date, phone, region, constituency)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(query, [first_name, last_name, email, birth_date || null, phone || null, region, constituency], function(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve({ id: this.lastID, message: 'Signup saved successfully' });
    });
  });
}

export function getAllSignups(db) {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM signups ORDER BY created_at DESC', (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows || []);
    });
  });
}

export function checkDuplicate(db, email, first_name, last_name) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM signups WHERE email = ? AND first_name = ? AND last_name = ?';
    db.get(query, [email, first_name, last_name], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row || null);
    });
  });
}

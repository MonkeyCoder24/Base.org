import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export function initDb() {
  return new Promise(async (resolve, reject) => {
    try {
      const client = await pool.connect();
      
      await client.query(`
        CREATE TABLE IF NOT EXISTS signups (
          id SERIAL PRIMARY KEY,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT NOT NULL,
          birth_date TEXT,
          phone TEXT,
          region TEXT NOT NULL,
          constituency TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      client.release();
      resolve(pool);
    } catch (err) {
      reject(err);
    }
  });
}

export function saveSignup(pool, data) {
  return new Promise(async (resolve, reject) => {
    try {
      const { first_name, last_name, email, birth_date, phone, region, constituency } = data;
      const query = `
        INSERT INTO signups (first_name, last_name, email, birth_date, phone, region, constituency)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `;
      
      const result = await pool.query(query, [first_name, last_name, email, birth_date || null, phone || null, region, constituency]);
      resolve({ id: result.rows[0].id, message: 'Signup saved successfully' });
    } catch (err) {
      reject(err);
    }
  });
}

export function getAllSignups(pool) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await pool.query('SELECT * FROM signups ORDER BY created_at DESC');
      resolve(result.rows || []);
    } catch (err) {
      reject(err);
    }
  });
}

export function checkDuplicate(pool, email, first_name, last_name) {
  return new Promise(async (resolve, reject) => {
    try {
      const query = 'SELECT * FROM signups WHERE email = $1 AND first_name = $2 AND last_name = $3';
      const result = await pool.query(query, [email, first_name, last_name]);
      resolve(result.rows[0] || null);
    } catch (err) {
      reject(err);
    }
  });
}

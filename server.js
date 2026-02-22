import express from 'express';
import cors from 'cors';
import { initDb, saveSignup, getAllSignups, checkDuplicate } from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

let db = null;

// Initialize database on startup
initDb()
  .then((pool) => {
    db = pool;
    console.log('Database initialized.');
  })
  .catch((err) => {
    console.error('Database initialization failed:', err);
    process.exit(1);
  });

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// POST /api/signup - Store signup data
app.post('/api/signup', async (req, res) => {
  try {
    const { first, last, email, birth, phone, region, constituency } = req.body;

    // Validate required fields
    if (!first || !last || !email || !region || !constituency) {
      return res.status(400).json({
        error: 'Missing required fields: first, last, email, region, constituency'
      });
    }

    // Check for duplicates
    const duplicate = await checkDuplicate(db, email, first, last);
    if (duplicate) {
      return res.status(409).json({
        error: 'This signup already exists. Please use different information.'
      });
    }

    // Save to database
    const result = await saveSignup(db, {
      first_name: first,
      last_name: last,
      email,
      birth_date: birth,
      phone,
      region,
      constituency
    });

    res.status(201).json({
      success: true,
      message: 'Signup recorded successfully',
      data: result
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({
      error: 'Failed to save signup',
      details: err.message
    });
  }
});

// GET /api/signups - Retrieve all signups (for admin/dashboard)
app.get('/api/signups', async (req, res) => {
  try {
    const signups = await getAllSignups(db);
    res.json({
      success: true,
      count: signups.length,
      data: signups
    });
  } catch (err) {
    console.error('Fetch signups error:', err);
    res.status(500).json({
      error: 'Failed to fetch signups',
      details: err.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API endpoint: POST http://localhost:${PORT}/api/signup`);
  console.log(`Signups list: GET http://localhost:${PORT}/api/signups`);
});

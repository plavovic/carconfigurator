const { Pool } = require('pg');
const path = require('path');

// Always load the backend/.env file, even if node is run from the repo root.
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Create a connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  // pg's SCRAM auth expects a string; dotenv may be missing if loaded from wrong cwd.
  password: process.env.DB_PASSWORD != null ? String(process.env.DB_PASSWORD) : undefined,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
});

// Handle connection errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Database connected successfully at:', res.rows[0].now);
  }
});

module.exports = pool;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_fallback_secret';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@admin.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

function canonicalStatus(input) {
  if (!input) return null;
  return input
    .toString()
    .trim()
    .replace(/[-\s]+/g, '_')
    .toUpperCase();
}

function verifyAuthHeader(req) {
  const auth = req.headers.authorization || '';
  const [, token] = auth.split(' ');
  if (!token) throw new Error('Missing token');
  return jwt.verify(token, JWT_SECRET);
}

/**
 * REGISTER USER
 */
exports.register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, first_name, last_name`,
      [email, passwordHash, first_name, last_name, phone]
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: result.rows[0],
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * LOGIN USER
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Hardcoded admin login (no DB lookup)
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = jwt.sign(
        { id: 'admin', email: ADMIN_EMAIL, role: 'admin' },
        JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
      );

      return res.json({
        message: 'Login successful',
        token,
        user: {
          id: 'admin',
          email: ADMIN_EMAIL,
          first_name: 'Admin',
          last_name: '',
          role: 'admin',
        },
      });
    }

    // Find user
    const result = await pool.query(
      `SELECT id, email, password_hash, first_name, last_name, is_active
       FROM users
       WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({ message: 'User account is inactive' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'user' },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: 'user',
      },
    });
  } catch (error) {
  console.error('Login error FULL:', error);
  res.status(500).json({
    message: 'Server error',
    error: error.message,
  });
}

};

exports.me = async (req, res) => {
  try {
    const decoded = verifyAuthHeader(req);
    
    // Handle admin user (id is 'admin' string, not in database)
    if (decoded.id === 'admin' || decoded.role === 'admin') {
      const ordersResult = await pool.query(
        `SELECT order_number, configuration_id, status, total_amount, created_at
         FROM orders
         ORDER BY created_at DESC`
      );
      
      return res.json({
        user: {
          id: 'admin',
          email: decoded.email,
          first_name: 'Admin',
          last_name: '',
          role: 'admin',
        },
        orders: ordersResult.rows,
      });
    }
    
    const userResult = await pool.query(
      `SELECT id, email, first_name, last_name
       FROM users
       WHERE id = $1`,
      [decoded.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const ordersResult = await pool.query(
      `SELECT id, order_number, status, created_at, model_name, color, total_amount
       FROM orders
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [decoded.id]
    );

    const orders = ordersResult.rows.map((row) => ({
      ...row,
      status: canonicalStatus(row.status) || 'PENDING',
    }));

    res.json({ user: userResult.rows[0], orders });
  } catch (error) {
    console.error('Current user error:', error);
    const message = error.name === 'JsonWebTokenError' || error.message === 'Missing token'
      ? 'Unauthorized'
      : 'Server error';
    const status = message === 'Unauthorized' ? 401 : 500;
    res.status(status).json({ message });
  }
};

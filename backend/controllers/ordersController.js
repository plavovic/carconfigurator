const pool = require('../db');
const { sendOrderConfirmation } = require('../services/emailService');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_fallback_secret';
// Limited to three lifecycle states per request
const ALLOWED_STATUSES = ['PENDING', 'IN_PREPARATION', 'READY_FOR_TEST'];

function canonicalStatus(input) {
  if (!input) return null;
  return input
    .toString()
    .trim()
    .replace(/[-\s]+/g, '_')
    .toUpperCase();
}

function generateOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${ts}-${rand}`;
}

exports.create = async (req, res) => {
  const { id: userId, email: userEmail, role } = req.user || {};
  const {
    configurationId = null,
    totalAmount = 0,
    modelName = null,
    color = null,
  } = req.body || {};

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  // Prevent admin token (id = 'admin') from creating orders, and ensure numeric user id
  const userIdNumber = Number(userId);
  if (role === 'admin' || Number.isNaN(userIdNumber)) {
    return res.status(403).json({ message: 'Admins cannot create orders' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orderNumber = generateOrderNumber();
    const status = 'PENDING';
    const insertResult = await client.query(
      `INSERT INTO orders (user_id, configuration_id, order_number, model_name, color, total_amount, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, user_id, configuration_id, order_number, model_name, color, total_amount, status, created_at, updated_at`,
      [userId, configurationId, orderNumber, modelName, color, totalAmount, status]
    );

    const order = {
      ...insertResult.rows[0],
      model_name: modelName,
      color,
    };

    // Fetch user info for greeting
    let userName = null;
    try {
      const u = await client.query('SELECT first_name, last_name, email FROM users WHERE id = $1', [userId]);
      if (u.rows[0]) {
        const { first_name, last_name, email } = u.rows[0];
        userName = [first_name, last_name].filter(Boolean).join(' ') || email;
      }
    } catch (e) {
      console.warn('User lookup for email failed:', e.message);
    }

    await client.query('COMMIT');

    // Fire-and-forget email; do not block response
    (async () => {
      try {
        await sendOrderConfirmation({
          to: userEmail || userName, // fallback to looked-up email
          userName: userName || req.user?.email?.split('@')[0],
          order,
        });
      } catch (err) {
        console.error('Order email failed:', err.message);
      }
    })();

    return res.status(201).json({ order });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Order create error:', error);
    return res.status(500).json({ message: 'Failed to create order' });
  } finally {
    client.release();
  }
};

// ADMIN: list all orders
exports.listAll = async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, user_id, order_number, status, created_at, updated_at, model_name, color, total_amount
       FROM orders
       ORDER BY created_at DESC`
    );
    // Normalize status to canonical form for UI consistency
    const orders = result.rows.map((row) => ({
      ...row,
      status: canonicalStatus(row.status) || 'PENDING',
    }));
    return res.json({ orders });
  } catch (error) {
    console.error('Admin list orders error:', error);
    return res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// ADMIN: update order status
exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};

  const normalized = canonicalStatus(status);
  if (!normalized || !ALLOWED_STATUSES.includes(normalized)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const result = await pool.query(
      `UPDATE orders
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, user_id, order_number, status, created_at, updated_at, model_name, color, total_amount`,
          [normalized, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.json({ order: result.rows[0] });
  } catch (error) {
    console.error('Admin update status error:', error);
    return res.status(500).json({ message: 'Failed to update status' });
  }
};

// ADMIN: delete order
exports.remove = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM orders WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.json({ message: 'Order deleted', id: result.rows[0].id });
  } catch (error) {
    console.error('Admin delete order error:', error);
    return res.status(500).json({ message: 'Failed to delete order' });
  }
};

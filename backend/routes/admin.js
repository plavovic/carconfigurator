const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/admin');
const ordersController = require('../controllers/ordersController');

// List all orders
router.get('/orders', auth, adminOnly, ordersController.listAll);

// Update order status
router.patch('/orders/:id/status', auth, adminOnly, ordersController.updateStatus);

// Delete order
router.delete('/orders/:id', auth, adminOnly, ordersController.remove);

module.exports = router;

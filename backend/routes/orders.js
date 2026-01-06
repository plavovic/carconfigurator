const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ordersController = require('../controllers/ordersController');

// Create order and send confirmation email
router.post('/orders', auth, ordersController.create);

module.exports = router;

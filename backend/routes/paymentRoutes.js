const express = require('express');
const { createPaymentOrder, verifyPayment } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/create-order', protect, authorize('customer'), createPaymentOrder);
router.post('/verify', protect, authorize('customer'), verifyPayment);

module.exports = router;

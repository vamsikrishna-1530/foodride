const express = require('express');
const {
  createOrder,
  myOrders,
  restaurantOrders,
  availableForDelivery,
  myDeliveries,
  acceptDelivery,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('customer'), createOrder);
router.get('/my', protect, authorize('customer'), myOrders);
router.get('/restaurant', protect, authorize('owner'), restaurantOrders);
router.get('/delivery/available', protect, authorize('delivery'), availableForDelivery);
router.get('/delivery/mine', protect, authorize('delivery'), myDeliveries);
router.post('/:id/accept', protect, authorize('delivery'), acceptDelivery);
router.put('/:id/status', protect, authorize('owner', 'delivery', 'admin'), updateOrderStatus);

module.exports = router;

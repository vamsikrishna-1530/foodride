const express = require('express');
const {
  listRestaurants,
  getRestaurant,
  createRestaurant,
  myRestaurants,
  updateRestaurant,
  deleteRestaurant,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/restaurantController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', listRestaurants);
router.get('/mine', protect, authorize('owner'), myRestaurants);
router.get('/:id', getRestaurant);
router.post('/', protect, authorize('owner'), createRestaurant);
router.put('/:id', protect, authorize('owner', 'admin'), updateRestaurant);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteRestaurant);

router.post('/:id/menu', protect, authorize('owner'), addMenuItem);
router.put('/:id/menu/:itemId', protect, authorize('owner'), updateMenuItem);
router.delete('/:id/menu/:itemId', protect, authorize('owner'), deleteMenuItem);

module.exports = router;

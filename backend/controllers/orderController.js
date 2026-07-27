const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const { calculateOrderPricing } = require('../utils/pricing');

// Creates an order in "pending payment" state. Payment gets confirmed via /api/payment routes.
const createOrder = async (req, res, next) => {
  try {
    const { restaurantId, items, deliveryAddress } = req.body;
    if (!restaurantId || !Array.isArray(items) || items.length === 0 || !deliveryAddress) {
      return res.status(400).json({ message: 'restaurantId, items and deliveryAddress are required' });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const menuItems = await MenuItem.find({ _id: { $in: items.map((i) => i.menuItem) }, restaurant: restaurantId });
    const menuMap = new Map(menuItems.map((m) => [String(m._id), m]));

    let itemsTotal = 0;
    const orderItems = items.map(({ menuItem, quantity }) => {
      const found = menuMap.get(String(menuItem));
      if (!found) throw Object.assign(new Error('Invalid menu item in order'), { statusCode: 400 });
      itemsTotal += found.price * quantity;
      return { menuItem: found._id, name: found.name, price: found.price, quantity };
    });

    const pricing = calculateOrderPricing(itemsTotal, restaurant.commissionPercent);

    const order = await Order.create({
      customer: req.user._id,
      restaurant: restaurant._id,
      items: orderItems,
      deliveryAddress,
      ...pricing,
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

const myOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 }).populate('restaurant', 'name image');
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

const restaurantOrders = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find({ owner: req.user._id }).select('_id');
    const orders = await Order.find({ restaurant: { $in: restaurants.map((r) => r._id) } })
      .sort({ createdAt: -1 })
      .populate('customer', 'name phone');
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// Orders that are paid, ready for pickup, and not yet claimed by a delivery partner.
const availableForDelivery = async (req, res, next) => {
  try {
    const orders = await Order.find({
      status: { $in: ['ready_for_pickup'] },
      deliveryPartner: null,
      paymentStatus: 'paid',
    })
      .sort({ createdAt: 1 })
      .populate('restaurant', 'name address')
      .populate('customer', 'name phone address');
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

const myDeliveries = async (req, res, next) => {
  try {
    const orders = await Order.find({ deliveryPartner: req.user._id })
      .sort({ createdAt: -1 })
      .populate('restaurant', 'name address')
      .populate('customer', 'name phone address');
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

const acceptDelivery = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.deliveryPartner) return res.status(409).json({ message: 'Order already claimed' });
    order.deliveryPartner = req.user._id;
    order.status = 'picked_up';
    await order.save();
    res.json(order);
  } catch (err) {
    next(err);
  }
};

const VALID_STATUSES = [
  'placed',
  'accepted_by_restaurant',
  'preparing',
  'ready_for_pickup',
  'picked_up',
  'delivered',
  'cancelled',
];

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Restaurant owners manage placed -> ready_for_pickup; delivery partners manage picked_up -> delivered.
    if (req.user.role === 'owner') {
      const restaurant = await Restaurant.findById(order.restaurant);
      if (String(restaurant.owner) !== String(req.user._id)) {
        return res.status(403).json({ message: 'Not your restaurant' });
      }
    } else if (req.user.role === 'delivery') {
      if (String(order.deliveryPartner) !== String(req.user._id)) {
        return res.status(403).json({ message: 'Not your delivery' });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not permitted' });
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrder,
  myOrders,
  restaurantOrders,
  availableForDelivery,
  myDeliveries,
  acceptDelivery,
  updateOrderStatus,
};

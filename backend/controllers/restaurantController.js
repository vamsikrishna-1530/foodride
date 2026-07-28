const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const { escapeRegex } = require('../utils/escapeRegex');

const listRestaurants = async (req, res, next) => {
  try {
    const { search } = req.query;
    const filter = {};
    // Treat the term as a literal substring: an unescaped `(` (or any other
    // metacharacter) is an invalid regex and made this endpoint return 500.
    const term = escapeRegex(search);
    if (term) filter.name = { $regex: term, $options: 'i' };
    const restaurants = await Restaurant.find(filter).sort({ createdAt: -1 });
    res.json(restaurants);
  } catch (err) {
    next(err);
  }
};

const getRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    const menu = await MenuItem.find({ restaurant: restaurant._id });
    res.json({ restaurant, menu });
  } catch (err) {
    next(err);
  }
};

const createRestaurant = async (req, res, next) => {
  try {
    const { name, description, cuisine, address, image } = req.body;
    const restaurant = await Restaurant.create({
      owner: req.user._id,
      name,
      description,
      cuisine,
      address,
      image,
    });
    res.status(201).json(restaurant);
  } catch (err) {
    next(err);
  }
};

const myRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find({ owner: req.user._id });
    res.json(restaurants);
  } catch (err) {
    next(err);
  }
};

const ensureOwnership = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    res.status(404).json({ message: 'Restaurant not found' });
    return null;
  }
  if (String(restaurant.owner) !== String(req.user._id) && req.user.role !== 'admin') {
    res.status(403).json({ message: 'Not the owner of this restaurant' });
    return null;
  }
  return restaurant;
};

const updateRestaurant = async (req, res, next) => {
  try {
    const restaurant = await ensureOwnership(req, res);
    if (!restaurant) return;
    Object.assign(restaurant, req.body);
    await restaurant.save();
    res.json(restaurant);
  } catch (err) {
    next(err);
  }
};

const deleteRestaurant = async (req, res, next) => {
  try {
    const restaurant = await ensureOwnership(req, res);
    if (!restaurant) return;
    await MenuItem.deleteMany({ restaurant: restaurant._id });
    await restaurant.deleteOne();
    res.json({ message: 'Restaurant removed' });
  } catch (err) {
    next(err);
  }
};

// Menu management
const addMenuItem = async (req, res, next) => {
  try {
    const restaurant = await ensureOwnership(req, res);
    if (!restaurant) return;
    const item = await MenuItem.create({ ...req.body, restaurant: restaurant._id });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

const updateMenuItem = async (req, res, next) => {
  try {
    const restaurant = await ensureOwnership(req, res);
    if (!restaurant) return;
    const item = await MenuItem.findOneAndUpdate(
      { _id: req.params.itemId, restaurant: restaurant._id },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

const deleteMenuItem = async (req, res, next) => {
  try {
    const restaurant = await ensureOwnership(req, res);
    if (!restaurant) return;
    await MenuItem.deleteOne({ _id: req.params.itemId, restaurant: restaurant._id });
    res.json({ message: 'Menu item removed' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listRestaurants,
  getRestaurant,
  createRestaurant,
  myRestaurants,
  updateRestaurant,
  deleteRestaurant,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
};

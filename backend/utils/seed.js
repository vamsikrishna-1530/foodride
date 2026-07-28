require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

const OWNER_EMAIL = 'demo-owner@foodride.dev';

const RESTAURANTS = [
  {
    name: 'Spice Route',
    description: 'North Indian curries and tandoor classics.',
    cuisine: ['Indian', 'North Indian'],
    address: '12 MG Road, Bengaluru',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=60',
    rating: 4.5,
    menu: [
      { name: 'Butter Chicken', price: 280, category: 'Main Course', isVeg: false, description: 'Creamy tomato curry with tandoori chicken.' },
      { name: 'Paneer Tikka', price: 220, category: 'Starters', isVeg: true, description: 'Chargrilled cottage cheese skewers.' },
      { name: 'Garlic Naan', price: 60, category: 'Breads', isVeg: true },
      { name: 'Gulab Jamun', price: 90, category: 'Desserts', isVeg: true },
    ],
  },
  {
    name: 'Pizza Piazza',
    description: 'Wood-fired pizzas and Italian comfort food.',
    cuisine: ['Italian', 'Pizza'],
    address: '45 Brigade Street, Bengaluru',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=60',
    rating: 4.3,
    menu: [
      { name: 'Margherita Pizza', price: 250, category: 'Main Course', isVeg: true, description: 'Classic tomato, mozzarella and basil.' },
      { name: 'Pepperoni Pizza', price: 320, category: 'Main Course', isVeg: false },
      { name: 'Garlic Bread', price: 120, category: 'Starters', isVeg: true },
      { name: 'Tiramisu', price: 150, category: 'Desserts', isVeg: true },
    ],
  },
  {
    name: 'Dragon Wok',
    description: 'Indo-Chinese favorites, wok-tossed fresh.',
    cuisine: ['Chinese', 'Indo-Chinese'],
    address: '78 Residency Road, Bengaluru',
    image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=600&auto=format&fit=crop&q=60',
    rating: 4.1,
    menu: [
      { name: 'Veg Manchurian', price: 180, category: 'Starters', isVeg: true },
      { name: 'Chicken Fried Rice', price: 210, category: 'Main Course', isVeg: false },
      { name: 'Chilli Paneer', price: 220, category: 'Starters', isVeg: true },
      { name: 'Hot & Sour Soup', price: 130, category: 'Starters', isVeg: true },
    ],
  },
  {
    name: 'Sushi Central',
    description: 'Fresh sushi, sashimi and Japanese bowls.',
    cuisine: ['Japanese', 'Sushi'],
    address: '9 Indiranagar 100ft Road, Bengaluru',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=60',
    rating: 4.7,
    menu: [
      { name: 'California Roll', price: 340, category: 'Main Course', isVeg: false, description: '8 pcs crab, avocado, cucumber.' },
      { name: 'Vegetable Tempura', price: 260, category: 'Starters', isVeg: true },
      { name: 'Miso Soup', price: 110, category: 'Starters', isVeg: true },
      { name: 'Chicken Teriyaki Bowl', price: 380, category: 'Main Course', isVeg: false },
    ],
  },
  {
    name: 'Burger Barn',
    description: 'Juicy burgers, crispy fries and shakes.',
    cuisine: ['American', 'Fast Food'],
    address: '33 Koramangala 5th Block, Bengaluru',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60',
    rating: 4.2,
    menu: [
      { name: 'Classic Cheeseburger', price: 190, category: 'Main Course', isVeg: false },
      { name: 'Veggie Burger', price: 170, category: 'Main Course', isVeg: true },
      { name: 'Loaded Fries', price: 150, category: 'Starters', isVeg: true },
      { name: 'Chocolate Shake', price: 130, category: 'Beverages', isVeg: true },
    ],
  },
  {
    name: 'Curry Leaf',
    description: 'South Indian dosas, idlis and filter coffee.',
    cuisine: ['South Indian'],
    address: '5 Jayanagar 4th Block, Bengaluru',
    image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&auto=format&fit=crop&q=60',
    rating: 4.6,
    menu: [
      { name: 'Masala Dosa', price: 100, category: 'Main Course', isVeg: true },
      { name: 'Idli Sambar', price: 80, category: 'Main Course', isVeg: true },
      { name: 'Medu Vada', price: 70, category: 'Starters', isVeg: true },
      { name: 'Filter Coffee', price: 40, category: 'Beverages', isVeg: true },
    ],
  },
];

const seed = async () => {
  await connectDB();

  let owner = await User.findOne({ email: OWNER_EMAIL });
  if (!owner) {
    owner = await User.create({
      name: 'Demo Restaurant Owner',
      email: OWNER_EMAIL,
      password: 'password123',
      phone: '9000000000',
      role: 'owner',
      address: 'FoodRide HQ',
    });
    console.log(`Created demo owner: ${OWNER_EMAIL} / password123`);
  }

  for (const r of RESTAURANTS) {
    let restaurant = await Restaurant.findOne({ name: r.name, owner: owner._id });
    if (!restaurant) {
      restaurant = await Restaurant.create({
        owner: owner._id,
        name: r.name,
        description: r.description,
        cuisine: r.cuisine,
        address: r.address,
        image: r.image,
        rating: r.rating,
        isOpen: true,
      });
      console.log(`Created restaurant: ${r.name}`);
    }

    const existingCount = await MenuItem.countDocuments({ restaurant: restaurant._id });
    if (existingCount === 0) {
      await MenuItem.insertMany(
        r.menu.map((item) => ({
          ...item,
          restaurant: restaurant._id,
          isAvailable: true,
        }))
      );
      console.log(`  Added ${r.menu.length} menu items to ${r.name}`);
    }
  }

  console.log('Seeding complete.');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});

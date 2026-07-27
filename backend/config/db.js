const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/foodride';
  await mongoose.connect(uri);
  console.log(`[FoodRide] MongoDB connected: ${mongoose.connection.host}`);
};

module.exports = connectDB;

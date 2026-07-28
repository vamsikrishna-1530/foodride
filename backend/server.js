require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'foodride-backend' }));

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 6000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`[FoodRide] API running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('[FoodRide] Failed to connect to MongoDB', err);
    process.exit(1);
  });

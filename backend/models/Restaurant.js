const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    cuisine: [{ type: String }],
    address: { type: String, required: true },
    image: { type: String, default: '' },
    isOpen: { type: Boolean, default: true },
    rating: { type: Number, default: 4.2, min: 0, max: 5 },
    // Platform commission charged to this restaurant, kept low & configurable per-restaurant.
    commissionPercent: {
      type: Number,
      default: Number(process.env.RESTAURANT_COMMISSION_PERCENT) || 8,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);

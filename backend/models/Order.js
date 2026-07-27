const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    deliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    items: [orderItemSchema],
    deliveryAddress: { type: String, required: true },

    itemsTotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true, default: 0 },
    platformFee: { type: Number, required: true, default: 0 }, // small flat fee charged to customer
    restaurantCommission: { type: Number, required: true, default: 0 }, // % of itemsTotal, informational
    deliveryPartnerEarning: { type: Number, required: true, default: 0 }, // most of the deliveryFee
    grandTotal: { type: Number, required: true },

    status: {
      type: String,
      enum: [
        'placed',
        'accepted_by_restaurant',
        'preparing',
        'ready_for_pickup',
        'picked_up',
        'delivered',
        'cancelled',
      ],
      default: 'placed',
    },

    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    paymentId: { type: String, default: '' },
    razorpayOrderId: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

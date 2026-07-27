const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');

const getRazorpayInstance = () =>
  new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

// Creates a Razorpay order for an existing FoodRide order and returns details the
// frontend needs to open Razorpay Checkout.
const createPaymentOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (String(order.customer) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not your order' });
    }
    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Order already paid' });
    }

    const razorpay = getRazorpayInstance();
    const rpOrder = await razorpay.orders.create({
      amount: Math.round(order.grandTotal * 100), // paise
      currency: 'INR',
      receipt: String(order._id),
    });

    order.razorpayOrderId = rpOrder.id;
    await order.save();

    res.json({
      razorpayOrderId: rpOrder.id,
      amount: rpOrder.amount,
      currency: rpOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order._id,
    });
  } catch (err) {
    next(err);
  }
};

// Verifies the signature Razorpay Checkout returns after a successful payment.
const verifyPayment = async (req, res, next) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      order.paymentStatus = 'failed';
      await order.save();
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    order.paymentStatus = 'paid';
    order.paymentId = razorpay_payment_id;
    order.status = 'accepted_by_restaurant';
    await order.save();

    res.json({ message: 'Payment verified', order });
  } catch (err) {
    next(err);
  }
};

module.exports = { createPaymentOrder, verifyPayment };

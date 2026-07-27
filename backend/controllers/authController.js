const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, address, vehicleType } = req.body;
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'name, email, password and phone are required' });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
      role: ['customer', 'owner', 'delivery'].includes(role) ? role : 'customer',
      vehicleType,
    });

    res.status(201).json({ user: user.toSafeObject(), token: generateToken(user._id) });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({ user: user.toSafeObject(), token: generateToken(user._id) });
  } catch (err) {
    next(err);
  }
};

const me = async (req, res) => {
  res.json({ user: req.user.toSafeObject() });
};

module.exports = { register, login, me };

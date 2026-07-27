import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Stack,
  IconButton,
  Box,
  TextField,
  Button,
  Divider,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import client from '../../api/client.js';

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Cart = () => {
  const cart = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.address || '');
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  const estimatedDeliveryFee = cart.itemsTotal >= 500 ? 20 : cart.itemsTotal >= 200 ? 30 : 40;
  const platformFee = 3;
  const grandTotal = cart.itemsTotal + estimatedDeliveryFee + platformFee;

  const handleCheckout = async () => {
    setError('');
    if (!address.trim()) {
      setError('Please enter a delivery address');
      return;
    }
    setPlacing(true);
    try {
      const { data: order } = await client.post('/orders', {
        restaurantId: cart.restaurantId,
        items: cart.items.map((i) => ({ menuItem: i.menuItem, quantity: i.quantity })),
        deliveryAddress: address,
      });

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError('Unable to load payment gateway. Check your connection and try again.');
        setPlacing(false);
        return;
      }

      const { data: paymentOrder } = await client.post('/payment/create-order', { orderId: order._id });

      const rzp = new window.Razorpay({
        key: paymentOrder.keyId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: 'FoodRide',
        description: `Order from ${cart.restaurantName}`,
        order_id: paymentOrder.razorpayOrderId,
        theme: { color: '#FF5722' },
        handler: async (response) => {
          try {
            await client.post('/payment/verify', {
              orderId: order._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            cart.clearCart();
            navigate('/orders');
          } catch (err) {
            setError('Payment verification failed. Please contact support if money was deducted.');
          }
        },
        modal: { ondismiss: () => setPlacing(false) },
        prefill: { name: user?.name, contact: user?.phone, email: user?.email },
      });
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong placing your order');
      setPlacing(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Your cart is empty
        </Typography>
        <Button variant="contained" onClick={() => navigate('/restaurants')}>
          Browse restaurants
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Your cart
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {cart.restaurantName}
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack spacing={2}>
          {cart.items.map((item) => (
            <Stack key={item.menuItem} direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography>{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  ₹{item.price} x {item.quantity}
                </Typography>
              </Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton size="small" onClick={() => cart.removeItem(item.menuItem)}>
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography>{item.quantity}</Typography>
                <IconButton
                  size="small"
                  onClick={() => cart.addItem({ _id: cart.restaurantId, name: cart.restaurantName }, { _id: item.menuItem, name: item.name, price: item.price })}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          label="Delivery address"
          fullWidth
          multiline
          minRows={2}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">Items total</Typography>
            <Typography>₹{cart.itemsTotal.toFixed(2)}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">Delivery fee</Typography>
            <Typography>₹{estimatedDeliveryFee.toFixed(2)}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">Platform fee</Typography>
            <Typography>₹{platformFee.toFixed(2)}</Typography>
          </Stack>
          <Divider />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6">₹{grandTotal.toFixed(2)}</Typography>
          </Stack>
        </Stack>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button fullWidth size="large" variant="contained" onClick={handleCheckout} disabled={placing}>
        {placing ? 'Processing...' : `Pay ₹${grandTotal.toFixed(2)} with Razorpay`}
      </Button>
    </Container>
  );
};

export default Cart;

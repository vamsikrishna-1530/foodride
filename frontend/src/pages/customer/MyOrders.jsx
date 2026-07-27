import { useEffect, useState } from 'react';
import { Container, Typography, Paper, Stack, Chip, Box, CircularProgress, Divider } from '@mui/material';
import client from '../../api/client.js';

const STATUS_COLOR = {
  placed: 'default',
  accepted_by_restaurant: 'info',
  preparing: 'info',
  ready_for_pickup: 'warning',
  picked_up: 'warning',
  delivered: 'success',
  cancelled: 'error',
};

const STATUS_LABEL = {
  placed: 'Placed',
  accepted_by_restaurant: 'Accepted by restaurant',
  preparing: 'Preparing',
  ready_for_pickup: 'Ready for pickup',
  picked_up: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/orders/my').then(({ data }) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        My orders
      </Typography>
      {orders.length === 0 ? (
        <Typography color="text.secondary">No orders yet.</Typography>
      ) : (
        <Stack spacing={2}>
          {orders.map((order) => (
            <Paper key={order._id} sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="h6">{order.restaurant?.name}</Typography>
                <Chip label={STATUS_LABEL[order.status]} color={STATUS_COLOR[order.status]} size="small" />
              </Stack>
              <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                {new Date(order.createdAt).toLocaleString()}
              </Typography>
              <Divider sx={{ my: 1 }} />
              {order.items.map((item) => (
                <Stack key={item.menuItem} direction="row" justifyContent="space-between">
                  <Typography variant="body2">
                    {item.name} x {item.quantity}
                  </Typography>
                  <Typography variant="body2">₹{(item.price * item.quantity).toFixed(2)}</Typography>
                </Stack>
              ))}
              <Divider sx={{ my: 1 }} />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle1">Total</Typography>
                <Typography variant="subtitle1">₹{order.grandTotal.toFixed(2)}</Typography>
              </Stack>
              <Typography variant="caption" color={order.paymentStatus === 'paid' ? 'success.main' : 'text.secondary'}>
                Payment: {order.paymentStatus}
              </Typography>
            </Paper>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default MyOrders;

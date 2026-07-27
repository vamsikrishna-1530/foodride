import { useEffect, useState } from 'react';
import { Container, Typography, Paper, Stack, Chip, Box, Button, Divider } from '@mui/material';
import client from '../../api/client.js';

const NEXT_STATUS = {
  accepted_by_restaurant: 'preparing',
  preparing: 'ready_for_pickup',
};

const NEXT_LABEL = {
  accepted_by_restaurant: 'Start preparing',
  preparing: 'Mark ready for pickup',
};

const STATUS_LABEL = {
  placed: 'Placed (awaiting payment)',
  accepted_by_restaurant: 'Accepted — start preparing',
  preparing: 'Preparing',
  ready_for_pickup: 'Ready for pickup',
  picked_up: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const OwnerOrders = () => {
  const [orders, setOrders] = useState([]);

  const load = () => client.get('/orders/restaurant').then(({ data }) => setOrders(data));

  useEffect(() => {
    load();
  }, []);

  const advance = async (order) => {
    const nextStatus = NEXT_STATUS[order.status];
    if (!nextStatus) return;
    await client.put(`/orders/${order._id}/status`, { status: nextStatus });
    load();
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Incoming orders
      </Typography>
      {orders.length === 0 ? (
        <Typography color="text.secondary">No orders yet.</Typography>
      ) : (
        <Stack spacing={2}>
          {orders.map((order) => (
            <Paper key={order._id} sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="h6">{order.customer?.name}</Typography>
                <Chip label={STATUS_LABEL[order.status]} size="small" />
              </Stack>
              <Typography color="text.secondary" variant="body2">
                {order.customer?.phone} · {order.deliveryAddress}
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
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="subtitle2">Items total</Typography>
                <Typography variant="subtitle2">₹{order.itemsTotal.toFixed(2)}</Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Payment: {order.paymentStatus}
              </Typography>
              <Box sx={{ mt: 2 }}>
                {NEXT_STATUS[order.status] && (
                  <Button variant="contained" size="small" onClick={() => advance(order)}>
                    {NEXT_LABEL[order.status]}
                  </Button>
                )}
              </Box>
            </Paper>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default OwnerOrders;

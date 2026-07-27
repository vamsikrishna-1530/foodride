import { useEffect, useState } from 'react';
import { Container, Typography, Paper, Stack, Chip, Box, Button } from '@mui/material';
import client from '../../api/client.js';

const STATUS_LABEL = {
  picked_up: 'Picked up — deliver now',
  delivered: 'Delivered',
};

const MyDeliveries = () => {
  const [orders, setOrders] = useState([]);

  const load = () => client.get('/orders/delivery/mine').then(({ data }) => setOrders(data));

  useEffect(() => {
    load();
  }, []);

  const markDelivered = async (id) => {
    await client.put(`/orders/${id}/status`, { status: 'delivered' });
    load();
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        My deliveries
      </Typography>
      {orders.length === 0 ? (
        <Typography color="text.secondary">You haven't accepted any deliveries yet.</Typography>
      ) : (
        <Stack spacing={2}>
          {orders.map((order) => (
            <Paper key={order._id} sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6">{order.restaurant?.name}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {order.customer?.name} · {order.customer?.phone}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Drop: {order.deliveryAddress}
                  </Typography>
                </Box>
                <Stack alignItems="flex-end" spacing={1}>
                  <Chip label={`Earning ₹${order.deliveryPartnerEarning}`} color="secondary" />
                  <Chip label={STATUS_LABEL[order.status] || order.status} size="small" />
                  {order.status === 'picked_up' && (
                    <Button variant="contained" size="small" onClick={() => markDelivered(order._id)}>
                      Mark delivered
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default MyDeliveries;

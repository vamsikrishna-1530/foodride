import { useEffect, useState } from 'react';
import { Container, Typography, Paper, Stack, Button, Chip, Box } from '@mui/material';
import client from '../../api/client.js';

const AvailableOrders = () => {
  const [orders, setOrders] = useState([]);

  const load = () => client.get('/orders/delivery/available').then(({ data }) => setOrders(data));

  useEffect(() => {
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  const accept = async (id) => {
    await client.post(`/orders/${id}/accept`);
    load();
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Available deliveries
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        FoodRide keeps a low flat platform fee per delivery so most of the delivery charge goes to you.
      </Typography>
      {orders.length === 0 ? (
        <Typography color="text.secondary">No orders ready for pickup right now. Check back soon.</Typography>
      ) : (
        <Stack spacing={2}>
          {orders.map((order) => (
            <Paper key={order._id} sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6">{order.restaurant?.name}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    Pickup: {order.restaurant?.address}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Drop: {order.deliveryAddress}
                  </Typography>
                </Box>
                <Stack alignItems="flex-end" spacing={1}>
                  <Chip label={`Earn ₹${order.deliveryPartnerEarning}`} color="secondary" />
                  <Button variant="contained" size="small" onClick={() => accept(order._id)}>
                    Accept
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default AvailableOrders;

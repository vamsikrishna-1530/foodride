import { useEffect, useState } from 'react';
import { Container, Typography, Paper, Grid, Box } from '@mui/material';
import client from '../../api/client.js';

const Earnings = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    client.get('/orders/delivery/mine').then(({ data }) => setOrders(data));
  }, []);

  const delivered = orders.filter((o) => o.status === 'delivered');
  const totalEarnings = delivered.reduce((sum, o) => sum + o.deliveryPartnerEarning, 0);
  const today = new Date().toDateString();
  const todayEarnings = delivered
    .filter((o) => new Date(o.createdAt).toDateString() === today)
    .reduce((sum, o) => sum + o.deliveryPartnerEarning, 0);

  const stats = [
    { label: "Today's earnings", value: `₹${todayEarnings.toFixed(2)}` },
    { label: 'Total earnings', value: `₹${totalEarnings.toFixed(2)}` },
    { label: 'Deliveries completed', value: delivered.length },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Earnings
      </Typography>
      <Grid container spacing={3}>
        {stats.map((s) => (
          <Grid item xs={12} sm={4} key={s.label}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main">
                {s.value}
              </Typography>
              <Typography color="text.secondary">{s.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 4 }}>
        <Typography color="text.secondary">
          FoodRide charges just a small flat platform fee per delivery — most of the delivery fee goes directly
          into your pocket.
        </Typography>
      </Box>
    </Container>
  );
};

export default Earnings;

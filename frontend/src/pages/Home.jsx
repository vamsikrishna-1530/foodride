import { Box, Button, Container, Grid, Typography, Paper, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import StorefrontIcon from '@mui/icons-material/Storefront';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import RestaurantIcon from '@mui/icons-material/RestaurantMenu';
import PaymentIcon from '@mui/icons-material/Payment';
import { useAuth } from '../context/AuthContext.jsx';

const roleCards = [
  {
    icon: <RestaurantIcon fontSize="large" />,
    title: 'Order food',
    description: 'Browse local restaurants and get food delivered fast.',
    cta: 'Browse restaurants',
    to: '/restaurants',
  },
  {
    icon: <StorefrontIcon fontSize="large" />,
    title: 'List your restaurant',
    description: 'Only 8% commission — keep more of every order, unlike typical 20-30% aggregator cuts.',
    cta: 'Become a partner',
    to: '/register?role=owner',
  },
  {
    icon: <TwoWheelerIcon fontSize="large" />,
    title: 'Deliver & earn',
    description: 'Low platform fee per delivery means more of the delivery fee goes straight to you.',
    cta: 'Join as delivery partner',
    to: '/register?role=delivery',
  },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <Box>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #FF5722 0%, #FF8A65 60%, #00B074 140%)',
          color: '#fff',
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" sx={{ fontSize: { xs: 34, md: 48 }, mb: 2 }}>
            Food delivery that treats owners & riders fairly.
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 400, mb: 4, opacity: 0.95 }}>
            FoodRide connects hungry customers with local restaurants and delivery partners —
            with the lowest platform fees around, so more value stays with the people doing the work.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              component={Link}
              to="/restaurants"
              size="large"
              variant="contained"
              sx={{ bgcolor: '#fff', color: 'primary.main', '&:hover': { bgcolor: '#fff' } }}
            >
              Order now
            </Button>
            {!user && (
              <Button
                component={Link}
                to="/register"
                size="large"
                variant="outlined"
                sx={{ borderColor: '#fff', color: '#fff' }}
              >
                Create an account
              </Button>
            )}
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {roleCards.map((card) => (
            <Grid item xs={12} md={4} key={card.title}>
              <Paper sx={{ p: 4, height: '100%', textAlign: 'center' }}>
                <Box sx={{ color: 'primary.main', mb: 2 }}>{card.icon}</Box>
                <Typography variant="h5" sx={{ mb: 1 }}>
                  {card.title}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  {card.description}
                </Typography>
                <Button component={Link} to={card.to} variant="contained" color="primary">
                  {card.cta}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Paper sx={{ mt: 6, p: 4, display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <PaymentIcon color="secondary" fontSize="large" />
          <Box>
            <Typography variant="h6">Secure payments via Razorpay</Typography>
            <Typography color="text.secondary">
              Cards, UPI, netbanking and wallets — all handled through Razorpay's checkout, with
              signature verification on every order before it's confirmed.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Home;

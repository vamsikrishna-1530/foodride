import { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Box,
  Chip,
  Stack,
  CircularProgress,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { Link } from 'react-router-dom';
import client from '../../api/client.js';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchRestaurants = async (q) => {
    setLoading(true);
    const { data } = await client.get('/restaurants', { params: q ? { search: q } : {} });
    setRestaurants(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRestaurants('');
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => fetchRestaurants(search), 350);
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Restaurants near you
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Handpicked local restaurants — every order helps keep more money with the people who cook it.
      </Typography>
      <TextField
        placeholder="Search restaurants..."
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 4, maxWidth: 480 }}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : restaurants.length === 0 ? (
        <Typography color="text.secondary">No restaurants found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {restaurants.map((r) => (
            <Grid item xs={12} sm={6} md={4} key={r._id}>
              <Card>
                <CardActionArea component={Link} to={`/restaurants/${r._id}`}>
                  <CardMedia component="img" height="160" image={r.image || FALLBACK_IMAGE} alt={r.name} />
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">{r.name}</Typography>
                      <Chip
                        icon={<StarIcon sx={{ fontSize: 16, color: '#fff !important' }} />}
                        label={r.rating.toFixed(1)}
                        size="small"
                        color="secondary"
                      />
                    </Stack>
                    <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                      {(r.cuisine || []).join(', ') || 'Multi-cuisine'}
                    </Typography>
                    <Typography variant="body2" color={r.isOpen ? 'success.main' : 'error.main'}>
                      {r.isOpen ? 'Open now' : 'Closed'}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default RestaurantList;

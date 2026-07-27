import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import client from '../../api/client.js';
import { useCart } from '../../context/CartContext.jsx';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const cart = useCart();

  useEffect(() => {
    client.get(`/restaurants/${id}`).then(({ data }) => {
      setData(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data) return null;
  const { restaurant, menu } = data;

  const categories = [...new Set(menu.map((m) => m.category))];

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4">{restaurant.name}</Typography>
      <Typography color="text.secondary" sx={{ mb: 1 }}>
        {restaurant.description}
      </Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 4 }}>
        {(restaurant.cuisine || []).map((c) => (
          <Chip key={c} label={c} size="small" />
        ))}
        <Chip label={restaurant.isOpen ? 'Open now' : 'Closed'} color={restaurant.isOpen ? 'success' : 'default'} size="small" />
      </Stack>

      {categories.map((category) => (
        <Box key={category} sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {category}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {menu
              .filter((m) => m.category === category)
              .map((item) => (
                <Grid item xs={12} sm={6} key={item._id}>
                  <Card sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            border: '2px solid',
                            borderColor: item.isVeg ? 'success.main' : 'error.main',
                          }}
                        />
                        <Typography variant="subtitle1">{item.name}</Typography>
                      </Stack>
                      <Typography color="text.secondary" variant="body2">
                        {item.description}
                      </Typography>
                      <Typography sx={{ mt: 1, fontWeight: 600 }}>₹{item.price}</Typography>
                    </CardContent>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      disabled={!item.isAvailable || !restaurant.isOpen}
                      onClick={() => cart.addItem(restaurant, item)}
                    >
                      Add
                    </Button>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Box>
      ))}
    </Container>
  );
};

export default RestaurantDetail;

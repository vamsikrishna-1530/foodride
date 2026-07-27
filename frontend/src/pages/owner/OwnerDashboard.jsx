import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Chip,
} from '@mui/material';
import { Link } from 'react-router-dom';
import client from '../../api/client.js';

const OwnerDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', cuisine: '', address: '', image: '' });

  const load = () => client.get('/restaurants/mine').then(({ data }) => setRestaurants(data));

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    await client.post('/restaurants', {
      ...form,
      cuisine: form.cuisine.split(',').map((c) => c.trim()).filter(Boolean),
    });
    setOpen(false);
    setForm({ name: '', description: '', cuisine: '', address: '', image: '' });
    load();
  };

  const toggleOpen = async (restaurant) => {
    await client.put(`/restaurants/${restaurant._id}`, { isOpen: !restaurant.isOpen });
    load();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">Your restaurants</Typography>
          <Typography color="text.secondary">FoodRide takes just 8% commission per order.</Typography>
        </Box>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add restaurant
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {restaurants.map((r) => (
          <Grid item xs={12} sm={6} md={4} key={r._id}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">{r.name}</Typography>
                  <Chip
                    label={r.isOpen ? 'Open' : 'Closed'}
                    color={r.isOpen ? 'success' : 'default'}
                    size="small"
                    onClick={() => toggleOpen(r)}
                  />
                </Stack>
                <Typography color="text.secondary" variant="body2">
                  {r.address}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Commission: {r.commissionPercent}%
                </Typography>
              </CardContent>
              <CardActions>
                <Button component={Link} to={`/owner/restaurants/${r._id}/menu`} size="small">
                  Manage menu
                </Button>
                <Button component={Link} to="/owner/orders" size="small">
                  View orders
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add a restaurant</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Name" fullWidth value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <TextField
              label="Description"
              fullWidth
              multiline
              minRows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <TextField
              label="Cuisine (comma separated)"
              fullWidth
              value={form.cuisine}
              onChange={(e) => setForm({ ...form, cuisine: e.target.value })}
            />
            <TextField label="Address" fullWidth value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <TextField label="Image URL" fullWidth value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={!form.name || !form.address}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OwnerDashboard;

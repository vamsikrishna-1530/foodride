import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Stack,
  Paper,
  Button,
  TextField,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import client from '../../api/client.js';

const emptyForm = { name: '', description: '', price: '', category: 'Main Course', image: '', isVeg: true, isAvailable: true };

const ManageMenu = () => {
  const { id } = useParams();
  const [menu, setMenu] = useState([]);
  const [restaurantName, setRestaurantName] = useState('');
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = () =>
    client.get(`/restaurants/${id}`).then(({ data }) => {
      setMenu(data.menu);
      setRestaurantName(data.restaurant.name);
    });

  useEffect(() => {
    load();
  }, [id]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item._id);
    setForm(item);
    setOpen(true);
  };

  const handleSave = async () => {
    const payload = { ...form, price: Number(form.price) };
    if (editingId) {
      await client.put(`/restaurants/${id}/menu/${editingId}`, payload);
    } else {
      await client.post(`/restaurants/${id}/menu`, payload);
    }
    setOpen(false);
    load();
  };

  const handleDelete = async (itemId) => {
    await client.delete(`/restaurants/${id}/menu/${itemId}`);
    load();
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">{restaurantName} — Menu</Typography>
        <Button variant="contained" onClick={openCreate}>
          Add item
        </Button>
      </Stack>

      <Stack spacing={2}>
        {menu.map((item) => (
          <Paper key={item._id} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle1">
                {item.name} {!item.isAvailable && '(unavailable)'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.category} · ₹{item.price}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <IconButton onClick={() => openEdit(item)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(item._id)}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'Edit item' : 'Add item'}</DialogTitle>
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
              label="Price (₹)"
              type="number"
              fullWidth
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <TextField
              select
              label="Category"
              fullWidth
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {['Starters', 'Main Course', 'Breads', 'Desserts', 'Beverages'].map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
            <TextField label="Image URL" fullWidth value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            <FormControlLabel
              control={<Switch checked={form.isVeg} onChange={(e) => setForm({ ...form, isVeg: e.target.checked })} />}
              label="Vegetarian"
            />
            <FormControlLabel
              control={<Switch checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} />}
              label="Available"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={!form.name || !form.price}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageMenu;

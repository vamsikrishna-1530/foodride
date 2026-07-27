import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
  Stack,
  Link as MuiLink,
  ToggleButtonGroup,
  ToggleButton,
  MenuItem,
} from '@mui/material';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Logo from '../../components/Logo.jsx';

const ROLE_HOME = { customer: '/restaurants', owner: '/owner', delivery: '/delivery' };

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: searchParams.get('role') || 'customer',
    vehicleType: 'bike',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register(form);
      navigate(ROLE_HOME[user.role] || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Logo size={44} />
        </Box>
        <Typography variant="h5" textAlign="center" sx={{ mb: 3 }}>
          Create your account
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">
              I want to join as
            </Typography>
            <ToggleButtonGroup
              value={form.role}
              exclusive
              fullWidth
              onChange={(e, value) => value && setForm({ ...form, role: value })}
            >
              <ToggleButton value="customer">Customer</ToggleButton>
              <ToggleButton value="owner">Owner</ToggleButton>
              <ToggleButton value="delivery">Delivery</ToggleButton>
            </ToggleButtonGroup>

            <TextField
              label="Full name"
              required
              fullWidth
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              label="Email"
              type="email"
              required
              fullWidth
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <TextField
              label="Phone"
              required
              fullWidth
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <TextField
              label="Password"
              type="password"
              required
              fullWidth
              helperText="At least 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <TextField
              label={form.role === 'customer' ? 'Delivery address' : 'Address'}
              required
              fullWidth
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            {form.role === 'delivery' && (
              <TextField
                select
                label="Vehicle type"
                fullWidth
                value={form.vehicleType}
                onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
              >
                <MenuItem value="bike">Bike</MenuItem>
                <MenuItem value="scooter">Scooter</MenuItem>
                <MenuItem value="bicycle">Bicycle</MenuItem>
                <MenuItem value="car">Car</MenuItem>
              </TextField>
            )}
            <Button type="submit" variant="contained" size="large" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign up'}
            </Button>
          </Stack>
        </Box>
        <Typography sx={{ mt: 3 }} textAlign="center">
          Already have an account?{' '}
          <MuiLink component={Link} to="/login">
            Login
          </MuiLink>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Register;
